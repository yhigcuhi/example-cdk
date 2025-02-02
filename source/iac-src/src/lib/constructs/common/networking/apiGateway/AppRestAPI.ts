/* import aws cdk */
import { RestApi, LambdaIntegration, RestApiProps } from 'aws-cdk-lib/aws-apigateway';
/* import 定数 */
import { APP_ENV, APP_NAME } from '@/config/app';
/* import type */
import type { Function } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs'


/**
 * https://dev.classmethod.jp/articles/aws-cdk-101-typescript/ 参考
 * @class 共通的な アプリケーションの REST APIのAPI Gatewayを作る
 */
export default class AppRestAPI extends RestApi {
    /**
     * コンストラクタ
     * @param scope 作成するstackとか タスクを実行する元
     * @param id Lamdbda ファンクション名などの識別子
     * @param props 引数
     */
    constructor(scope: Construct, id: string, props?: RestApiProps) {
        // 入力補完
        const restApiName = `${APP_ENV}-${APP_NAME}-${props?.restApiName || id}`; // 関数名 = ステージング-アプリ名-関数名 形式
        // 拡張
        super(scope, id, {
            ...(props ?? {}), // 継承
            restApiName, // restApiName
            deployOptions: { // デプロイオプション
                ...(props?.deployOptions ?? {}), // デプロイオプション
                stageName: props?.deployOptions?.stageName || APP_ENV, // ステージング = 環境ごと
              },
        });
    }
    /**
     * ラムダ統合のAPI追加
     * @param {string} endpoint
     * @param {"GET"|"POST"とか} method
     * @param {Function} lambda 統合するLambda
     * @returns {AppRestAPI} 追加後の自身
     */
    appendFunction(endpoint: string, method: string, lambda: Function) {
        const resource = this.root.addResource(endpoint, {
            // CORSの設定 TODO
            // defaultCorsPreflightOptions: {
            //     allowOrigins: [],
            // }
        })
        resource.addMethod(method, new LambdaIntegration(lambda))
        // 設定後の自身
        return this;
    }
}