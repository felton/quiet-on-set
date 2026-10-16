import type { Config } from "@react-router/dev/config";

// Static, pre-rendered build for GitHub Pages, served under /quiet-on-set/.
// Pre-rendered pages land in build/client/quiet-on-set/; scripts/flatten-prerender.mjs
// moves them up next to the assets after the build.
export default {
  ssr: false,
  // Every static path, plus /404: it matches the catch-all route and becomes 404.html.
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), "/404"];
  },
  basename: "/quiet-on-set/",
} satisfies Config;
