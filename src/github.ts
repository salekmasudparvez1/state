import { AI_KEYWORD_LABELS } from "./config";
import { GitHubStats } from "./types";

interface CacheEntry {
  data: GitHubStats;
  expiresAt: number;
  staleUntil: number;
}

const CACHE_TTL_MS = 15 * 60 * 1000;
const STALE_TTL_MS = 60 * 60 * 1000;
const statsCache = new Map<string, CacheEntry>();

function buildGitHubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": "GitHub-Stats-API/2.0",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchEventsCommitCount(username: string, signal: AbortSignal): Promise<number> {
  let totalCommits = 0;
  const headers = buildGitHubHeaders();

  for (let page = 1; page <= 3; page++) {
    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=100&page=${page}`,
        { headers, signal }
      );
      if (!res.ok) break;

      const events = await res.json();
      if (!Array.isArray(events) || events.length === 0) break;

      for (const event of events) {
        if (event?.type === "PushEvent") {
          const count =
            typeof event.payload?.size === "number"
              ? event.payload.size
              : Array.isArray(event.payload?.commits)
                ? event.payload.commits.length
                : 0;
          totalCommits += count;
        }
      }

      if (events.length < 100) break;
    } catch {
      break;
    }
  }

  return totalCommits;
}

async function fetchTotalCommits(username: string, signal: AbortSignal): Promise<number> {
  const headers = buildGitHubHeaders();

  try {
    const searchRes = await fetch(
      `https://api.github.com/search/commits?q=${encodeURIComponent(`author:${username}`)}&per_page=1`,
      { headers, signal }
    );

    if (searchRes.ok) {
      const payload = (await searchRes.json()) as { total_count?: number };
      if (typeof payload.total_count === "number" && payload.total_count >= 0) {
        return payload.total_count;
      }
    }
  } catch {
    // Fall back to events API when search endpoint fails or times out
  }

  return fetchEventsCommitCount(username, signal);
}

function detectAIStack(repos: any[], topLanguageNames: string[]): string[] {
  const matched = new Map<string, number>();

  for (const repo of repos) {
    const topics = Array.isArray(repo?.topics) ? repo.topics.join(" ") : "";
    const corpus = `${repo?.name || ""} ${repo?.description || ""} ${topics} ${repo?.language || ""}`;

    for (const rule of AI_KEYWORD_LABELS) {
      if (rule.pattern.test(corpus)) {
        matched.set(rule.label, (matched.get(rule.label) || 0) + 1);
      }
    }
  }

  if (topLanguageNames.includes("Python") && !matched.has("Python")) {
    matched.set("Python", 1);
  }
  if (topLanguageNames.includes("Jupyter Notebook") && !matched.has("Jupyter")) {
    matched.set("Jupyter", 1);
  }
  if (topLanguageNames.includes("TypeScript") && !matched.has("TypeScript")) {
    matched.set("TypeScript", 1);
  }

  return Array.from(matched.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label]) => label);
}

function inferRole(bio: string, aiStack: string[], topLanguages: Array<{ name: string }>): string {
  const lowerBio = bio.toLowerCase();
  if (/\b(ai|ml|machine learning|deep learning|llm|nlp|computer vision)\b/i.test(lowerBio)) {
    return "AI & ML Engineer";
  }
  if (/\bfull[\s-]?stack\b/i.test(lowerBio)) {
    return "Full Stack Engineer";
  }
  if (/\b(backend|systems|platform|devops|cloud)\b/i.test(lowerBio)) {
    return "Systems & Backend Engineer";
  }
  const hasAI = aiStack.some((s) =>
    ["PyTorch", "TensorFlow", "JAX", "Transformers", "LangChain", "OpenAI", "Gemini", "RAG", "AI Agents", "CUDA/ONNX"].includes(s)
  );
  if (hasAI || topLanguages.some((l) => l.name === "Jupyter Notebook" || l.name === "CUDA")) {
    return "AI Systems Engineer";
  }
  return "Software Engineer";
}

export async function fetchGitHubStats(
  username: string,
  signal: AbortSignal
): Promise<GitHubStats> {
  const cacheKey = username.trim().toLowerCase();
  const now = Date.now();
  const cached = statsCache.get(cacheKey);
  if (cached && now < cached.expiresAt) {
    return cached.data;
  }

  const headers = buildGitHubHeaders();

  try {
    const [userRes, reposPage1Res, totalCommits] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers, signal }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
        { headers, signal }
      ),
      fetchTotalCommits(username, signal),
    ]);

    if (!userRes.ok) {
      if (userRes.status === 404) {
        throw Object.assign(new Error(`GitHub user "${username}" was not found.`), { status: 404 });
      }
      if (userRes.status === 403 || userRes.status === 429) {
        if (cached && now < cached.staleUntil) {
          return cached.data;
        }
        throw Object.assign(
          new Error("GitHub API rate limit reached. Add GITHUB_TOKEN or retry shortly."),
          { status: 429 }
        );
      }
      throw Object.assign(new Error(`GitHub API responded with ${userRes.status}.`), { status: 502 });
    }

    const userData = await userRes.json();
    let repos: any[] = reposPage1Res.ok ? await reposPage1Res.json() : [];
    if (!Array.isArray(repos)) repos = [];

    if ((userData.public_repos || 0) > 100 && reposPage1Res.ok) {
      try {
        const page2Res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=2&sort=updated&type=owner`,
          { headers, signal }
        );
        if (page2Res.ok) {
          const page2 = await page2Res.json();
          if (Array.isArray(page2)) {
            repos = repos.concat(page2);
          }
        }
      } catch {
        // Keep page 1 repos if page 2 fails
      }
    }

    let totalStars = 0;
    let totalForks = 0;
    const languages: Record<string, number> = {};

    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language && !repo.fork) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    }

    // Fallback: include forked repos' languages only if user has zero non-fork languages
    if (Object.keys(languages).length === 0) {
      for (const repo of repos) {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      }
    }

    const totalLangCount = Object.values(languages).reduce((sum, n) => sum + n, 0);
    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLangCount > 0 ? (count / totalLangCount) * 100 : 0,
      }));

    const aiStack = detectAIStack(
      repos,
      topLanguages.map((l) => l.name)
    );
    const bio = typeof userData.bio === "string" ? userData.bio : "";

    const stats: GitHubStats = {
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url || "",
      bio,
      company: userData.company || "",
      location: userData.location || "",
      totalRepos: userData.public_repos || 0,
      totalStars,
      totalForks,
      totalCommits,
      totalFollowers: userData.followers || 0,
      totalFollowing: userData.following || 0,
      createdAt: userData.created_at || new Date().toISOString(),
      topLanguages,
      aiStack,
      inferredRole: inferRole(bio, aiStack, topLanguages),
    };

    statsCache.set(cacheKey, {
      data: stats,
      expiresAt: now + CACHE_TTL_MS,
      staleUntil: now + STALE_TTL_MS,
    });

    return stats;
  } catch (err: any) {
    if (cached && now < cached.staleUntil && err?.status !== 404) {
      return cached.data;
    }
    throw err;
  }
}
