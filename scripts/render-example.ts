import { writeFileSync } from "fs";
import { generateSVG } from "../src/svg";
import { GitHubStats } from "../src/types";

const stats: GitHubStats = {
  username: "octocat",
  name: "The Octocat",
  avatarUrl: "",
  bio: "AI Systems & Open Source Maintainer",
  company: "GitHub Research",
  location: "San Francisco",
  totalRepos: 8,
  totalStars: 1234,
  totalForks: 56,
  totalCommits: 789,
  totalFollowers: 345,
  totalFollowing: 12,
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  topLanguages: [
    { name: "Python", count: 5, percentage: 50 },
    { name: "TypeScript", count: 3, percentage: 30 },
    { name: "Jupyter Notebook", count: 2, percentage: 20 },
  ],
  aiStack: ["PyTorch", "LangChain", "Python", "FastAPI"],
  inferredRole: "AI & ML Engineer",
};

const svg = generateSVG(stats, "neural", true, "modern", "AI & ML Engineer");
writeFileSync("/tmp/github-stats-example.svg", svg, "utf8");
console.log("Wrote /tmp/github-stats-example.svg");
