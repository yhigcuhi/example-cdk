#!/usr/bin/env node
// cdk による CloudFront + S3の対応お試し package.json, cdk.json の bin/app.ts → bin/cdk-saticfile-deploy.tsに変更して実行できる
// 参考: https://github.com/kodai305/cdk-staticfile-deploy/tree/main
/* import sourcemap */
import 'source-map-support/register'; // ESエラーの sourcemap(どのファイルのどの行でエラーになったか調べやすくするよう)
/* import cdk */
import * as cdk from 'aws-cdk-lib';
/* import ビルドタスク */
import { CdkStaticfileDeployStack } from '../lib/cdk-front-end-deploy';

// 全体的な構成の初期化
const app = new cdk.App();

/* CloudFront + S3 の環境デプロイ */
new CdkStaticfileDeployStack(app, 'CdkStaticfileDeployStack', {
  // TODO: envファイルからのできるようにする必要ある
  env: { account: '992382838500', region: 'ap-northeast-1'},
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});