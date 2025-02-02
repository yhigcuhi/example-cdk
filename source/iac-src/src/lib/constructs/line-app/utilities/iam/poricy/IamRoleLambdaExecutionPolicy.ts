/* import aws cdk */
import { Fn } from 'aws-cdk-lib';
import { Policy } from 'aws-cdk-lib/aws-iam';
/* import policy statement */
import InvokeOtherLambda from './InvokeOtherLambda';
import SNSPublish from './SNSPublish';
import SQSMessaging from './SQSMessaging';
/* import 定数 */
import { APP_NAME, APP_ENV} from '@/config/app';
/* import type */
import type { PolicyProps } from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';

/**
 * @class Lambda 実行 role のポリシーセット
 */
export default class IamRoleLambdaExecutionPolicy extends Policy {
    constructor(scope: Construct, id: string, props?: PolicyProps) {
        super(scope, id, {
            ...(props ?? {}), // 継承
            policyName: props?.policyName || Fn.join('-', [APP_NAME, APP_ENV, 'lambda']), // 独自 ポリシー名 = アプリ名-ステージング-lambda
            statements: [ // 独自の ポリシーセット
                ...(props?.statements ?? []), // 継承
                // 別のlambda 起動
                new InvokeOtherLambda(),
                // SNS発火
                new SNSPublish(),
                // SQS操作
                new SQSMessaging(),
            ],
        });
    }
}