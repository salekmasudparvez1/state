import type { IncomingMessage, ServerResponse } from "http";
import { buildResponse } from "./router";
import { normalizeHeaders } from "./utils";
import { NodeLikeRequest } from "./types";

// Vercel serverless handler — default export of (req, res) is supported by @vercel/node
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const headers = normalizeHeaders(req.headers as NodeLikeRequest["headers"]);
    const host = headers.host || "localhost";
    const protocol = headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const url = new URL(req.url || "/", `${protocol}://${host}`);
    const response = await buildResponse(url);

    res.statusCode = response.status;
    Object.entries(response.headers).forEach(([k, v]) => res.setHeader(k, v));
    res.end(response.body);
  } catch (err) {
    console.error("Handler error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Internal server error");
  }
}

// Local dev server — only runs when executed directly
if (require.main === module) {
  const http = require("http");
  const PORT = process.env.PORT || 3000;
  http.createServer(handler).listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║     🚀 GitHub Stats API                ║`);
    console.log(`╚════════════════════════════════════════╝\n`);
    console.log(`📡 Server : http://localhost:${PORT}`);
    console.log(`📖 Docs   : http://localhost:${PORT}/`);
    console.log(`📊 Example: http://localhost:${PORT}/api/stats?username=octocat\n`);
  });
}
