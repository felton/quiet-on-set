// With a `basename`, React Router writes pre-rendered pages to
// build/client/<basename>/… while assets stay in build/client/assets/.
// GitHub Pages serves build/client at /<repo>/, so move the pages up a level.
// https://github.com/remix-run/react-router/issues/14587
import { cp, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const client = path.resolve("build/client");
const nested = path.join(client, "quiet-on-set");

try {
  await stat(nested);
} catch {
  console.error(`flatten-prerender: ${nested} not found; nothing to move.`);
  process.exit(1);
}

// React Router renames the SPA fallback to build/client/index.html because no
// page exists there yet. Keep it as 404.html (Pages serves that for unknown URLs;
// it hydrates and shows the root ErrorBoundary), then move the pages up.
await rename(path.join(client, "index.html"), path.join(client, "404.html"));
await cp(nested, client, { recursive: true });
await rm(nested, { recursive: true });
console.log("flatten-prerender: moved pages into build/client and wrote 404.html");
