# backend/Dockerfile
FROM python:3.8

# アプリケーションディレクトリを設定
WORKDIR /app

# 依存関係をインストール
COPY requirements.txt ./
RUN pip install -r requirements.txt

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションを実行
CMD ["flask", "run", "--host=0.0.0.0"]
