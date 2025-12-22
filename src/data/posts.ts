export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  code: string;
};

export const posts: Post[] = [
  {
    slug: "astro-react-bridge",
    title: "Astro + React 19 开篇",
    description: "使用 Astro 作为壳、React 19 作为交互层，快速把博客搬到岛屿架构。",
    date: "2024-06-02",
    tags: ["astro", "react19", "stylex"],
    content: `
让页面保持 **静态生成** 的同时，用 React 19 的 Islands 来兜住交互。

- 在 \`src/pages/index.astro\` 用 Astro 组织页面。
- 用 \`client:load\` 或 \`client:idle\` 将 React 组件挂载。
- 样式采用 \`stylex\` 原子化，保持 bundle 极小。
    `,
    code: `
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  badge: { padding: 8, borderRadius: 12, backgroundColor: "#111827", color: "#fff" },
});

export function Badge({ label }) {
  return <span {...stylex.props(styles.badge)}>{label}</span>;
}
    `.trim(),
  },
  {
    slug: "remark-pipeline",
    title: "Remark 渲染 Markdown",
    description: "把 Markdown 文稿在构建时转成 HTML，配合代码高亮输出优雅的正文。",
    date: "2024-06-05",
    tags: ["remark", "highlight.js"],
    content: `
利用 remark + remark-html 可在构建阶段把 Markdown 转成 HTML 字符串，然后在 React 组件中安全输出。

> 代码块走 highlight.js 的语法高亮，样式选一套喜欢的主题即可。
    `,
    code: `
import { remark } from "remark";
import html from "remark-html";

export async function renderMarkdown(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
    `.trim(),
  },
  {
    slug: "pagefind-setup",
    title: "Pagefind 无服务端搜索",
    description: "零后端的全文检索：构建后在 dist 上跑 Pagefind，然后把 UI 组件挂上。",
    date: "2024-06-10",
    tags: ["pagefind", "search"],
    content: `
Pagefind 会扫构建产物并生成 WebAssembly 索引。部署时只要把 \`/pagefind\` 目录一起上传，前端即可直接查询。

提示：\`npm run build && npm run pagefind\` 生成索引；前端用默认 UI 组件挂在搜索框位置。
    `,
    code: `
// package.json
"scripts": {
  "build": "astro build",
  "pagefind": "pagefind --source ./dist"
}
    `.trim(),
  },
];
