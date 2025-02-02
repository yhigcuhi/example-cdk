/* import aws cdk */
import { LogGroup } from 'aws-cdk-lib/aws-logs';
/* import util */
import { isString } from 'lodash';
/* import type */
import type { LogGroupProps } from 'aws-cdk-lib/aws-logs';
import type { Construct } from 'constructs'

/**
 * @class 共通的な 基本的なロググループの関数作るやつ
 */
export default class BasicLogGroup extends LogGroup {
    /**
     * コンストラクタ
     * @param scope 作成するstackとか タスクを実行する元
     * @param id 識別子
     * @param logGroupName ロググループ名 またはオプション
     * @param props オプション
     */
    constructor(scope: Construct, id: string, logGroupName: string|LogGroupProps, props?: LogGroupProps) {
        // 入力補完
        const _props = isString(logGroupName) ? {...(props ?? {}), logGroupName} : logGroupName;
        // super拡張
        super(scope, id, _props);
    }
}