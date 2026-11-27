import { CardVariant, GitHubStats } from "./types";
import { themes, langColors } from "./config";
import { escapeXml, formatNumber, truncate } from "./utils";

function stripEmoji(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fitStackLine(items: string[], maxChars: number): string {
  const chosen: string[] = [];
  for (const item of items) {
    const candidate = chosen.length === 0 ? item : `${chosen.join(" · ")} · ${item}`;
    if (candidate.length <= maxChars) {
      chosen.push(item);
    }
  }
  return chosen.length > 0 ? chosen.join(" · ") : truncate(items[0] || "Software Engineering", maxChars);
}

function getStatIcon(kind: "repos" | "stars" | "commits" | "forks", color: string): string {
  switch (kind) {
    case "repos":
      return `<g fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2H11a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3.5A1.5 1.5 0 0 1 2 11.5v-8Z"/>
        <path d="M2 10.5A1.5 1.5 0 0 1 3.5 9H12"/>
      </g>`;
    case "stars":
      return `<polygon points="7,1.3 8.8,4.9 12.8,5.5 9.9,8.3 10.6,12.3 7,10.4 3.4,12.3 4.1,8.3 1.2,5.5 5.2,4.9" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>`;
    case "commits":
      return `<g fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round">
        <circle cx="7" cy="7" r="2.6"/>
        <line x1="1" y1="7" x2="4.4" y2="7"/>
        <line x1="9.6" y1="7" x2="13" y2="7"/>
      </g>`;
    case "forks":
      return `<g fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="4" cy="3" r="1.5"/>
        <circle cx="10" cy="3" r="1.5"/>
        <circle cx="7" cy="11.5" r="1.5"/>
        <path d="M4 4.5v1.5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4.5M7 8v2"/>
      </g>`;
  }
}

export function generateSVG(
  stats: GitHubStats,
  themeKey: string = "dark",
  animate: boolean = true,
  variant: CardVariant = "modern",
  customRole?: string
): string {
  const t = themes[themeKey] || themes.dark;

  const W = 880;
  const H = 400;
  const pad = 32;
  const fontSans = "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  const fontMono = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace";

  const displayName = escapeXml(truncate(stripEmoji(stats.name) || stats.username, 28));
  const safeUsername = escapeXml(stats.username);
  const rawBio = stripEmoji(stats.bio);
  const bioText = escapeXml(
    truncate(rawBio || "Building production software and intelligent systems.", 54)
  );
  const roleLabel = escapeXml(truncate(stripEmoji(customRole || stats.inferredRole || "Software Engineer"), 26));

  const joinedYear = stats.createdAt ? new Date(stats.createdAt).getFullYear() : "";
  const metaParts: string[] = [];
  if (stats.company) metaParts.push(truncate(stripEmoji(stats.company), 22));
  if (stats.location) metaParts.push(truncate(stripEmoji(stats.location), 20));
  if (joinedYear) metaParts.push(`Joined ${joinedYear}`);
  const subMetaText = escapeXml(metaParts.join(" · ") || `@${stats.username}`);

  const initial = escapeXml((stripEmoji(stats.name) || stats.username || "G").charAt(0).toUpperCase());

  // Body geometry (strictly non-overlapping)
  const bodyY = 118;
  const bodyH = 232;
  const leftW = 434;
  const cGap = 14;
  const cW = Math.floor((leftW - cGap) / 2); // 210
  const cH = Math.floor((bodyH - cGap) / 2); // 109

  const dividerX = pad + leftW + 21; // 487
  const rightX = pad + leftW + 42; // 508
  const rightW = W - rightX - pad; // 340

  // IMPORTANT: Never animate `transform` on <g transform="translate(...)"> elements,
  // because CSS `transform` overrides SVG `transform` attributes and resets them to (0,0).
  const getFadeAnim = (delayMs: number) =>
    animate ? `animation: fadeIn 0.4s ease-out ${delayMs}ms both;` : "";

  const getBarAnim = (delayMs: number) =>
    animate ? `transform-origin: left center; animation: growBar 0.6s cubic-bezier(0.16,1,0.3,1) ${delayMs}ms both;` : "";

  const cards: Array<{
    kind: "repos" | "stars" | "commits" | "forks";
    label: string;
    sub: string;
    value: number;
    color: string;
    col: number;
    row: number;
  }> = [
    { kind: "repos", label: "REPOSITORIES", sub: "Public repositories", value: stats.totalRepos, color: t.accent, col: 0, row: 0 },
    { kind: "stars", label: "TOTAL STARS", sub: "Stars across repos", value: stats.totalStars, color: t.success, col: 1, row: 0 },
    { kind: "commits", label: "TOTAL COMMITS", sub: "Public contributions", value: stats.totalCommits, color: t.title, col: 0, row: 1 },
    { kind: "forks", label: "TOTAL FORKS", sub: "Repository forks", value: stats.totalForks, color: t.warning, col: 1, row: 1 },
  ];

  const cardBgFill = variant === "glass" ? "url(#glassGrad)" : t.cardBg;
  const cardStrokeWidth = variant === "minimal" ? "1" : "1.2";

  const cardsSVG = cards
    .map((c, i) => {
      const x = pad + c.col * (cW + cGap);
      const y = bodyY + c.row * (cH + cGap);
      const anim = getFadeAnim(70 + i * 50);
      return `
  <g transform="translate(${x},${y})">
    <g class="stat-card" style="${anim}">
      <rect class="card-bg" width="${cW}" height="${cH}" rx="12" fill="${cardBgFill}" stroke="${t.border}" stroke-width="${cardStrokeWidth}"/>
      <g transform="translate(16, 17)">
        ${getStatIcon(c.kind, c.color)}
        <text x="20" y="11" font-family="${fontSans}" font-size="10.5" font-weight="700" fill="${t.textMuted}" letter-spacing="0.9">${c.label}</text>
      </g>
      <text x="16" y="69" font-family="${fontMono}" font-size="29" font-weight="700" fill="${t.text}" class="num">${formatNumber(c.value)}</text>
      <text x="16" y="90" font-family="${fontSans}" font-size="11" fill="${t.textMuted}">${c.sub}</text>
      <rect x="16" y="100" width="26" height="2.5" rx="1.25" fill="${c.color}" opacity="0.85"/>
    </g>
  </g>`;
    })
    .join("");

  const langs = stats.topLanguages.slice(0, 5);

  let accX = 0;
  const stackedSegments = langs
    .map((lang) => {
      const segW = Math.max(2, (lang.percentage / 100) * rightW);
      const color = langColors[lang.name] || t.accent;
      const rect = `<rect x="${accX.toFixed(2)}" y="0" width="${segW.toFixed(2)}" height="7" fill="${color}"/>`;
      accX += segW;
      return rect;
    })
    .join("");

  const langsSVG =
    langs.length > 0
      ? langs
          .map((lang, i) => {
            const color = langColors[lang.name] || t.accent;
            const barW = Math.max(4, (lang.percentage / 100) * rightW);
            const rowY = i * 29;
            const delay = 160 + i * 45;
            return `
    <g transform="translate(0,${rowY})">
      <g style="${getFadeAnim(delay)}">
        <circle cx="5" cy="8" r="4.5" fill="${color}"/>
        <text x="17" y="12" font-family="${fontSans}" font-size="12.5" font-weight="600" fill="${t.text}">${escapeXml(truncate(lang.name, 22))}</text>
        <text x="${rightW}" y="12" font-family="${fontMono}" font-size="12" font-weight="600" fill="${t.textMuted}" text-anchor="end" class="num">${lang.percentage.toFixed(1)}%</text>
        <rect x="0" y="19" width="${rightW}" height="4.5" rx="2.25" fill="${t.border}" opacity="0.45"/>
        <rect x="0" y="19" width="${barW.toFixed(2)}" height="4.5" rx="2.25" fill="${color}" style="${getBarAnim(delay + 50)}"/>
      </g>
    </g>`;
          })
          .join("")
      : `<text x="0" y="24" font-family="${fontSans}" font-size="12.5" fill="${t.textMuted}">No public language data available</text>`;

  const stackItems =
    stats.aiStack.length > 0
      ? stats.aiStack
      : langs.slice(0, 4).map((l) => l.name);
  const stackLine = escapeXml(
    fitStackLine(stackItems.length > 0 ? stackItems : ["Open Source Development"], 44)
  );

  const updatedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const bgFill = variant === "glass" ? "url(#bgGlassGrad)" : t.bg;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub Stats for ${safeUsername}">
  <defs>
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes growBar {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      .num { font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums; }
      ${
        variant !== "minimal"
          ? `.stat-card .card-bg { transition: stroke 0.18s ease; }
             .stat-card:hover .card-bg { stroke: ${t.title}; }`
          : ""
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; opacity: 1 !important; }
      }
    </style>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${t.title}"/>
      <stop offset="100%" stop-color="${t.accent}"/>
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.cardBg}" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="${t.bg}" stop-opacity="0.78"/>
    </linearGradient>
    <linearGradient id="bgGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bg}" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="${t.cardBg}" stop-opacity="0.95"/>
    </linearGradient>
    <radialGradient id="ambientGlow" cx="88%" cy="8%" r="55%">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="${t.isLight ? "0.08" : "0.14"}"/>
      <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="cardClip">
      <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19"/>
    </clipPath>
    <clipPath id="headerTextClip">
      <rect x="0" y="0" width="510" height="72"/>
    </clipPath>
    <clipPath id="distBarClip">
      <rect x="0" y="0" width="${rightW}" height="7" rx="3.5"/>
    </clipPath>
    <clipPath id="stackClip">
      <rect x="0" y="0" width="${rightW}" height="42"/>
    </clipPath>
  </defs>

  <!-- Card Background -->
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="20" fill="${bgFill}" stroke="${t.border}" stroke-width="1.5"/>

  <g clip-path="url(#cardClip)">
    ${variant !== "minimal" ? `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#ambientGlow)"/>` : ""}
    <rect x="0" y="0" width="${W}" height="3.5" fill="url(#accentGrad)"/>
  </g>

  <!-- Profile Header -->
  <g transform="translate(${pad}, 26)">
    <g style="${getFadeAnim(0)}">
      <rect x="0" y="0" width="54" height="54" rx="14" fill="${t.accent}" fill-opacity="0.12" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="1"/>
      <text x="27" y="35" font-family="${fontSans}" font-size="22" font-weight="700" fill="${t.title}" text-anchor="middle">${initial}</text>

      <g transform="translate(70, 0)" clip-path="url(#headerTextClip)">
        <text x="0" y="19" font-family="${fontSans}" font-size="20" font-weight="700" fill="${t.text}" letter-spacing="-0.3">${displayName}</text>
        <text x="0" y="39" font-family="${fontSans}" font-size="12.5" fill="${t.textMuted}">
          <tspan fill="${t.title}" font-weight="600">@${safeUsername}</tspan>
          <tspan> · ${bioText}</tspan>
        </text>
        <text x="0" y="57" font-family="${fontSans}" font-size="11.5" fill="${t.textMuted}">${subMetaText}</text>
      </g>

      <g transform="translate(${W - pad * 2}, 0)">
        <text x="0" y="19" font-family="${fontSans}" font-size="12.5" font-weight="700" fill="${t.title}" text-anchor="end">${roleLabel}</text>
        <text x="0" y="39" font-family="${fontMono}" font-size="11" fill="${t.textMuted}" text-anchor="end" class="num">${formatNumber(stats.totalFollowers)} followers · ${formatNumber(stats.totalRepos)} repos</text>
      </g>
    </g>
  </g>

  <!-- Header Divider -->
  <line x1="${pad}" y1="102" x2="${W - pad}" y2="102" stroke="${t.divider}" stroke-width="1"/>

  <!-- Left Column: 2x2 KPI Cards -->
  ${cardsSVG}

  <!-- Column Divider -->
  <line x1="${dividerX}" y1="${bodyY}" x2="${dividerX}" y2="${bodyY + bodyH}" stroke="${t.divider}" stroke-width="1"/>

  <!-- Right Column: Top Languages & Engineering Stack -->
  <g transform="translate(${rightX}, ${bodyY})">
    <g style="${getFadeAnim(100)}">
      <g fill="none" stroke="${t.title}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" transform="translate(0, 1)">
        <polyline points="4,3 1,6.5 4,10"/>
        <polyline points="10,3 13,6.5 10,10"/>
        <line x1="8" y1="2" x2="6" y2="11"/>
      </g>
      <text x="20" y="11" font-family="${fontSans}" font-size="10.5" font-weight="700" fill="${t.title}" letter-spacing="1.1">TOP LANGUAGES</text>
      <text x="${rightW}" y="11" font-family="${fontMono}" font-size="11" fill="${t.textMuted}" text-anchor="end" class="num">${langs.length} primary</text>
    </g>

    <!-- Proportional Stacked Bar -->
    <g transform="translate(0, 23)" clip-path="url(#distBarClip)">
      <g style="${getFadeAnim(130)}">
        <rect x="0" y="0" width="${rightW}" height="7" fill="${t.border}" opacity="0.45"/>
        ${stackedSegments}
      </g>
    </g>

    <!-- Language Breakdown Rows -->
    <g transform="translate(0, 42)">
      ${langsSVG}
    </g>

    <!-- AI / Engineering Stack Summary -->
    <g transform="translate(0, 196)" clip-path="url(#stackClip)">
      <g style="${getFadeAnim(320)}">
        <line x1="0" y1="0" x2="${rightW}" y2="0" stroke="${t.divider}" stroke-width="1"/>
        <text x="0" y="16" font-family="${fontSans}" font-size="10" font-weight="700" fill="${t.textMuted}" letter-spacing="1">ENGINEERING STACK</text>
        <text x="0" y="34" font-family="${fontMono}" font-size="11.5" font-weight="500" fill="${t.text}">${stackLine}</text>
      </g>
    </g>
  </g>

  <!-- Footer -->
  <line x1="${pad}" y1="364" x2="${W - pad}" y2="364" stroke="${t.divider}" stroke-width="1"/>
  <g transform="translate(${pad}, 383)">
    <g style="${getFadeAnim(360)}">
      <text x="0" y="0" font-family="${fontMono}" font-size="11" fill="${t.textMuted}" class="num">${formatNumber(stats.totalCommits)} commits · ${formatNumber(stats.totalStars)} stars · ${formatNumber(stats.totalForks)} forks</text>
      <text x="${W - pad * 2}" y="0" font-family="${fontMono}" font-size="11" fill="${t.textMuted}" text-anchor="end">github-stats-api · ${escapeXml(updatedDate)}</text>
    </g>
  </g>
</svg>`;
}

export function generateErrorSVG(
  title: string,
  message: string,
  themeKey: string = "dark"
): string {
  const t = themes[themeKey] || themes.dark;
  const W = 880;
  const H = 180;
  const fontSans = "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  const fontMono = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace";

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}">
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="18" fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"/>
  <g transform="translate(32, 36)">
    <circle cx="16" cy="16" r="14" fill="${t.warning}" fill-opacity="0.15" stroke="${t.warning}" stroke-width="1.5"/>
    <line x1="16" y1="10" x2="16" y2="18" stroke="${t.warning}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="16" cy="22.5" r="1.2" fill="${t.warning}"/>
    <text x="44" y="21" font-family="${fontSans}" font-size="17" font-weight="700" fill="${t.text}">${escapeXml(truncate(title, 60))}</text>
    <text x="44" y="50" font-family="${fontMono}" font-size="12.5" fill="${t.textMuted}">${escapeXml(truncate(message, 88))}</text>
    <text x="44" y="84" font-family="${fontMono}" font-size="11" fill="${t.title}">GET /api/stats?username=&lt;github_handle&gt;&amp;theme=neural</text>
  </g>
</svg>`;
}

