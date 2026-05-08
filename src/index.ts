import http from "http";
import type { IncomingMessage, ServerResponse } from "http";
import { buildResponse } from "./router";
import { normalizeHeaders } from "./utils";
import { NodeLikeRequest, NodeLikeResponse } from "./types";

async function nodeHandler(req: IncomingMessage, res: ServerResponse) {
  try {
    const headers = normalizeHeaders(req.headers as NodeLikeRequest["headers"]);
    const host = headers.host || "localhost";
    const protocol = headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const url = new URL(req.url || "/", `${protocol}://${host}`);
    const response = await buildResponse(url);

    res.statusCode = response.status;
    Object.entries(response.headers).forEach(([k, v]) => res.setHeader(k, v));
    res.end(response.body);
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Internal server error");
  }
}

export async function handleFetch(request: Request): Promise<Response> {
  try {
    const response = await buildResponse(new URL(request.url));
    return new Response(response.body, {
      status: response.status,
      headers: new Headers(response.headers),
    });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}

// Server bootstrap
const PORT = process.env.PORT || 3000;
const server = http.createServer(nodeHandler);

server.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║     🚀 GitHub Stats API                ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
  console.log(`📡 Server : http://localhost:${PORT}`);
  console.log(`📖 Docs   : http://localhost:${PORT}/`);
  console.log(`📊 Example: http://localhost:${PORT}/api/stats?username=octocat\n`);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down...");
  server.close(() => process.exit(0));
});

export default handleFetch;
