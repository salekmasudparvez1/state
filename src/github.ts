import { GitHubStats } from "./types";

const GH_HEADERS = {
  "User-Agent": "GitHub-Stats-API",
  Accept: "application/vnd.github+json",
};

async function fetchTotalCommits(username: string): Promise<number> {
  let totalCommits = 0;
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 5) {
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/events?per_page=100&page=${page}`,
        { headers: GH_HEADERS }
      );
      if (!res.ok) break;

      const events = await res.json();
      if (!Array.isArray(events) || events.length === 0) break;

      for (const event of events) {
        if (event.type === "PushEvent" && event.payload?.commits) {
          totalCommits += event.payload.commits.length;
        }
      }

      if (events.length < 100) hasMore = false;
      page++;
      await new Promise((r) => setTimeout(r, 100));
    } catch {
      break;
    }
  }

  return totalCommits;
}

export async function fetchGitHubStats(
  username: string,
  signal: AbortSignal
): Promise<GitHubStats> {
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers: GH_HEADERS, signal }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: GH_HEADERS,
      signal,
    }),
  ]);

  if (!userRes.ok) {
    const msg = userRes.status === 404 ? `User "${username}" not found` : "GitHub API error";
    throw Object.assign(new Error(msg), { status: userRes.status === 404 ? 404 : 502 });
  }

  const userData = await userRes.json();
  const repos = reposRes.ok ? await reposRes.json() : [];

  let totalStars = 0;
  let totalForks = 0;
  const languages: Record<string, number> = {};

  for (const repo of repos) {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  }

  const totalLangCount = Object.values(languages).reduce((sum, n) => sum + n, 0);
  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalLangCount > 0 ? (count / totalLangCount) * 100 : 0,
    }));

  const totalCommits = await fetchTotalCommits(username);

  return {
    username: userData.login,
    name: userData.name || "",
    avatarUrl: userData.avatar_url,
    bio: userData.bio || "",
    company: userData.company || "",
    location: userData.location || "",
    totalRepos: userData.public_repos || 0,
    totalStars,
    totalForks,
    totalCommits,
    totalFollowers: userData.followers || 0,
    totalFollowing: userData.following || 0,
    createdAt: userData.created_at,
    topLanguages,
  };
}
