# slim系のnodeから構築することを定義
FROM node:22-bullseye-slim

# コンテナ内(Ubuntu)のOSにインストールしておくやつ
RUN apt-get update && apt-get install -y \
  unzip \
  curl \
  && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
  && unzip awscliv2.zip && ./aws/install \
  && rm -rf awscliv2.zip aws \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# AWS-CDKのインストール
# TODO: localstack の必要がなければ cdk-localいらない
RUN npm install -g aws-cdk aws-cdk-local

# コンテナ内の作業ディレクトリを作成
WORKDIR /app