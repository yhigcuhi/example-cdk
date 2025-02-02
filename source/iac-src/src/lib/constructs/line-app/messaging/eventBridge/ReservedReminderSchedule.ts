/* import 共通 */
import { ScheduleEventBridge } from '@/lib/constructs/common';
/* import util */
import { isString, isUndefined } from 'lodash';
/* import type */
import type { CronOptions } from 'aws-cdk-lib/aws-events';
import type { Function } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';

/**
 * @class スケジューリングされた 予約リマインド クーロン
 */
export default class ReservedReminderSchedule extends ScheduleEventBridge {
    constructor(scope: Construct, lambda: Function, id?: string|CronOptions) {
        // クーロンスケジュール
        const cron: CronOptions = isString(id) || isUndefined(id) ? {minute: '00', hour: '0'} : id;
        // super拡張
        super(scope, isString(id) ? id : 'ReservedReminderSchedule', cron, lambda);
    }
}