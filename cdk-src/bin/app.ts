#!/usr/bin/env node
// cdk　実行時のエントリーポイント
import * as cdk from 'aws-cdk-lib';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();
new AppStack(app, 'AppStack');
