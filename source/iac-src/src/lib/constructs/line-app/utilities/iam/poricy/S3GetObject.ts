/* import aws cdk */
import { PolicyStatement, PolicyStatementProps } from 'aws-cdk-lib/aws-iam';
/* import util */
import { isString } from 'lodash';

/**
 * @class s3 GetObject ポリシー
 */
export default class S3GetObject extends PolicyStatement {
    constructor(resources?: string|PolicyStatementProps) {
        // 入力補完
        const _props = isString(resources) ? { resources: [resources] } : resources;
        // 拡張
        super({
            ...(_props ?? {}), // 継承
            actions: ['s3:GetObject'], // S3 GetObject の許可
            resources: _props?.resources ?? ['arn:aws:s3:::s3-*/*'], // リソース = 指定なし s3-から始まる名前
        });
    }
}