import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  // Must match `basename` in react-router.config.ts: this prefixes asset URLs.
  base: "/quiet-on-set/",
  plugins: [
    tailwindcss(),
    {
      // Page bodies in app/content/*.mdx. Code blocks are highlighted here, at
      // build time, so no highlighter ships to the browser.
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [
            rehypeShiki,
            { themes: { light: "github-light", dark: "github-dark" }, defaultColor: false },
          ],
        ],
      }),
    },
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
    // tsconfigPaths only applies to TS/JS importers; .mdx files need the alias too.
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
});
