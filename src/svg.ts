import { GitHubStats } from "./types";
import { themes, langColors } from "./config";
import { formatNumber, truncate } from "./utils";

export function generateSVG(
  stats: GitHubStats,
  themeKey: keyof typeof themes,
  animate: boolean,
  variant: "modern" | "glass" | "minimal" = "modern"
): string {
  const t = themes[themeKey] || themes.dark;

  // Enhanced constants with responsive design
  const W = 860;
  const H = 380; // Increased height for better spacing
  const pad = 32;
  const fontStack = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif";

  // Gradient definitions based on variant
  const getGradients = () => {
    if (variant === "glass") {
      return `
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${t.cardBg};stop-opacity:0.8"/>
          <stop offset="100%" style="stop-color:${t.bg};stop-opacity:0.6"/>
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${t.accent}"/>
          <stop offset="100%" style="stop-color:${t.success}"/>
        </linearGradient>
      `;
    }
    return `
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${t.accent}"/>
        <stop offset="100%" style="stop-color:${t.accent}20"/>
      </linearGradient>
    `;
  };

  // Layout Logic with improved spacing
  const leftW = 460;
  const rightX = leftW + 48;
  const rightW = W - rightX - pad;

  // Modern stat grid
  const cGap = 16;
  const cW = Math.floor((leftW - pad - cGap) / 2);
  const cH = 92;
  const cardsY = 120;

  // Enhanced animations
  const getAnim = (d: number) => animate
    ? `opacity:0;animation:fadeIn 0.6s cubic-bezier(0.4,0,0.2,1) ${d}ms forwards;`
    : "";
  const getBarAnim = (d: number) => animate
    ? `transform-origin:left center;animation:growBar 0.8s cubic-bezier(0.34,1.2,0.64,1) ${d}ms both;`
    : "";
  const getHoverEffect = () => variant !== "minimal"
    ? `<style>
        .card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card:hover { transform: translateY(-4px); filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1)); }
      </style>`
    : "";

  // Enhanced Stat Card with modern design
  const statCard = (
    x: number, y: number,
    label: string, value: number,
    color: string, delay: number,
    icon: string
  ) => {
    const bgFill = variant === "glass" ? "url(#glassGrad)" : t.cardBg;
    const borderWidth = variant === "minimal" ? "1" : "1.5";
    const borderRadius = variant === "modern" ? "16" : "12";

    return `
  <g transform="translate(${x},${y})" class="card" style="${getAnim(delay)}">
    <rect width="${cW}" height="${cH}" rx="${borderRadius}" fill="${bgFill}" stroke="${t.border}" stroke-width="${borderWidth}" opacity="${variant === "glass" ? "0.95" : "1"}"/>
    <g transform="translate(${pad / 2}, 20)">
      <text x="0" y="0" font-family="${fontStack}" font-size="32" font-weight="800" fill="${t.text}" letter-spacing="-1">${formatNumber(value)}</text>
      <text x="0" y="22" font-family="${fontStack}" font-size="10" font-weight="600" fill="${t.textMuted}" letter-spacing="1.2" text-transform="uppercase">${label}</text>
      <rect x="0" y="36" width="24" height="3" rx="1.5" fill="url(#accentGrad)"/>
    </g>
  </g>`;
  };

  // Modern Language Row with glow effect
  const langRow = (lang: { name: string; percentage: number }, i: number) => {
    const color = langColors[lang.name] || t.accent;
    const barMaxW = rightW;
    const barW = (lang.percentage / 100) * barMaxW;
    const y = i * 42;
    const delay = 300 + i * 50;

    return `
  <g transform="translate(0,${y})" style="${getAnim(delay)}">
    <g transform="translate(0,0)">
      <circle cx="8" cy="8" r="6" fill="${color}" opacity="0.8"/>
      <text x="24" y="12" font-family="${fontStack}" font-size="13" font-weight="500" fill="${t.text}">${lang.name}</text>
      <text x="${barMaxW}" y="12" font-family="${fontStack}" font-size="12" font-weight="600" fill="${color}" text-anchor="end">${lang.percentage.toFixed(1)}%</text>
    </g>
    <g transform="translate(0,22)">
      <rect x="0" y="0" width="${barMaxW}" height="6" rx="3" fill="${t.border}" opacity="0.15"/>
      <rect x="0" y="0" width="${barW}" height="6" rx="3" fill="${color}" style="${getBarAnim(delay + 100)}"/>
      ${variant === "modern" ? `<rect x="0" y="0" width="${barW}" height="6" rx="3" fill="${color}" opacity="0.3" style="filter: blur(2px); transform-origin:left center; animation:growBar 0.8s cubic-bezier(0.34,1.2,0.64,1) ${delay + 100}ms both;"/>` : ""}
    </g>
  </g>`;
  };

  const cards = [
    { label: "REPOSITORIES", value: stats.totalRepos, color: t.accent, col: 0, row: 0, icon: "📁" },
    { label: "TOTAL STARS", value: stats.totalStars, color: t.success, col: 1, row: 0, icon: "⭐" },
    { label: "TOTAL FORKS", value: stats.totalForks, color: t.warning, col: 0, row: 1, icon: "🔱" },
    { label: "TOTAL COMMITS", value: stats.totalCommits, color: t.title, col: 1, row: 1, icon: "💻" },
  ];

  const cardsSVG = cards.map((c, i) =>
    statCard(pad + c.col * (cW + cGap), cardsY + c.row * (cH + cGap), c.label, c.value, c.color, 100 + i * 60, c.icon)
  ).join("");

  const langsSVG = stats.topLanguages.length > 0
    ? stats.topLanguages.slice(0, 6).map((l, i) => langRow(l, i)).join("")
    : `<text y="20" font-family="${fontStack}" font-size="13" fill="${t.textMuted}" text-anchor="middle" style="${getAnim(300)}">📊 No language data available</text>`;

  const bgStyle = variant === "glass"
    ? `fill="${t.bg}" opacity="0.95" backdrop-filter="blur(10px)"`
    : `fill="${t.bg}"`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub Stats for ${stats.username}">
  <defs>
    <style>
      @keyframes fadeIn { 
        from { opacity:0; transform:translateY(15px); } 
        to { opacity:1; transform:translateY(0); } 
      }
      @keyframes growBar { 
        from { transform: scaleX(0); } 
        to { transform: scaleX(1); } 
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .stat-value { font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums; }
      ${getHoverEffect()}
    </style>
    ${getGradients()}
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.15)"/>
    </filter>
  </defs>

  <!-- Background with variant styling -->
  <rect width="${W}" height="${H}" rx="24" ${bgStyle} stroke="${t.border}" stroke-width="1.5" filter="${variant === "modern" ? "url(#shadow)" : "none"}"/>
  
  ${variant === "modern" ? `<rect width="${W}" height="4" rx="2" fill="url(#accentGrad)"/>` : ""}

  <!-- Profile Header with enhanced design -->
  <g transform="translate(${pad}, ${pad})" style="${getAnim(0)}">
    <g filter="${variant === "modern" ? "url(#glow)" : "none"}">
      <rect width="56" height="56" rx="16" fill="${t.accent}" opacity="0.12"/>
      <text x="28" y="38" font-family="${fontStack}" font-size="26" font-weight="800" fill="${t.accent}" text-anchor="middle">${(stats.name || stats.username).charAt(0).toUpperCase()}</text>
    </g>
    
    <text x="76" y="24" font-family="${fontStack}" font-size="22" font-weight="800" fill="${t.title}" letter-spacing="-0.5">${truncate(stats.name || stats.username, 30)}</text>
    <text x="76" y="46" font-family="${fontStack}" font-size="14" fill="${t.textMuted}">
      <tspan fill="${t.accent}" font-weight="600">@${stats.username}</tspan>
      ${stats.bio ? ` • ${truncate(stats.bio, 50)}` : ' • GitHub Developer'}
    </text>
    
    ${stats.company || stats.location ? `
    <text x="76" y="62" font-family="${fontStack}" font-size="12" fill="${t.textMuted}" opacity="0.8">
      ${stats.company ? `🏢 ${truncate(stats.company, 25)}` : ''}
      ${stats.location ? `📍 ${truncate(stats.location, 20)}` : ''}
    </text>` : ''}
  </g>

  <!-- Stats Grid -->
  ${cardsSVG}

  <!-- Languages & Activity Section -->
  <g transform="translate(${rightX}, ${pad + 5})">
    <g transform="translate(0, 0)">
      <text y="10" font-family="${fontStack}" font-size="11" font-weight="700" fill="${t.title}" letter-spacing="1.5" style="${getAnim(180)}">📊 TOP LANGUAGES</text>
      <g transform="translate(0, 28)">
        ${langsSVG}
      </g>
    </g>
  </g>

  <!-- Footer with enhanced info -->
  <g transform="translate(${pad}, ${H - 28})" opacity="0.5" style="${getAnim(600)}">
    <text font-family="monospace" font-size="10" fill="${t.textMuted}">
      🚀 ${stats.totalRepos + stats.totalStars + stats.totalForks} total contributions
    </text>
    <text x="${W - pad * 2}" font-family="monospace" font-size="10" fill="${t.textMuted}" text-anchor="end">
      ✨ github-stats-api • ${new Date().toLocaleDateString()}
    </text>
  </g>
</svg>`;
}

// Optional: Add function for generating mini variant
export function generateMiniSVG(
  stats: GitHubStats,
  themeKey: keyof typeof themes,
  animate: boolean
): string {
  const t = themes[themeKey] || themes.dark;
  const W = 400;
  const H = 220;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" rx="12" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>
    <text x="20" y="40" font-size="20" font-weight="800" fill="${t.title}">${truncate(stats.username, 20)}</text>
    <text x="20" y="60" font-size="12" fill="${t.textMuted}">${stats.totalRepos} repos • ${stats.totalStars} ★</text>
    ${animate ? `<circle cx="${W - 20}" cy="20" r="4" fill="${t.success}"><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/></circle>` : ''}
  </svg>`;
}