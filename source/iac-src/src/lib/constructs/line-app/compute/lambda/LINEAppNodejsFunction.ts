/* import aws cdk */
import { Runtime } from 'aws-cdk-lib/aws-lambda';
/* import 共通部品 */
import { BasicNodejsFunction } from '@/lib/constructs/common';
/* import 定数 */
import { APP_ENV, APP_NAME } from '@/config/app';
/* import type */
import type { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import type { Construct } from 'constructs';

/**
 * @class 共通的な LINE アプリで使う Lambdaの 基本的なNodejs Lambda関数作るやつ
 */
export default class LINEAppNodejsFunction extends BasicNodejsFunction {
    /**
     * コンストラクタ
     * @param scope 作成するstackとか タスクを実行する元
     * @param id Lamdbda ファンクション名などの識別子
     * @param props 引数
     */
    constructor(scope: Construct, id: string, props?: NodejsFunctionProps) {
        // ランタイム 指定なし → デフォルト Nodejs20
        super(scope, id, {
            ...props,
            runtime: props?.runtime ?? Runtime.NODEJS_20_X, // 補完: 実行環境
        })
    }
}