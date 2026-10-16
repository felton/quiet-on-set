import type { Config } from "@react-router/dev/config";

// Server-rendered by default. `pnpm build:spa` sets SPA=true to build a static
// single-page app instead: build/client/index.html, no Node server needed.
const spa = process.env.SPA === "true";

export default {
  ssr: !spa,
} satisfies Config;
