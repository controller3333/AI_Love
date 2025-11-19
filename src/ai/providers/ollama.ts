// Ollama ローカルLLM呼び出し
// Node.js 18 以降を想定しており、グローバル fetch を使用します。
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3:latest";

export async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[ollama] error:", res.status, text);
    throw new Error(`Ollama error: ${res.status}`);
  }

  const data: any = await res.json();
  const reply: string = data.response || "";
  return reply;
}
