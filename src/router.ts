import { themes } from "./config";
import { fetchGitHubStats } from "./github";
import { generateErrorSVG, generateMiniSVG, generateSVG } from "./svg";
import { CardVariant, ResponsePayload } from "./types";
import { getStudioHTML } from "./ui";
import { parseBoolean } from "./utils";

function getAPIDocs(): string {
  return `GITHUB STATS API — AI ENGINEER EDITION

ENDPOINT: GET /api/stats

PARAMETERS:
  username  (required)  GitHub username
  theme     (optional)  neural | dark | ocean | midnight | light  (default: dark)
  variant   (optional)  modern | glass | minimal                  (default: modern)
  role      (optional)  Custom role subtitle (e.g. AI & ML Engineer)
  animate   (optional)  true | false                              (default: true)
  format    (optional)  svg | json | mini                         (default: svg)

EXAMPLE:
  /api/stats?username=salekmasudparvez1&theme=neural&variant=modern

OTHER ENDPOINTS:
  GET /        Interactive Card Studio UI
  GET /docs    Plain-text API documentation
  GET /health  Service health check JSON
`;
}

export async function buildResponse(url: URL): Promise<ResponsePayload> {
  const { pathname } = url;

  if (pathname === "/") {
    return {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: getStudioHTML(),
    };
  }

  if (pathname === "/docs") {
    return {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: getAPIDocs(),
    };
  }

  if (pathname === "/health") {
    return {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }),
    };
  }

  if (pathname !== "/api/stats") {
    return {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "Not Found. Visit / for the Studio or /docs for API docs.",
    };
  }

  const username = url.searchParams.get("username")?.trim() || "";
  const themeParam = url.searchParams.get("theme")?.trim().toLowerCase() || "dark";
  const theme = themes[themeParam] ? themeParam : "dark";
  const variantParam = url.searchParams.get("variant")?.trim().toLowerCase();
  const variant: CardVariant =
    variantParam === "glass" || variantParam === "minimal" ? variantParam : "modern";
  const animate = parseBoolean(url.searchParams.get("animate"), true);
  const roleParam = url.searchParams.get("role")?.trim() || undefined;
  const formatParam = url.searchParams.get("format")?.trim().toLowerCase() || "svg";

  if (!username) {
    if (formatParam === "json") {
      return {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "Missing username parameter" }),
      };
    }
    return {
      status: 400,
      headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
      body: generateErrorSVG("Missing username parameter", "Provide ?username=<github_handle> in the query string.", theme),
    };
  }

  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
    if (formatParam === "json") {
      return {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "Invalid GitHub username format" }),
      };
    }
    return {
      status: 400,
      headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
      body: generateErrorSVG("Invalid GitHub username", `The handle "${username}" does not match GitHub username rules.`, theme),
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const stats = await fetchGitHubStats(username, controller.signal);
    clearTimeout(timeoutId);

    if (formatParam === "json") {
      return {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=900, stale-while-revalidate=900",
          "X-Username": stats.username,
        },
        body: JSON.stringify(stats, null, 2),
      };
    }

    const svgBody =
      formatParam === "mini"
        ? generateMiniSVG(stats, theme, animate)
        : generateSVG(stats, theme, animate, variant, roleParam);

    return {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=900, stale-while-revalidate=900",
        "X-Theme": theme,
        "X-Variant": variant,
        "X-Username": stats.username,
      },
      body: svgBody,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const status = typeof err?.status === "number" ? err.status : 502;
    const message = err?.message || "Failed to fetch GitHub metrics.";

    if (formatParam === "json") {
      return {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: message }),
      };
    }

    const title =
      status === 404
        ? "GitHub User Not Found"
        : status === 429
          ? "GitHub Rate Limit Reached"
          : "GitHub API Unavailable";

    return {
      status,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-cache",
      },
      body: generateErrorSVG(title, message, theme),
    };
  }
}
