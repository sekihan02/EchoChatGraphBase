import React, { useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import "./App.css";

interface Message {
  text: string;
  isBot: boolean;
  id: number;
  responseTo: number[];  // 数値の配列として定義
}


const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [view, setView] = useState<"chat" | "graph">("chat");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };
  
  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText) return;

    const newMessageId = Date.now(); // メッセージの一意なID
    const previousIds = messages.map((msg) => msg.id); // 既存の全メッセージID

    const newMessage = {
      text: messageText,
      isBot: false,
      id: newMessageId,
      responseTo: previousIds, // 新しいメッセージが関連する全てのメッセージのID
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageText }),
    });

    if (response.ok) {
      const { message: reply } = await response.json();
      const replyMessage = {
        text: reply,
        isBot: true,
        id: Date.now(),
        responseTo: [newMessageId], // 応答は直接関連する質問にのみリンク
      };
      setMessages((prev) => [...prev, replyMessage]);
    } else {
      const errorMessage = {
        text: "Failed to get response from the server.",
        isBot: true,
        id: Date.now(),
        responseTo: [newMessageId],
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const graphData = {
    nodes: messages.map((msg) => ({
      id: msg.id,
      name: msg.text,
      color: msg.isBot ? "#0056b3" : "#919191",
    })),
    links: messages.flatMap((msg) =>
      msg.responseTo.map((sourceId) => ({
        source: sourceId,
        target: msg.id,
      }))
    ),
  };

  console.log(graphData);

  return (
    <div className="container">
      <div className="button-container">
        <button onClick={() => setView("chat")}>Chat</button>
        <button onClick={() => setView("graph")}>Graph</button>
      </div>
      <div className="content-box">
        {view === "chat" ? (
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.isBot ? "bot-message" : "user-message"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        ) : (
          <div className="graph-box">
            <ForceGraph2D
              graphData={graphData}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 12 / globalScale;
                ctx.fillStyle = node.color;
                ctx.font = `${fontSize}px Sans-Serif`;
                if (typeof node.x === "number" && typeof node.y === "number") {
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                  ctx.fill();
                  ctx.fillText(label, node.x + 8, node.y + 3);
                }
              }}
              nodeAutoColorBy="color"
            />
          </div>
        )}
      </div>
      <div className="form-container">
        <form className="form-area" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            rows={3}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default App;
