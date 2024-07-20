# slim系のnodeから構築することを定義
FROM node:20-bullseye-slim

# パッケージ一覧(インデックス)を更新
RUN apt update \
    && yarn install \
    # aws cdk インストール
    && yarn global add aws-cdk

# コンテナ内の作業ディレクトリを作成
WORKDIR /app