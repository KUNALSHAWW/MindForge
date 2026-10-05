// Minimal client for any OpenAI-compatible chat completions API.
// Defaults to Hugging Face Inference Providers; point LLM_BASE_URL at Groq,
// OpenRouter, Together, Ollama (http://localhost:11434/v1) etc. to switch.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const BASE_URL = (process.env.LLM_BASE_URL ?? "https://router.huggingface.co/v1").replace(/\/$/, "");
const API_KEY = process.env.LLM_API_KEY ?? process.env.HUGGINGFACE_API_KEY ?? "";
const MODEL = process.env.LLM_MODEL ?? "meta-llama/Llama-3.1-8B-Instruct";

/** False when no key is configured: the tutor then answers with the offline fallback. */
export function isLLMConfigured(): boolean {
  return API_KEY.length > 0 || BASE_URL.includes("localhost");
}

interface CompletionOptions {
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

async function request(messages: ChatMessage[], stream: boolean, options: CompletionOptions) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }) },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream,
      max_tokens: options.maxTokens ?? 700,
      temperature: options.temperature ?? 0.6,
    }),
    signal: options.signal ?? AbortSignal.timeout(60_000),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    throw new Error(`LLM request failed (${res.status}): ${detail}`);
  }
  return res;
}

export async function complete(messages: ChatMessage[], options: CompletionOptions = {}): Promise<string> {
  const res = await request(messages, false, options);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}

/** Streams text deltas from a server-sent-events completion. */
export async function* streamCompletion(messages: ChatMessage[], options: CompletionOptions = {}): AsyncGenerator<string> {
  const res = await request(messages, true, options);
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const data = line.trim();
      if (!data.startsWith("data:")) continue;
      const payload = data.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
        if (delta) yield delta as string;
      } catch {
        // ignore keep-alive and partial lines
      }
    }
  }
}

/** Parses the first JSON object in a model reply (models often wrap JSON in prose or fences). */
export function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}
