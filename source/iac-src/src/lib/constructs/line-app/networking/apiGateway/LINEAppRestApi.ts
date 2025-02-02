/* import aws cdk */
import { RestApiProps } from 'aws-cdk-lib/aws-apigateway';
/* import 共通部品 */
import { AppRestAPI } from '@/lib/constructs/common';
/* import 定数 */
import { APP_ENV } from '@/config/app';
/* import util */
import { isString, isUndefined } from 'lodash';
/* import type */
import type { Construct } from 'constructs'

/**
 * @class 共通的な アプリケーションの REST APIのAPI Gatewayを作る
 */
export default class LINEAppRestApi extends AppRestAPI {
    /**
     * コンストラクタ
     * @param scope 作成するstackとか タスクを実行する元
     * @param id Lamdbda ファンクション名などの識別子
     * @param props オプション
     */
    constructor(scope: Construct, id?: string|RestApiProps, props?: RestApiProps) {
        // 入力補完
        const _props = isString(id) || isUndefined(id) ? props : id;
        // super 拡張
        super(scope, isString(id) ? id : `${APP_ENV}-LINEAppRestAPIGateway`, {
            ...(_props ?? {}),
        });
    }
}