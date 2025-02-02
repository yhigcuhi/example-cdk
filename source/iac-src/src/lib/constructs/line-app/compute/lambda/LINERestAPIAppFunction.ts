/* import aws cdk */
import { Code } from 'aws-cdk-lib/aws-lambda';
/* import 親 */
import LINEAppNodejsFunction from './LINEAppNodejsFunction';
/* import 定数 */
import { APP_ASSET_PATH } from '@/config/app';
/* import util */
import { isString, isUndefined } from 'lodash';
/* import type */
import type { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'

/**
 * @class LINE Rest APIバックエンド Lambda
 */
export default class LINERestAPIAppFunction extends LINEAppNodejsFunction {
    /**
     * コンストラクタ
     * @param scope 作成するstackとか タスクを実行する元
     * @param id Lamdbda ファンクション名などの識別子
     * @param props オプション
     */
    constructor(scope: Construct, id?: string|NodejsFunctionProps, props?: NodejsFunctionProps) {
        // 入力補完
        const _props = isString(id) || isUndefined(id) ? props : id;
        // super 拡張
        super(scope, isString(id) ? id : 'LINERestAPIAppFunction', {
            ...(_props ?? {}),
            functionName: _props?.functionName || 'line-rest-api', // 関数名
            code: _props?.code ?? Code.fromAsset(APP_ASSET_PATH), // リリース資材の格納ディレクトリ TODO:プロジェクトによりけりどうする bucketからアップロードするパターンなら使わん バージョン管理付きも必要 S3Key serverless/xxx-line-api/prd/1738214622969-2025-01-30T05:23:42.969Z/healthy.zipのタイムスタンプのところ
        });
    }
}