/* import aws cdk */
import { PolicyStatement, PolicyStatementProps } from 'aws-cdk-lib/aws-iam';
/* import util */
import { isString } from 'lodash';

/**
 * @class SQS ポリシー
 */
export default class SQSMessaging extends PolicyStatement {
    constructor(resources?: string|PolicyStatementProps) {
        // 入力補完
        const _props = isString(resources) ? { resources: [resources] } : resources;
        // 拡張
        super({
            ...(_props ?? {}), // 継承
            actions: [ // SQS ポリシー
                'SQS:SendMessage',
                'SQS:DeleteMessage',
                'SQS:ReceiveMessage',
                'SQS:GetQueueUrl',
                'SQS:ListQueues'
            ],
            resources: _props?.resources ?? ['*'], // リソース = 全て
        });
    }
}