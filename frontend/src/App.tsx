import React, { useState, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";
import "./App.css";

interface Node {
  id: number;
  name: string;
  color: string;
  x?: number; // オプショナルプロパティとして追加
  y?: number; // オプショナルプロパティとして追加
}

interface Link {
  source: number;
  target: number;
}

interface Message {
  text: string;
  type: "input" | "output";
}

// text には string 型を指定し、line および index にはそれぞれ string と number 型を指定
function textWithLineBreaks(text: string) {
  return text.split("\n").map((line: string, index: number) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
}

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  const [view, setView] = useState<"chat" | "graph">("chat");

  // 初期メッセージの取得など、必要に応じてここにコードを追加
  useEffect(() => {
    const resetData = async () => {
      try {
        await fetch("http://localhost:5000/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error resetting data:", error);
      }
    };

    resetData();
  }, []);

  const fetchData = async (message: string) => {
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Network response was not ok");

      const newData = await response.json();

      // グラフデータを更新（既存のデータに新しいデータをマージ）
      setGraphData((prevData) => ({
        nodes: [...prevData.nodes, ...newData.nodes],
        links: [...prevData.links, ...newData.links],
      }));

      // 最終メッセージをチャットボックスに追加
      if (newData.final_message) {
        setMessages((prev) => [
          ...prev,
          { text: newData.final_message, type: "output" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText) {
      alert("メッセージを入力してください。");
      return;
    }

    // Save the message as an input
    setMessages((prev) => [...prev, { text: messageText, type: "input" }]);

    setInput("");

    await fetchData(messageText);
  };

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
                  msg.type === "input" ? "message-input" : "message-output"
                }`}
              >
                {textWithLineBreaks(msg.text)}
              </div>
            ))}
          </div>
        ) : (
          <div className="graph-box">
            <ForceGraph2D
              graphData={graphData}
              nodeCanvasObject={(
                node: Node,
                ctx: CanvasRenderingContext2D,
                globalScale: number
              ) => {
                // テキストを16文字でカットしてから改行で分割
                // const processedText =
                //   node.name.length > 16
                //     ? node.name.substring(0, 16) + "..."
                //     : node.name;
                // const labels = processedText.split("\n");
                const labels = node.name.split("\n");

                const fontSize = 12 / globalScale;
                const offset = fontSize * 1.5; // テキストのY軸オフセット
                const padding = 4; // テキスト周りのパディング
                // ノードの円を描画
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x ?? 0, node.y ?? 0, 5, 0, 2 * Math.PI, false);
                ctx.fill();

                // テキストを描画
                ctx.font = `${fontSize}px Sans-Serif`;
                labels.forEach((line: string, i: number) => {
                  const textWidth = ctx.measureText(line).width; // テキストの幅を計測
                  ctx.fillStyle = "rgba(255, 255, 255, 0.32)"; // 背景色（半透明白）
                  // テキストの背景を描画
                  ctx.fillRect(
                    (node.x ?? 0) + 8,
                    (node.y ?? 0) +
                      offset +
                      i * fontSize -
                      fontSize +
                      padding / 2, // Y位置
                    textWidth + 2 * padding, // 幅
                    fontSize + padding // 高さ
                  );

                  // テキストを描画
                  ctx.fillStyle = node.color; // テキストの色
                  // ctx.font = `${fontSize}px Sans-Serif`; // フォント設定
                  ctx.font = `${fontSize}px 'メイリオ', 'Meiryo', 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'Osaka', 'sans-serif'`;
                  labels.forEach((line, i) => {
                    ctx.fillText(
                      line,
                      (node.x ?? 0) + 8,
                      (node.y ?? 0) + offset + i * fontSize
                    );
                  });
                });
              }}
              nodeLabel={(node: Node) => node.name.split("\n").join("<br/>")} // ツールチップで改行を反映
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
