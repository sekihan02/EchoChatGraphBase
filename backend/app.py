from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# チャットの履歴を保存するリスト
chat_history = []

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data['message']

    # メッセージを履歴に追加
    if len(chat_history) >= 4:
        # 既に4つの履歴があれば、一番古いものを削除
        chat_history.pop(0)
    chat_history.append(message)

    # 履歴も含めてレスポンスを返す
    # return jsonify(message=message, history=chat_history)
    return jsonify(message=str(chat_history), history=chat_history)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
