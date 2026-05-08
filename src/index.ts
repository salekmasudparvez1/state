import express, { Request, Response } from "express";
import { buildResponse } from "./router";
import { normalizeHeaders } from "./utils";
import { NodeLikeRequest } from "./types";

const app = express();

app.get("*", async (req: Request, res: Response) => {
  try {
    const headers = normalizeHeaders(req.headers as NodeLikeRequest["headers"]);
    const host = headers.host || "localhost";
    const protocol = headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const url = new URL(req.url, `${protocol}://${host}`);
    const response = await buildResponse(url);

    res.status(response.status);
    Object.entries(response.headers).forEach(([k, v]) => res.setHeader(k, v));
    res.send(response.body);
  } catch {
    res.status(500).type("text").send("Internal server error");
  }
});

// Local dev
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║     🚀 GitHub Stats API                ║`);
    console.log(`╚════════════════════════════════════════╝\n`);
    console.log(`📡 Server : http://localhost:${PORT}`);
    console.log(`📖 Docs   : http://localhost:${PORT}/`);
    console.log(`📊 Example: http://localhost:${PORT}/api/stats?username=octocat\n`);
  });
}

export default app;
