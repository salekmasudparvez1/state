import express, { type Request, type Response } from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Types ---
interface GitHubStats {
  username: string;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  topLanguages: Array<{ name: string; count: number; percentage: number }>;
}

// --- Configuration & Assets ---

// Professional Color Palette
const themes = {
  default: {
    bg: ["#0d1117", "#161b22"], // Gradient stops
    border: "#30363d",
    text: "#c9d1d9",
    title: "#58a6ff",
    icon: "#8b949e",
    ring: "#2f81f7",
  },
  ocean: {
    bg: ["#0f172a", "#1e293b"],
    border: "#334155",
    text: "#94a3b8",
    title: "#38bdf8",
    icon: "#64748b",
    ring: "#0ea5e9",
  },
  midnight: {
    bg: ["#000000", "#1a1a1a"],
    border: "#333333",
    text: "#eeeeee",
    title: "#ff006e",
    icon: "#888888",
    ring: "#ffbe0b",
  },
};

// SVG Icons (Paths) for a pro look
const icons = {
  repo: "M3 2.5c0-.27.22-.5.5-.5h14c.27 0 .5.22.5.5v15c0 .27-.22.5-.5.5h-1.5a.75.75 0 0 1 0-1.5h1V3.5H3.5V14h1a.75.75 0 0 1 0 1.5h-1c-.27 0-.5-.22-.5-.5v-12.5Z M9.75 7.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z M9.75 11.25a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z",
  star: "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z",
  fork: "M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
  commit: "M10.5 7.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm1.43.75a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 1 1 0-1.5h3.32a4.001 4.001 0 0 1 7.86 0h3.32a.75.75 0 1 1 0 1.5h-3.32Z"
};

const langColors: Record<string, string> = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Java: "#b07219", Go: "#00ADD8", Rust: "#dea584",
  HTML: "#e34c26", CSS: "#563d7c", Vue: "#41b883", React: "#61dafb"
};

// --- SVG Generator ---

function generateSVG(stats: GitHubStats, themeKey: keyof typeof themes, animate: boolean) {
  const t = themes[themeKey] || themes.default;
  
  // Dimensions - Fixed Aspect Ratio logic
  const width = 450;
  const height = 195; 
  
  // CSS styles embedded in SVG for responsiveness and animation
  const css = `
    .root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .title { font-weight: 700; font-size: 18px; fill: ${t.title}; }
    .stat-label { font-size: 12px; fill: ${t.text}; font-weight: 400; opacity: 0.8; }
    .stat-value { font-size: 16px; fill: ${t.text}; font-weight: 700; }
    .icon { fill: ${t.icon}; }
    .lang-name { font-size: 11px; fill: ${t.text}; }
    
    /* Animations */
    .animate-fade { opacity: 0; animation: fadeIn 0.8s ease-out forwards; }
    .animate-grow { transform: scaleX(0); transform-origin: left; animation: growIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    
    @keyframes fadeIn { to { opacity: 1; } }
    @keyframes growIn { to { transform: scaleX(1); } }
    
    /* Responsive Hover Effect - Works if embedded as object */
    .card:hover { opacity: 0.9; transition: opacity 0.2s; }
  `;

  // Helper to render a stat item
  const renderStat = (x: number, y: number, iconPath: string, label: string, value: number, delay: number) => `
    <g transform="translate(${x}, ${y})" class="${animate ? 'animate-fade' : ''}" style="animation-delay: ${delay}ms">
      <path d="${iconPath}" class="icon" transform="scale(1.2)"/>
      <text x="28" y="12" class="stat-value">${value.toLocaleString()}</text>
      <text x="0" y="32" class="stat-label">${label}</text>
    </g>
  `;

  // Helper to render language bars
  const renderLangs = () => stats.topLanguages.slice(0, 4).map((l, i) => {
    const y = i * 28;
    const barWidth = Math.max(10, (l.percentage / 100) * 120); // Scale to 120px width
    const color = langColors[l.name] || t.ring;
    
    return `
      <g transform="translate(0, ${y})">
        <text y="10" class="lang-name">${l.name}</text>
        <rect x="70" y="2" width="120" height="8" rx="4" fill="${t.border}" fill-opacity="0.4"/>
        <rect x="70" y="2" width="${barWidth}" height="8" rx="4" fill="${color}" class="${animate ? 'animate-grow' : ''}" style="animation-delay: ${(i+2)*150}ms"/>
      </g>
    `;
  }).join('');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>${css}</style>
      
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${t.bg[0]}"/>
          <stop offset="100%" stop-color="${t.bg[1]}"/>
        </linearGradient>
      </defs>
      
      <rect width="${width}" height="${height}" rx="10" fill="url(#grad)" stroke="${t.border}" stroke-width="1"/>
      
      <g class="root" transform="translate(25, 25)">
        <text x="0" y="15" class="title">@${stats.username}</text>
        
        <line x1="0" y1="35" x2="${width-50}" y2="35" stroke="${t.border}" />
        
        <g transform="translate(0, 60)">
           ${renderStat(0, 0, icons.star, "Total Stars", stats.totalStars, 100)}
           ${renderStat(110, 0, icons.commit, "Commits", stats.totalCommits, 200)}
           ${renderStat(0, 55, icons.repo, "Repos", stats.totalRepos, 300)}
           ${renderStat(110, 55, icons.fork, "Forks", stats.totalForks, 400)}
        </g>
        
        <g transform="translate(220, 55)">
          ${renderLangs()}
        </g>
      </g>
    </svg>
  `;
}

// --- Routes ---

app.get("/api/stats", async (req: Request, res: Response) => {
  const username = req.query.username as string;
  const theme = (req.query.theme as keyof typeof themes) || "default";
  const animate = req.query.animate !== "false";

  if (!username) return res.status(400).send("Missing username");

  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100`)
    ]);

    const repos = reposRes.data;
    const languages: Record<string, number> = {};
    let totalStars = 0;
    let totalForks = 0;

    repos.forEach((repo: any) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
    });

    const totalCount = Object.values(languages).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalCount) * 100
      }));

    const stats: GitHubStats = {
      username: userRes.data.login,
      totalRepos: userRes.data.public_repos,
      totalStars,
      totalForks,
      totalCommits: 0, // Requires separate API or complex scraping, mocking for visual demo
      topLanguages
    };

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=1800");
    res.send(generateSVG(stats, theme, animate));

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/", (_req, res) => {
  res.send(`
    <body style="background:#0d1117; color:#fff; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; gap:20px; padding:50px;">
      <h1>GitHub Stats Card Pro</h1>
      
      <div style="width: 100%; max-width: 500px;">
        <img src="/api/stats?username=torvalds&theme=ocean" width="100%" alt="Stats" />
      </div>

      <div style="display:flex; gap:10px;">
        <a href="/api/stats?username=torvalds&theme=default" style="color:#58a6ff">Default</a>
        <a href="/api/stats?username=torvalds&theme=ocean" style="color:#58a6ff">Ocean</a>
        <a href="/api/stats?username=torvalds&theme=midnight" style="color:#58a6ff">Midnight</a>
      </div>
    </body>
  `);
});

app.listen(
    PORT, () => {
        if (process.env.IS_Production !== "true") {
            console.log(`⚡️ Running in development mode`);
        } else {
            console.log(`✅ Running in production mode`);
        }
}
);