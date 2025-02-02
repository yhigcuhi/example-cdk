#!/usr/bin/env node
/* cloudformaion 単位 ごと */
/* import aws-cdk */
import * as cdk from 'aws-cdk-lib';
/* import リリース タスク */
import AppStack from '@/lib/app-stack';
import AppCronStack from '@/lib/app-cron-stack';
/* import 定数 */
import { APP_NAME, STAGE } from '@/config/app';
import { ACCOUNT, DEFAULT_REGION } from '@/config/aws';

// リリースタスク 
const app = new cdk.App();
// スタック名 接頭辞
const prefix = `${STAGE}-${APP_NAME}`;

// タスク: WEB アプリ デプロイ スタック登録
new AppStack(app, 'AppStack', {
  description: 'deploy-for-api-stack', // stackの説明
  env: { account: ACCOUNT, region: DEFAULT_REGION }, // AWS 環境の設定情報
  stackName: `${prefix}-api-stack`, // スタック名 TODO: cloudformation上のスタック管理名？
  tags: { // stackのtag
    'app': APP_NAME, // アプリ名
    'stage': STAGE, // ステージング
    'overview': 'deploy-for-api-stack', // 用途
  },
});

// タスク: アプリ バッチ デプロイ スタック登録
new AppCronStack(app, 'AppCronStack', {
  description: 'deploy-for-app-cron-stack', // stackの説明
  env: { account: ACCOUNT, region: DEFAULT_REGION }, // AWS 環境の設定情報
  stackName: `${prefix}-app-cron-stack`, // スタック名 TODO: cloudformation上のスタック管理名？
  tags: { // stackのtag
    'app': APP_NAME, // アプリ名
    'stage': STAGE, // ステージング
    'overview': 'deploy-for-app-cron-stack', // 用途
  },
});