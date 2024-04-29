# EchoChatGraphBase

EchoChatGraphBaseは、TypeScriptとFlaskを使用して構築されたチャットボットとデータ可視化のプロジェクトです。このシステムは、同じ内容を繰り返し生成するチャットボット機能と、React-Force-Graphを用いた会話の力学グラフによる可視化機能を組み合わせています。

---

EchoChatGraphBase is a project that combines a chatbot and data visualization, developed using TypeScript and Flask. This system integrates a chatbot that repetitively generates the same content with a visualization feature using React-Force-Graph to map out interactions in a force-directed graph.

---

## 主な機能

- 履歴ベースの応答生成: app.py では、ユーザーからの入力と過去の会話履歴を基に応答を生成します。Flaskサーバーは、最新のメッセージに加えて、過去の最大4つのメッセージとその回答を記憶し、それを基に応答を形成します。
- グラフによるインタラクションの可視化: 入力されたメッセージとそれに対する応答は、React-Force-Graphを使用して力学グラフとして可視化されます。各ノードは特定のメッセージを表し、エッジはメッセージ間の関連性を示します。

---

## Key Features

- History-Based Response Generation: In app.py, responses are generated based on the user's input and previous conversation history. The Flask server retains not only the latest message but also up to four previous messages and their responses, forming the basis for future responses.
- Visualization of Interactions Through Graphs: Messages inputted and their corresponding responses are visualized as nodes and edges in a force-directed graph using React-Force-Graph. Each node represents a specific message, while edges illustrate the connections between messages.

---


## アクセスポイント

- フロントエンド: ユーザーインターフェースは http://localhost:3000 でアクセス可能です。ここからユーザーはメッセージを送信し、グラフの可視化を見ることができます。
- バックエンド: サーバーは http://localhost:5000 で稼働しており、フロントエンドからのリクエストを処理します。具体的には、http://localhost:5000/chat にPOSTリクエストを送ることで、ユーザーからのメッセージが処理され、応答が返されます。

---

## Access Points

- Frontend: The user interface is accessible at http://localhost:3000, where users can send messages and view the graphical visualization of the interactions.
- Backend: The server operates at http://localhost:5000, handling requests from the frontend. Specifically, POST requests sent to http://localhost:5000/chat process user messages and return responses.

## 動作イメージ
## Functional Image

![](./EchoChatGraph.gif)


- ファイル構成は以下です
- File Structure

```
EchoChatGraphBase/
│  docker-compose.yml
│  Dockerfile
│  docker_build.bat
│  docker_start.bat
│  docker_stop.bat
│  LICENSE
│  package.json
│  README.md
│
├─backend
│      app.py
│      requirements.txt
│
└─frontend
    │  config-overrides.js
    │  Dockerfile
    │  package.json
    │  tsconfig.json
    │
    ├─public
    │      index.html
    │
    └─src
            App.css
            App.tsx
            index.css
            index.tsx
```
