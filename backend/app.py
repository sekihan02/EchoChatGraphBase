from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# チャットの履歴を保存するリスト
chat_history = []
id_ = 0

@app.route('/reset', methods=['POST'])
def reset():
    global id_
    id_ = 0
    return jsonify(success=True)


@app.route('/chat', methods=['POST'])
def chat():
    global id_  # id_変数をグローバル変数として宣言
    data = request.json
    message = data['message']  # 入力メッセージを受け取る

    # ノードとエッジのリストを初期化
    nodes = []
    edges = []

    # 初期ノード (message) を追加
    current_message_id = id_ + 1
    nodes.append({'id': current_message_id, 'name': message, 'color': '#919191'})
    if current_message_id != 1:
        edges.append({'source': current_message_id, 'target': id_})

    # 中間ノードを追加
    for i in range(1, 4):
        intermediate_id = current_message_id + i
        nodes.append({'id': intermediate_id, 'name': f"Intermediate\noutput {i}", 'color': '#0089b3'})
        edges.append({'source': current_message_id, 'target': intermediate_id})

    # 最終ノード (final_message) を追加
    final_id = current_message_id + 4
    id_ = final_id
    final_message = message  # 最終メッセージは入力メッセージのコピー
    nodes.append({'id': final_id, 'name': final_message, 'color': '#0056b3'})
    for i in range(1, 4):
        intermediate_id = current_message_id + i
        edges.append({'source': intermediate_id, 'target': final_id})

    # 前回の最終メッセージを保存
    chat_history.append(final_message)
    return jsonify(nodes=nodes, links=edges, final_message=final_message)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
