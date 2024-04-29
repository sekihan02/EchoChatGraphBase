# frontend/Dockerfile
FROM node:14

# アプリケーションディレクトリを作成
WORKDIR /app

# アプリケーションの依存ファイルをインストール
COPY package.json ./
COPY package-lock.json* ./
# RUN npm install
RUN npm install --verbose


# アプリケーションのソースをバンドル
COPY . .

# アプリを起動
CMD ["npm", "start"]