export function generateMiniSVG(
  stats: GitHubStats,
  themeKey: string = "dark",
  animate: boolean = true
): string {
  const t = themes[themeKey] || themes.dark;
  const W = 400;
  const H = 180;
  const fontSans = "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  const fontMono = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace";

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mini Stats for ${escapeXml(stats.username)}">
    <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="14" fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"/>
    <text x="24" y="38" font-family="${fontSans}" font-size="18" font-weight="700" fill="${t.text}">${escapeXml(truncate(stats.name || stats.username, 22))}</text>
    <text x="24" y="58" font-family="${fontMono}" font-size="12" fill="${t.title}">@${escapeXml(stats.username)}</text>
    <text x="24" y="102" font-family="${fontMono}" font-size="13" fill="${t.text}">${formatNumber(stats.totalRepos)} repos · ${formatNumber(stats.totalStars)} stars · ${formatNumber(stats.totalCommits)} commits</text>
    <text x="24" y="146" font-family="${fontMono}" font-size="11" fill="${t.textMuted}">${escapeXml(truncate(stats.inferredRole, 34))}</text>
    ${animate ? `<circle cx="${W - 24}" cy="28" r="4" fill="${t.success}"><animate attributeName="opacity" values="1;0.35;1" dur="2.2s" repeatCount="indefinite"/></circle>` : ""}
  </svg>`;
}
