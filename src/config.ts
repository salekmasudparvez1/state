export interface ThemePalette {
  bg: string;
  cardBg: string;
  border: string;
  divider: string;
  text: string;
  textMuted: string;
  title: string;
  accent: string;
  success: string;
  warning: string;
  isLight?: boolean;
}

export const themes: Record<string, ThemePalette> = {
  dark: {
    bg: "#0d1117",
    cardBg: "#161b22",
    border: "#30363d",
    divider: "#21262d",
    text: "#e6edf3",
    textMuted: "#8b949e",
    title: "#58a6ff",
    accent: "#2f81f7",
    success: "#3fb950",
    warning: "#d29922",
  },
  neural: {
    bg: "#090d16",
    cardBg: "#111827",
    border: "#1f2937",
    divider: "#1e293b",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    title: "#38bdf8",
    accent: "#10b981",
    success: "#34d399",
    warning: "#f59e0b",
  },
  ocean: {
    bg: "#0f172a",
    cardBg: "#1e293b",
    border: "#334155",
    divider: "#1e293b",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    title: "#38bdf8",
    accent: "#0ea5e9",
    success: "#22c55e",
    warning: "#eab308",
  },
  midnight: {
    bg: "#0a0a0c",
    cardBg: "#141418",
    border: "#27272a",
    divider: "#1f1f23",
    text: "#f4f4f5",
    textMuted: "#a1a1aa",
    title: "#38bdf8",
    accent: "#f43f5e",
    success: "#10b981",
    warning: "#f59e0b",
  },
  light: {
    bg: "#ffffff",
    cardBg: "#f8fafc",
    border: "#e2e8f0",
    divider: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
    title: "#0369a1",
    accent: "#0284c7",
    success: "#16a34a",
    warning: "#d97706",
    isLight: true,
  },
};

export const langColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "Jupyter Notebook": "#DA5B0B",
  CUDA: "#3A4E3A",
  Rust: "#dea584",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#FF5D01",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  R: "#198CE7",
  Scala: "#c22d40",
  Dart: "#00B4AB",
  Lua: "#000080",
  MDX: "#fcb32c",
  Mojo: "#ff4c1f",
};

export const AI_KEYWORD_LABELS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bpytorch\b|\btorch\b/i, label: "PyTorch" },
  { pattern: /\btensorflow\b|\bkeras\b/i, label: "TensorFlow" },
  { pattern: /\bjax\b|\bflax\b/i, label: "JAX" },
  { pattern: /\btransformers\b|\bhuggingface\b|\bhf\b/i, label: "Transformers" },
  { pattern: /\blangchain\b|\blanggraph\b/i, label: "LangChain" },
  { pattern: /\bllamaindex\b/i, label: "LlamaIndex" },
  { pattern: /\bopenai\b|\bgpt\b/i, label: "OpenAI" },
  { pattern: /\bgemini\b|\bgenai\b/i, label: "Gemini" },
  { pattern: /\banthropic\b|\bclaude\b/i, label: "Claude" },
  { pattern: /\bvllm\b|\bollama\b|\bllama\.cpp\b/i, label: "LLM Serving" },
  { pattern: /\brag\b|\bvector\b|\bembedding/i, label: "RAG" },
  { pattern: /\bagent|\bmcp\b|\bmulti-agent/i, label: "AI Agents" },
  { pattern: /\bcuda\b|\btriton\b|\bonnx\b|\btensorrt\b/i, label: "CUDA/ONNX" },
  { pattern: /\bfastapi\b/i, label: "FastAPI" },
  { pattern: /\bdocker\b|\bkubernetes\b|\bk8s\b/i, label: "Docker/K8s" },
  { pattern: /\bscikit-learn\b|\bsklearn\b|\bxgboost\b/i, label: "Scikit-Learn" },
  { pattern: /\bmlops\b|\bmlflow\b|\bwandb\b/i, label: "MLOps" },
  { pattern: /\bnext\.?js\b|\breact\b/i, label: "Next.js/React" },
];
