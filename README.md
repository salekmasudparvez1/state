<div align="center">

# ⚡ GitHub Stats API

**A blazing-fast, self-hosted GitHub stats card generator — built by [Salek Masud Parvez](https://github.com/salekmasudparvez1)**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-58a6ff?style=flat-square)](LICENSE)

---

![GitHub Stats](http://localhost:3000/api/stats?username=salekmasudparvez1&theme=dark&animate=true)

</div>

---

## ✨ Features

- 📊 **Real-time stats** — repos, stars, forks, commits
- 🎨 **3 beautiful themes** — `dark`, `ocean`, `midnight`
- 💫 **Smooth animations** — staggered fade & grow effects
- 🌐 **Full-width SVG** — scales perfectly in any README
- 🔤 **Top languages** — with color-coded progress bars
- ⚡ **Zero dependencies** at runtime — pure Node.js `http`

---

## 🚀 Quick Start

**1. Clone & install**

```bash
git clone https://github.com/salekmasudparvez1/github-stats-api.git
cd github-stats-api
npm install
```

**2. Run locally**

```bash
npm run dev
```

**3. Open in browser**

```
http://localhost:3000/api/stats?username=salekmasudparvez1
```

---

## 📌 API Reference

### `GET /api/stats`

| Parameter  | Required | Default | Description                          |
|------------|----------|---------|--------------------------------------|
| `username` | ✅ Yes   | —       | GitHub username                      |
| `theme`    | ❌ No    | `dark`  | `dark` \| `ocean` \| `midnight`      |
| `animate`  | ❌ No    | `true`  | `true` \| `false`                    |

### Other Endpoints

| Endpoint   | Description              |
|------------|--------------------------|
| `GET /`    | API documentation        |
| `GET /health` | Health check JSON     |

---

## 🎨 Themes

### Dark *(default)*
```
?theme=dark
```
![dark](http://localhost:3000/api/stats?username=salekmasudparvez1&theme=dark)

### Ocean
```
?theme=ocean
```
![ocean](http://localhost:3000/api/stats?username=salekmasudparvez1&theme=ocean)

### Midnight
```
?theme=midnight
```
![midnight](http://localhost:3000/api/stats?username=salekmasudparvez1&theme=midnight)

---

## 💡 Embed in Your README

```markdown
![GitHub Stats](https://your-deployed-url.com/api/stats?username=YOUR_USERNAME&theme=dark)
```

With a link:

```markdown
[![GitHub Stats](https://your-deployed-url.com/api/stats?username=YOUR_USERNAME)](https://github.com/YOUR_USERNAME)
```

---

## 🗂️ Project Structure

```
src/
├── index.ts      — Server bootstrap & entry point
├── router.ts     — URL routing & request handling
├── github.ts     — GitHub API data fetching
├── svg.ts        — SVG card generator
├── config.ts     — Themes & language colors
├── utils.ts      — Helper functions
└── types.ts      — TypeScript interfaces & types
```

---

## 🛠️ Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Runtime     | Node.js 24.x                |
| Language    | TypeScript 5.x              |
| HTTP Server | Node.js built-in `http`     |
| Data Source | GitHub REST API v3          |
| Output      | Inline SVG (fully animated) |

---

## 📦 Environment Variables

| Variable | Default | Description       |
|----------|---------|-------------------|
| `PORT`   | `3000`  | Server listen port |

---

## 👤 Author

**Salek Masud Parvez**
- GitHub: [@salekmasudparvez1](https://github.com/salekmasudparvez1)
- Full Stack Web Developer

---

## 📄 License

MIT © [Salek Masud Parvez](https://github.com/salekmasudparvez1)

