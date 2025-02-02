/* import aws cdk */
import { Stack, StackProps } from 'aws-cdk-lib';
/* import 独自 cdk */
import { LINERestAPIAppFunction, LINEAppRestApi } from './constructs/line-app';
/* import type */
import type { Construct } from 'constructs';

/**
 * @class WEBアプリ リリース スタック(API Gateway + Lambda + Dynamoなどの構成ごと)
 */
export default class AppStack extends Stack {
  /**
   * @param scope リリース スタックのタスクをまとめているヤツ(cloud formationの単位)
   * @param id スタック識別子
   * @param props スタック 実行オプション
   */
  constructor(scope: Construct, id: string, props?: StackProps) {
    // 継承
    super(scope, id, props);

    // TODO: 資材を管理する bucket作るならここでやる ServerlessDeploymentBucket のやつ
    // Lambda 登録
    const app = new LINERestAPIAppFunction(this, {
      handler: 'test.handler', // 関数ハンドラー
    });
    // API Gateway 構築
    const api = new LINEAppRestApi(this);
    // リソース設定
    api.appendFunction('/test', 'GET', app);
  }
}