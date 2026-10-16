// Bring the docs site up to the template release in TEMPLATE_VERSION:
//   1. re-copy the template's UI components, theme and Node version from the tag
//   2. record which components that release ships (app/content/shipped-components.txt)
//   3. match the version range of every dependency both projects use, and let
//      pnpm update the lockfile rather than merging main's
// Run after bumping TEMPLATE_VERSION, review the diff, then commit.
// docs is an orphan branch, so this works from the tag by path, never by merging main.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const tag = `v${readFileSync("TEMPLATE_VERSION", "utf8").trim()}`;
const ui = "app/components/ui";

// Components the docs site adds on top of the template. Sync leaves them alone.
const docsOnly = new Set([
  "accordion",
  "alert",
  "badge",
  "breadcrumb",
  "card",
  "input",
  "sheet",
  "sidebar",
  "skeleton",
  "switch",
  "table",
  "tabs",
  "tooltip",
]);

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });

git("fetch", "--tags", "--quiet");

// 1. `git checkout <tag> -- <paths>` overlays: it updates files the tag has and
// leaves the docs-only components in place (`git restore --source` would delete them).
git(
  "checkout",
  tag,
  "--",
  ui,
  "app/app.css",
  "app/lib/theme.ts",
  "app/components/theme-toggle.tsx",
  ".nvmrc",
);

// 2. The Props page shows exactly these.
const shipped = git("ls-tree", "--name-only", tag, `${ui}/`)
  .split("\n")
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.slice(ui.length + 1, -".tsx".length));
writeFileSync("app/content/shipped-components.txt", shipped.join("\n") + "\n");

// 3. Dependencies. Copy the template's version range for every package both
// projects use, then let `pnpm install` update the lockfile (no lockfile merging).
// Docs-only packages (MDX, Shiki, rehype…) aren't in the template, so they're
// never touched, and each package stays in its section on this branch.
const template = JSON.parse(git("show", `${tag}:package.json`));
const ours = JSON.parse(readFileSync("package.json", "utf8"));
const wanted = { ...template.dependencies, ...template.devDependencies };
let changed = false;

for (const section of ["dependencies", "devDependencies"]) {
  for (const [name, current] of Object.entries(ours[section] ?? {})) {
    if (name in wanted && wanted[name] !== current) {
      console.log(`${name} ${current} -> ${wanted[name]}`);
      ours[section][name] = wanted[name];
      changed = true;
    }
  }
}
if (template.packageManager && template.packageManager !== ours.packageManager) {
  console.log(`packageManager ${ours.packageManager} -> ${template.packageManager}`);
  ours.packageManager = template.packageManager;
  changed = true;
}
if (changed) {
  writeFileSync("package.json", JSON.stringify(ours, null, 2) + "\n");
  execFileSync("pnpm", ["install"], { stdio: "inherit" });
}

// Flag files the tag doesn't have and that aren't docs-only: most likely a
// component the template removed.
const stale = readdirSync(ui)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.slice(0, -".tsx".length))
  .filter((name) => !shipped.includes(name) && !docsOnly.has(name));

console.log(`Synced ${ui}, theme and dependencies from ${tag}.`);
if (stale.length) {
  console.error(
    `Not in ${tag} and not docs-only (delete, or add to docsOnly):\n  ${stale.map((n) => `${ui}/${n}.tsx`).join("\n  ")}`,
  );
  process.exit(1);
}
