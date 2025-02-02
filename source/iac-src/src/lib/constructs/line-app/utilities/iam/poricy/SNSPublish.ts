/* import aws cdk */
import { PolicyStatement, PolicyStatementProps } from 'aws-cdk-lib/aws-iam';
/* import util */
import { isString } from 'lodash';

/**
 * @class SNS publish ポリシー
 */
export default class SNSPublish extends PolicyStatement {
    constructor(resources?: string|PolicyStatementProps) {
        // 入力補完
        const _props = isString(resources) ? { resources: [resources] } : resources;
        // 拡張
        super({
            ...(_props ?? {}), // 継承
            actions: [ // SNS publish
                'SNS:Publish',
            ],
            resources: _props?.resources ?? ['*'], // リソース = 全て
        });
    }
}