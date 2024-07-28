/* CloudFront + S3 のフロントエンド IaC 参考: https://github.com/kodai305/cdk-staticfile-deploy */
/* import cdk */
import {
    Stack,
    RemovalPolicy,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origin,
    aws_iam as iam,
    aws_s3_deployment as s3_deployment,
    Duration
} from 'aws-cdk-lib';
/* import type */
import type { App, StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

// CloudFront + S3 の静的サイトデプロイ タスク
export class CdkStaticfileDeployStack extends Stack {
    // コンストラクタ
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // 作成する 静的サイト S3バケットの定義
        const bucket = this.makeStaticBucket();
        // CloudFront ディストリビューション 作成
        const distribution = this.makeDistribution(bucket);
        // S3のバケットポリシーに反映
        bucket.addToResourcePolicy(this.makeOACBukeyPolicyStatement(bucket, distribution));

        // S3へのファイルをデプロイ(アップロード) 
        new s3_deployment.BucketDeployment(this, 'S3Deployment', {
            // 指定ファイルの S3アップロード  (パス = cdk.jsonからのパス)
            sources: [s3_deployment.Source.asset('./static_files/')],
            destinationBucket: bucket,
            // cloudfrontのキャッシュ削除
            distribution, // cloudfrontのキャッシュ削除対象パス
            distributionPaths: ['/*'] // cloudfrontのキャッシュ削除対象パス
        });
    }

    /**
     * @returns {s3.Bucket} 静的サイトのs3バケットの定義
     */
    private makeStaticBucket(): s3.Bucket {
        // TODO:静的サイト
        return new s3.Bucket(this, 'StaticfileBucket', {
            bucketName: 's3-static-l09079yhigu', // 作成バケット名
            removalPolicy: RemovalPolicy.DESTROY, // TODO: バケットポリシーをデプロイのたびに削除的な？
        });
    }

    /**
     * @param {s3.IBucket} originS3Bucket オリジンとなるS3バケット
     * @returns {cloudfront.Distribution} 生成したディストリビューション
     */
    private makeDistribution(originS3Bucket: s3.IBucket): cloudfront.Distribution {
        // ディストリビューション作成
        const distribution = new cloudfront.Distribution(this, 'StaticfileDistribution', {
            // ルートインデックス
            defaultRootObject: 'index.html',
            // ディストリビューションの設定
            defaultBehavior: {
                origin: new origin.S3Origin(originS3Bucket), // オリジン = s3にアクセスするオリジン
                functionAssociations: [ // 利用するCloudfront 関数 一覧
                    // Cloudfornt Function for Viewer Request
                    {
                        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                        function: this.makeViewerRequestCloudFunction(),
                    },
                ],
            },
            // エラーレスポンス
            errorResponses: [
                /* React用の xxx.com/index.html へのアクセスのための設定 */
                // xxx.com/hogehoge/ → xxx.com/index.htmlへ
                {
                  ttl: Duration.seconds(300),
                  httpStatus: 403,
                  responseHttpStatus: 403,
                  responsePagePath: '/index.html',
                },
                // xxx.com/hogehoge/index.html → xxx.com/index.htmlへ
                {
                  ttl: Duration.seconds(300),
                  httpStatus: 404,
                  responseHttpStatus: 404,
                  responsePagePath: '/index.html',
                },
            ],
            // 説明
            comment: 'ditribution for s3-bucket-l09079yhigu',
        });

        // Cloudfrontのディストリビューション拡張
        const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;
        cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', this.makeOriginAccessControl().getAtt('Id')); // OAC 利用
        // cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.DomainName', originS3Bucket.bucketRegionalDomainName); // TOOD:必要？
        cfnDistribution.addOverride('Properties.DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity', ''); // デフォルトで設定される OAIは利用しない
        cfnDistribution.addPropertyDeletionOverride('DistributionConfig.Origins.0.CustomOriginConfig'); // TODO: 必要？

        // 設定完了したディストリビューション返却
        return distribution;
    }
    /**
     * @returns {cloudfront.CfnOriginAccessControl} バケットポリシー用の OAC
     */
    private makeOriginAccessControl(): cloudfront.CfnOriginAccessControl {
        return new cloudfront.CfnOriginAccessControl(this, 'StaticfileCloudFrontOAC', {
            originAccessControlConfig: {
                name: 's3-static-l09079yhigu', // OAC名
                originAccessControlOriginType: 's3', // 何用 = S3
                // セキュリティ署名
                signingBehavior: 'always',
                signingProtocol: 'sigv4', // 署名プロトコル
                // OAC説明
                description: 'OAC for s3-bucket-l09079yhigu',
            },
        });
    }
    /**
     * @returns {cloudfront.Function} viewer request用のCloudFunction
     */
    private makeViewerRequestCloudFunction(): cloudfront.Function {
        return new cloudfront.Function(this, 'ViewerRequestFunction', {
            // ファンクション名
            functionName: `viewer_request_function`,
            // ローカル管理 ファイルから作成 (パス = cdk.jsonからのパス)
            code: cloudfront.FunctionCode.fromFile({filePath: './cloudfront_functions/viewer_request_function.js',}),
        });
    }

    /**
     * @param bucket 対象のS3 バケット
     * @param distribution 対象のOACのディストリビューション
     * @returns 
     */
    private makeOACBukeyPolicyStatement(bucket: s3.IBucket, distribution: cloudfront.IDistribution): iam.PolicyStatement {
        // バケットポリシーの 1 ステートメント
        return new iam.PolicyStatement({
            sid: 'AllowCloudFrontServicePrincipalByCDK', // 管理用のSID
            effect: iam.Effect.ALLOW, // 下記 許可
            actions: ['s3:GetObject'], // 許可アクション = GETファイル
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')], // 許可アクセス = CloudFrontから
            resources: [`${bucket.bucketArn}/*`], // 許可範囲 = バケットの中全て
            conditions: { // 許可条件 = 下記の条件みたす
                'StringEquals': { // 文字完全一致
                    // 自身のAWSアカウント内のディストリビューションのみ
                    'AWS:SourceArn': `arn:aws:cloudfront::${Stack.of(this).account}:distribution/${distribution.distributionId}`
                }
            },
        });
    }
}

class HelloCdkStack extends Stack {
    constructor(scope: App, id: string, props?: StackProps) {
      super(scope, id, props);
  
      new s3.Bucket(this, 'MyFirstBucket', {
        versioned: true
      });
    }
}