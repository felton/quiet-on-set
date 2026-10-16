import type { Config } from "@react-router/dev/config";

// Static, pre-rendered build for GitHub Pages, served under /quiet-on-set/.
// Pre-rendered pages land in build/client/quiet-on-set/; scripts/flatten-prerender.mjs
// moves them up next to the assets after the build.
export default {
  ssr: false,
  prerender: true,
  basename: "/quiet-on-set/",
} satisfies Config;
