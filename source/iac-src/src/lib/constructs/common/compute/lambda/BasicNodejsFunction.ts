/* import aws cdk */
import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
/* import 定数 */
import { APP_ENV, APP_NAME } from '@/config/app';
/* import aws cdk 独自部品 */
import { BasicLogGroup } from '@/lib/constructs/common';
/* import type */
import type { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'

/**
 * @class 共通的な 基本的なNodejs Lambda関数作るやつ
 */
export default class BasicNodejsFunction extends NodejsFunction {
    /**
     * コンストラクタ
     * @param scope 作成するstackとか タスクを実行する元
     * @param id Lamdbda ファンクション名などの識別子
     * @param props オプション
     */
    constructor(scope: Construct, id: string, props?: NodejsFunctionProps) {
        // 入力補完
        const functionName = `${APP_ENV}-${APP_NAME}-${props?.functionName || id}`; // 関数名 = ステージング-アプリ名-関数名 形式
        // super拡張
        super(scope, id, {
            ...props,
            functionName, // 関数名
            timeout: props?.timeout ?? Duration.seconds(30), // タイムアウト 30秒
            memorySize: props?.memorySize ?? 1024, // デフォルト 1024 MB
            runtime: props?.runtime ?? Runtime.NODEJS_LATEST, // 実行環境 デフォルト Nodejs最新
            logGroup: props?.logGroup ?? new BasicLogGroup(scope, `${id}LogGroup`, `/aws/lambda/${functionName}`), // Lambdaログ出力場所 = /aws/lambda/関数名 形式
            environment: { // 環境変数の拡張
                ...(props?.environment ?? {}), // 設定値継承
                APP_ENV, // ステージング
                APP_NAME, // アプリ名
            },
        })
    }
}