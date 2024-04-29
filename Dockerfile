# ビルドステージでReactアプリをセットアップおよびビルド
FROM node:14 as react-build
WORKDIR /app
# npx create-react-app でReactプロジェクトを生成
RUN npx create-react-app react-frontend
WORKDIR /app/react-frontend

# プロジェクトの依存関係をインストールし、プロジェクトをビルド
RUN npm install
RUN npm run build

# Flaskアプリケーション用のステージ
FROM python:3.9
WORKDIR /app

# Pythonの依存関係をインストール
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Flask アプリケーションのコードをコピー
COPY app/ ./

# Reactビルドの成果物をFlaskの静的ファイルディレクトリにコピー
COPY --from=react-build /app/react-frontend/build ./static
COPY --from=react-build /app/react-frontend/build/index.html ./templates/

# Flaskアプリケーションの実行
CMD ["flask", "run", "--host=0.0.0.0"]

# # Flaskアプリケーション用のステージ
# FROM python:3.9
# WORKDIR /app

# # Pythonの依存関係をインストール
# COPY backend/requirements.txt ./
# RUN pip install --upgrade pip
# RUN pip install --no-cache-dir -r requirements.txt

# # Flask アプリケーションのコードをコピー
# COPY backend/app.py ./

# # Reactビルドの成果物をFlaskの静的ファイルディレクトリにコピー
# COPY --from=react-build /app/react-frontend/build ./static
# COPY --from=react-build /app/react-frontend/build/index.html ./templates/

# # Flaskアプリケーションの実行
# CMD ["flask", "run", "--host=0.0.0.0"]
