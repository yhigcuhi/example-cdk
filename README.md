# example-cdk
AWS CDK お試し Docker上の環境で

## ゴール
+ CloudFront + S3での静的サイトの構築
+ CloudFront カスタムドメインを設定
+ APIGateway (Rest API) + Lambda の構築
+ SNS + Lambda の構築

## 資材構成
/
    ┗ /docker (各コンテナ用)
    ┗ /cdk-src (CDKのコンテナを実行するための環境)
        ┗ /lib (各 サービスごとの AWS IaC)
            ┗ front-end-cdk.ts (フロントエンド環境構築向け IaC)
    ┗ /front-src (CloudFront + S3で動くフロントエンド開発用の環境)
    ┗ /backend-src (API Gateway + Lambda で動くバックエンド開発用の環境)