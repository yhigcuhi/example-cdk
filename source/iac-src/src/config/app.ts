/* アプリケーション 定数 */
/** @var {string} ステージング */
export const APP_ENV = process.env.APP_ENV ?? 'dev';
export const STAGE = APP_ENV;
/** @var {string} アプリケーション名 */
export const APP_NAME = process.env.APP_NAME ?? 'example-app';
/** @var {string} アプリケーション ソースルートディレクトリ パス */
export const APP_ASSET_PATH = process.env.APP_ASSET_PATH ?? '../api';