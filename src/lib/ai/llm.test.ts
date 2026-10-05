import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

test("streams SSE deltas split across network chunks and extracts JSON from prose", async () => {
  const events = ["Photo", "synthesis ", "makes sugar."].map((c) => `data: ${JSON.stringify({ choices: [{ delta: { content: c } }] })}\n\n`);
  const wire = `: keep-alive\n\n${events.join("")}data: [DONE]\n\n`;
  const server = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/event-stream" });
    // Split mid-line to prove the parser buffers partial lines.
    for (let i = 0; i < wire.length; i += 7) res.write(wire.slice(i, i + 7));
    res.end();
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  process.env.LLM_BASE_URL = `http://localhost:${(server.address() as AddressInfo).port}`;
  process.env.LLM_API_KEY = "test";

  try {
    const { streamCompletion, extractJson } = await import("./llm.ts");
    let text = "";
    for await (const delta of streamCompletion([{ role: "user", content: "hi" }])) text += delta;
    assert.equal(text, "Photosynthesis makes sugar.");

    assert.deepEqual(extractJson('Sure! ```json\n{"summary": "ok", "flashcards": []}\n``` Done.'), { summary: "ok", flashcards: [] });
    assert.equal(extractJson("no json here"), null);
  } finally {
    server.close();
  }
});
