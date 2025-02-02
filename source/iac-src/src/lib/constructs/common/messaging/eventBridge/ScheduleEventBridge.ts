/* import aws cdk */
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
/* import type */
import type { CronOptions, RuleProps } from 'aws-cdk-lib/aws-events';
import type { Function } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

/**
 * クーロンオプション
 * @param val 
 * @returns 
 */
const isCronOptions = (val: object = {}): val is CronOptions => ['minute', 'hour', 'day'].some(v => val.hasOwnProperty(v));

/**
 * @class 共通的な スケジューリングされたEventBridge作るやつ
 */
export default class ScheduleEventBridge extends Rule {
    constructor(scope: Construct, id: string, cron?: CronOptions|RuleProps, lambda?: Function) {
        // 入力補完
        const _props: RuleProps|undefined = isCronOptions(cron) ? void 0 : cron;
        // super拡張
        super(scope, id, {
            ...(_props ?? {}), // 継承
            schedule: _props?.schedule ?? (isCronOptions(cron) ? Schedule.cron(cron) : void 0), // スケジュール
            targets: _props?.targets ?? (lambda ? [new LambdaFunction(lambda)] : void 0), // 対応する Lambda
        });
    }
}