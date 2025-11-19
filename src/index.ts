import express from "express";
import { callOllama } from "./ai/providers/ollama";
import { RoomManager } from "./core/roomManager";
import { ChatMessage } from "./core/types";

const app = express();
app.use(express.json());

const roomManager = new RoomManager();

// 動作確認用
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * シンプルなチャットエンドポイント
 * body: { roomId?: string, authorId?: string, text: string }
 */
app.post("/chat", async (req, res) => {
  try {
    const { roomId = "default", authorId = "human-anon", text } = req.body || {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text が必要です" });
    }

    // 人間のメッセージをルームに追加
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      roomId,
      authorId,
      createdAt: Date.now(),
      content: text,
    };
    roomManager.addMessage(userMessage);

    // Ollama へ問い合わせ
    const replyText = await callOllama(text);

    const aiMessage: ChatMessage = {
      id: `msg_${Date.now()}_ai`,
      roomId,
      authorId: "ai-local-ollama",
      createdAt: Date.now(),
      content: replyText,
    };
    roomManager.addMessage(aiMessage);

    return res.json({
      reply: replyText,
      roomId,
      messages: roomManager.getMessages(roomId),
    });
  } catch (err) {
    console.error("POST /chat error:", err);
    return res.status(500).json({ error: "サーバ内部エラー" });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`AI Gateway (minimal) listening on http://localhost:${PORT}`);
});
