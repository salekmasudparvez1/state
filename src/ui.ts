export function getStudioHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GitHub Stats API — AI Engineer Card Studio</title>
  <meta name="description" content="Self-hosted GitHub Stats SVG API engineered for AI and ML developer profiles." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #0b0f17;
      --surface: #111827;
      --surface-alt: #0f1623;
      --border: #1e293b;
      --border-strong: #334155;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-strong: #0284c7;
      --success: #10b981;
      --danger: #ef4444;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    a { color: inherit; text-decoration: none; }

    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Top Navigation Bar (3-zone contract) */
    .topbar {
      border-bottom: 1px solid var(--border);
      background: rgba(11, 15, 23, 0.92);
      position: sticky;
      top: 0;
      z-index: 20;
      backdrop-filter: blur(8px);
    }

    .topbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      height: 64px;
    }

    .brand {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.02em;
      white-space: nowrap;
      flex-shrink: 0;
      color: var(--text);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-muted);
    }

    .nav-links a {
      white-space: nowrap;
      flex-shrink: 0;
      transition: color 0.15s ease;
    }

    .nav-links a:hover {
      color: var(--text);
    }

    .btn-primary {
      background: var(--accent);
      color: #06121e;
      border: 1px solid transparent;
      border-radius: 8px;
      padding: 8px 16px;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: background 0.15s ease, transform 0.15s ease;
    }

    .btn-primary:hover { background: #7dd3fc; }
    .btn-primary:active { transform: translateY(1px); }

    .btn-secondary {
      background: var(--surface-alt);
      color: var(--text);
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      padding: 8px 14px;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: border-color 0.15s ease, background 0.15s ease;
    }

    .btn-secondary:hover {
      border-color: var(--accent);
      background: #162032;
    }

    /* Hero Intro */
    .hero {
      padding: 36px 0 24px;
      border-bottom: 1px solid var(--border);
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: clamp(1.75rem, 3vw, 2.35rem);
      font-weight: 700;
      letter-spacing: -0.025em;
      text-wrap: balance;
    }

    .hero p {
      margin: 0;
      color: var(--text-muted);
      font-size: 15px;
      max-width: 68ch;
    }

    /* Main Workspace Grid */
    .workspace {
      display: grid;
      grid-template-columns: 360px minmax(0, 1fr);
      gap: 24px;
      padding: 28px 0 40px;
      align-items: start;
    }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
    }

    .panel-title {
      margin: 0 0 16px;
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.01em;
    }

    .field {
      margin-bottom: 16px;
    }

    .field:last-child {
      margin-bottom: 0;
    }

    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .input, .select {
      width: 100%;
      height: 40px;
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      padding: 0 12px;
      font-family: var(--font-sans);
      font-size: 14px;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .input:focus, .select:focus {
      border-color: var(--accent);
    }

    .preset-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .preset-btn {
      background: var(--bg);
      color: var(--text-muted);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 9px;
      font-family: var(--font-mono);
      font-size: 11.5px;
      cursor: pointer;
      transition: color 0.15s ease, border-color 0.15s ease;
    }

    .preset-btn:hover, .preset-btn.active {
      color: var(--accent);
      border-color: var(--accent);
    }

    .segmented {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      background: var(--bg);
      padding: 4px;
      border: 1px solid var(--border);
      border-radius: 8px;
    }

    .seg-btn {
      background: transparent;
      color: var(--text-muted);
      border: none;
      border-radius: 6px;
      padding: 7px 8px;
      font-family: var(--font-sans);
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .seg-btn.active {
      background: var(--surface);
      color: var(--text);
      box-shadow: inset 0 0 0 1px var(--border-strong);
    }

    .segmented-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 18px;
    }

    .form-actions .btn-primary {
      flex: 1;
      height: 40px;
    }

    /* Preview Canvas */
    .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .preview-meta {
      font-size: 12.5px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums;
    }

    .preview-stage {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 280px;
      overflow: hidden;
      position: relative;
    }

    .preview-stage img {
      width: 100%;
      max-width: 880px;
      height: auto;
      display: block;
    }

    .loading-skeleton {
      width: 100%;
      max-width: 880px;
      aspect-ratio: 880 / 400;
      border-radius: 14px;
      background: linear-gradient(90deg, #111827 25%, #1a2334 50%, #111827 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .error-banner {
      margin-top: 12px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.08);
      color: #fca5a5;
      font-size: 13px;
      display: none;
    }

    /* Metrics Summary Row */
    .kpi-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .kpi-cell {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 14px;
    }

    .kpi-cell-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .kpi-cell-val {
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--text);
    }

    /* Embed Code Box */
    .embed-box {
      margin-top: 16px;
      border-top: 1px solid var(--border);
      padding-top: 16px;
    }

    .embed-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    .code-block {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: #bae6fd;
      overflow-x: auto;
      white-space: nowrap;
    }

    /* API Reference Table */
    .docs-section {
      padding: 32px 0 56px;
      border-top: 1px solid var(--border);
    }

    .docs-section h2 {
      margin: 0 0 14px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.015em;
    }

    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13.5px;
    }

    th {
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
      background: var(--surface-alt);
    }

    td {
      padding: 11px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    tr:last-child td { border-bottom: none; }

    code {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--accent);
    }

    @media (max-width: 960px) {
      .workspace {
        grid-template-columns: 1fr;
      }
      .kpi-strip {
        grid-template-columns: repeat(2, 1fr);
      }
      .nav-links {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="container topbar-inner">
      <a href="/" class="brand">GitHub Stats API</a>
      <nav class="nav-links">
        <a href="#studio">Studio</a>
        <a href="#api-reference">API Reference</a>
        <a href="/docs">Plain Docs</a>
        <a href="/health">Health</a>
      </nav>
      <button id="topCopyBtn" class="btn-primary" type="button">Copy Markdown</button>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <h1>GitHub Stats Card Studio</h1>
      <p>Generate non-overlapping, high-contrast SVG telemetry cards with automatic AI and engineering stack detection for your GitHub README.</p>
    </section>

    <section id="studio" class="workspace">
      <form id="configForm" class="panel">
        <h2 class="panel-title">Card Configuration</h2>

        <div class="field">
          <label class="field-label" for="usernameInput">GitHub Username</label>
          <input id="usernameInput" class="input" type="text" value="salekmasudparvez1" placeholder="e.g. salekmasudparvez1" required />
          <div class="preset-row">
            <button type="button" class="preset-btn active" data-user="salekmasudparvez1">salekmasudparvez1</button>
            <button type="button" class="preset-btn" data-user="karpathy">karpathy</button>
            <button type="button" class="preset-btn" data-user="hwchase17">hwchase17</button>
            <button type="button" class="preset-btn" data-user="octocat">octocat</button>
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="roleInput">Role Subtitle (optional)</label>
          <input id="roleInput" class="input" type="text" value="AI &amp; ML Engineer" placeholder="Auto-detected from GitHub profile" />
        </div>

        <div class="field">
          <label class="field-label" for="themeSelect">Color Theme</label>
          <select id="themeSelect" class="select">
            <option value="neural" selected>Neural (AI Slate + Emerald)</option>
            <option value="dark">Dark (GitHub Classic)</option>
            <option value="ocean">Ocean (Deep Blue)</option>
            <option value="midnight">Midnight (Carbon + Crimson)</option>
            <option value="light">Light (Paper White)</option>
          </select>
        </div>

        <div class="field">
          <span class="field-label">Card Surface</span>
          <div class="segmented" id="variantGroup">
            <button type="button" class="seg-btn active" data-variant="modern">Modern</button>
            <button type="button" class="seg-btn" data-variant="glass">Glass</button>
            <button type="button" class="seg-btn" data-variant="minimal">Minimal</button>
          </div>
        </div>

        <div class="field">
          <span class="field-label">Animations</span>
          <div class="segmented segmented-2" id="animateGroup">
            <button type="button" class="seg-btn active" data-animate="true">Enabled</button>
            <button type="button" class="seg-btn" data-animate="false">Static</button>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Render Card</button>
          <button type="button" id="openSvgBtn" class="btn-secondary">Open SVG</button>
        </div>
      </form>

      <div class="panel">
        <div class="preview-header">
          <div>
            <h2 class="panel-title" style="margin-bottom: 2px;">Live SVG Preview</h2>
            <div id="previewMeta" class="preview-meta">880 × 400 · image/svg+xml</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" id="copyHtmlBtn" class="btn-secondary">Copy HTML</button>
            <button type="button" id="downloadSvgBtn" class="btn-secondary">Download SVG</button>
          </div>
        </div>

        <div class="preview-stage" id="previewStage">
          <div class="loading-skeleton" id="skeleton"></div>
          <img id="cardImg" alt="GitHub Stats SVG Preview" style="display: none;" />
        </div>

        <div id="errorBanner" class="error-banner"></div>

        <div class="kpi-strip">
          <div class="kpi-cell">
            <div class="kpi-cell-label">Repositories</div>
            <div class="kpi-cell-val" id="kpiRepos">—</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-cell-label">Total Stars</div>
            <div class="kpi-cell-val" id="kpiStars">—</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-cell-label">Total Commits</div>
            <div class="kpi-cell-val" id="kpiCommits">—</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-cell-label">Detected Stack</div>
            <div class="kpi-cell-val" id="kpiStack" style="font-size: 13px; line-height: 28px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">—</div>
          </div>
        </div>

        <div class="embed-box">
          <div class="embed-row">
            <span class="field-label" style="margin: 0;">README Markdown Embed</span>
            <button type="button" id="copyMdBtn" class="btn-secondary" style="padding: 5px 10px; font-size: 12px;">Copy</button>
          </div>
          <div class="code-block" id="markdownCode"></div>
        </div>
      </div>
    </section>

    <section id="api-reference" class="docs-section">
      <h2>API Reference — GET /api/stats</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Required</th>
              <th>Default</th>
              <th>Values &amp; Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>username</code></td>
              <td>Yes</td>
              <td>—</td>
              <td>Valid GitHub handle (e.g. <code>salekmasudparvez1</code>)</td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td>No</td>
              <td><code>dark</code></td>
              <td><code>neural</code> | <code>dark</code> | <code>ocean</code> | <code>midnight</code> | <code>light</code></td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td>No</td>
              <td><code>modern</code></td>
              <td><code>modern</code> | <code>glass</code> | <code>minimal</code></td>
            </tr>
            <tr>
              <td><code>role</code></td>
              <td>No</td>
              <td>Auto-inferred</td>
              <td>Custom role subtitle (e.g. <code>AI &amp; ML Engineer</code>)</td>
            </tr>
            <tr>
              <td><code>animate</code></td>
              <td>No</td>
              <td><code>true</code></td>
              <td><code>true</code> | <code>false</code> (respects <code>prefers-reduced-motion</code>)</td>
            </tr>
            <tr>
              <td><code>format</code></td>
              <td>No</td>
              <td><code>svg</code></td>
              <td><code>svg</code> (image/svg+xml) | <code>json</code> (raw metrics payload)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <script>
    (function () {
      const form = document.getElementById('configForm');
      const usernameInput = document.getElementById('usernameInput');
      const roleInput = document.getElementById('roleInput');
      const themeSelect = document.getElementById('themeSelect');
      const cardImg = document.getElementById('cardImg');
      const skeleton = document.getElementById('skeleton');
      const errorBanner = document.getElementById('errorBanner');
      const markdownCode = document.getElementById('markdownCode');
      const previewMeta = document.getElementById('previewMeta');

      const kpiRepos = document.getElementById('kpiRepos');
      const kpiStars = document.getElementById('kpiStars');
      const kpiCommits = document.getElementById('kpiCommits');
      const kpiStack = document.getElementById('kpiStack');

      let currentVariant = 'modern';
      let currentAnimate = 'true';

      function buildQueryPath(format) {
        const params = new URLSearchParams();
        params.set('username', (usernameInput.value || 'octocat').trim());
        params.set('theme', themeSelect.value);
        params.set('variant', currentVariant);
        params.set('animate', currentAnimate);
        const role = roleInput.value.trim();
        if (role) params.set('role', role);
        if (format) params.set('format', format);
        return '/api/stats?' + params.toString();
      }

      function updateMarkdown() {
        const url = window.location.origin + buildQueryPath();
        const user = (usernameInput.value || 'octocat').trim();
        markdownCode.textContent = '![GitHub Stats](' + url + ')';
        previewMeta.textContent = '880 × 400 · ' + themeSelect.value + ' · ' + currentVariant + ' · @' + user;
      }

      async function loadPreview() {
        const user = usernameInput.value.trim();
        if (!user) return;

        updateMarkdown();
        errorBanner.style.display = 'none';
        skeleton.style.display = 'block';
        cardImg.style.display = 'none';

        const svgPath = buildQueryPath();
        const jsonPath = buildQueryPath('json');

        cardImg.onload = function () {
          skeleton.style.display = 'none';
          cardImg.style.display = 'block';
        };
        cardImg.onerror = function () {
          skeleton.style.display = 'none';
          errorBanner.textContent = 'Unable to load SVG card for "' + user + '".';
          errorBanner.style.display = 'block';
        };
        cardImg.src = svgPath;

        try {
          const res = await fetch(jsonPath);
          const data = await res.json();
          if (!res.ok) {
            errorBanner.textContent = data.error || 'GitHub API error (' + res.status + ')';
            errorBanner.style.display = 'block';
            kpiRepos.textContent = '—';
            kpiStars.textContent = '—';
            kpiCommits.textContent = '—';
            kpiStack.textContent = '—';
            return;
          }
          kpiRepos.textContent = Number(data.totalRepos || 0).toLocaleString();
          kpiStars.textContent = Number(data.totalStars || 0).toLocaleString();
          kpiCommits.textContent = Number(data.totalCommits || 0).toLocaleString();
          kpiStack.textContent = (data.aiStack && data.aiStack.length)
            ? data.aiStack.slice(0, 3).join(' · ')
            : (data.topLanguages || []).slice(0, 3).map(function (l) { return l.name; }).join(' · ') || '—';
        } catch (err) {
          errorBanner.textContent = 'Network error fetching GitHub metrics.';
          errorBanner.style.display = 'block';
        }
      }

      document.querySelectorAll('.preset-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          document.querySelectorAll('.preset-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          usernameInput.value = btn.getAttribute('data-user');
          loadPreview();
        });
      });

      document.querySelectorAll('#variantGroup .seg-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          document.querySelectorAll('#variantGroup .seg-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentVariant = btn.getAttribute('data-variant');
          loadPreview();
        });
      });

      document.querySelectorAll('#animateGroup .seg-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          document.querySelectorAll('#animateGroup .seg-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentAnimate = btn.getAttribute('data-animate');
          loadPreview();
        });
      });

      themeSelect.addEventListener('change', loadPreview);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        loadPreview();
      });

      function copyWithFeedback(btn, text) {
        navigator.clipboard.writeText(text).then(function () {
          const orig = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = orig; }, 1400);
        });
      }

      document.getElementById('copyMdBtn').addEventListener('click', function () {
        copyWithFeedback(this, markdownCode.textContent);
      });

      document.getElementById('topCopyBtn').addEventListener('click', function () {
        copyWithFeedback(this, markdownCode.textContent);
      });

      document.getElementById('copyHtmlBtn').addEventListener('click', function () {
        const url = window.location.origin + buildQueryPath();
        const user = (usernameInput.value || 'octocat').trim();
        copyWithFeedback(this, '<img src="' + url + '" alt="GitHub Stats for ' + user + '" />');
      });

      document.getElementById('openSvgBtn').addEventListener('click', function () {
        window.location.href = buildQueryPath();
      });

      document.getElementById('downloadSvgBtn').addEventListener('click', async function () {
        const res = await fetch(buildQueryPath());
        const svg = await res.text();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (usernameInput.value.trim() || 'github') + '-stats.svg';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });

      loadPreview();
    })();
  </script>
</body>
</html>`;
}
