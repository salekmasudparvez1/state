import { themes } from "./config";
import { fetchGitHubStats } from "./github";
import { generateSVG } from "./svg";
import { ResponsePayload } from "./types";
import { parseBoolean } from "./utils";

function getAPIDocs(): string {
  return `╔══════════════════════════════════════════════════════════════╗
║                  🚀 GITHUB STATS API                         ║
╚══════════════════════════════════════════════════════════════╝

📌 ENDPOINT: GET /api/stats

📝 PARAMETERS:
  username  (required)  GitHub username
  theme     (optional)  dark | ocean | midnight  (default: dark)
  animate   (optional)  true | false             (default: true)

📊 EXAMPLE:
  /api/stats?username=octocat&theme=ocean&animate=true

🎨 THEMES:
  dark     - Classic GitHub dark
  ocean    - Deep blue
  midnight - Neon on black

💡 EMBED IN README:
  ![GitHub Stats](https://your-api.com/api/stats?username=YOUR_USERNAME)
`;
}

export async function buildResponse(url: URL): Promise<ResponsePayload> {
  const { pathname } = url;

  if (pathname === "/" || pathname === "/docs") {
    return { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" }, body: getAPIDocs() };
  }

  if (pathname === "/health") {
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }),
    };
  }

  if (pathname !== "/api/stats") {
    return { status: 404, headers: { "Content-Type": "text/plain" }, body: "Not Found. Visit / for docs." };
  }

  const username = url.searchParams.get("username");
  const themeParam = url.searchParams.get("theme") as keyof typeof themes | null;
  const theme = themeParam && themes[themeParam] ? themeParam : "dark";
  const animate = parseBoolean(url.searchParams.get("animate"), true);

  if (!username?.trim()) {
    return { status: 400, headers: { "Content-Type": "text/plain" }, body: "❌ Missing username parameter" };
  }

  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
    return { status: 400, headers: { "Content-Type": "text/plain" }, body: "❌ Invalid GitHub username format" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const stats = await fetchGitHubStats(username, controller.signal);
    clearTimeout(timeoutId);

    return {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=900",
        "X-Theme": theme,
        "X-Username": username,
      },
      body: generateSVG(stats, theme, animate),
    };
  } catch (err: any) {
    if (err.status === 404 || err.status === 502) {
      return { status: err.status, headers: { "Content-Type": "text/plain" }, body: err.message };
    }
    console.error("API Error:", err);
    return { status: 500, headers: { "Content-Type": "text/plain" }, body: "Internal server error." };
  }
}
