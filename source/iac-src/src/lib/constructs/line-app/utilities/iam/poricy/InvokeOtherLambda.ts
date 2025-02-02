/* import aws cdk */
import { PolicyStatement, PolicyStatementProps } from 'aws-cdk-lib/aws-iam';
/* import util */
import { isString } from 'lodash';

/**
 * @class 別のLambda起動 ポリシー
 */
export default class InvokeOtherLambda extends PolicyStatement {
    constructor(resources?: string|PolicyStatementProps) {
        // 入力補完
        const _props = isString(resources) ? { resources: [resources] } : resources;
        // 拡張
        super({
            ...(_props ?? {}), // 継承
            actions: [ // 別のLambda起動
                'lambda:InvokeFunction',
                'lambda:InvokeFunctionUrl',
                'lambda:InvokeAsync'
            ],
            resources: _props?.resources ?? ['*'], // リソース = 全て
        });
    }
}