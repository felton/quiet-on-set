# quiet on set

A quiet, ready-to-shoot Vite starter: React Router, shadcn/ui, Tailwind. Places, everyone.

**Docs and live demo: [felton.github.io/quiet-on-set](https://felton.github.io/quiet-on-set/)**. The docs site is itself built with this template.

The setup work is already done (routing, styling, components, formatting, CI), so you or a coding agent can start building the actual site straight away.

## What's on set

- **React Router v8** in framework mode: server rendering, SPA or pre-rendered builds, typed routes
- **Tailwind CSS v4** and **shadcn/ui** on the [Base UI](https://base-ui.com) variant
- **TypeScript**, **oxfmt**, **oxlint**, **Vitest** and **Testing Library**
- **Dark mode** with a Light / Dark / System menu, no provider needed
- **`UnsplashPicture`**, a responsive `<picture>` with art-directed crops per breakpoint
- **GitHub Actions** for CI, release-please and grouped Dependabot updates
- **`AGENTS.md`** plus the official React Router and shadcn/ui agent skills

**Good for** marketing sites, docs, dashboards and small apps. **Not for** projects that need Next.js or Astro, the Radix flavor of shadcn/ui, or a package manager other than pnpm.

## Quick start

<!-- x-release-please-start-version -->

```bash
npx degit felton/quiet-on-set#v1.0.1 my-app
cd my-app
pnpm install
pnpm dev
```

<!-- x-release-please-end -->

This copies one release with no git history. Other versions are on the [Releases](../../releases) page. You can also click **Use this template**, or run `gh repo create my-app --template felton/quiet-on-set --private --clone`.

**With a coding agent:** give it the degit command and a brief for the site. `AGENTS.md`, which `CLAUDE.md` imports, tells it the commands, layout and conventions.

## Scripts

| Command            | What it does                                   |
| ------------------ | ---------------------------------------------- |
| `pnpm dev`         | Dev server at `http://localhost:5173`          |
| `pnpm build`       | Production build to `build/` (Node server)     |
| `pnpm start`       | Serve the production build                     |
| `pnpm build:spa`   | Static SPA build to `build/client`, no server  |
| `pnpm preview:spa` | Serve the SPA build at `http://localhost:4173` |
| `pnpm fmt`         | Format everything                              |
| `pnpm test`        | Run the tests once (`pnpm vitest` to watch)    |
| `pnpm check`       | Format check, lint, typecheck and tests        |
| `pnpm typecheck`   | Generate route types and run `tsc`             |
| `pnpm favicon`     | Rebuild `public/favicon.ico` from its SVG      |

`pnpm check` is the same command CI runs.

## Making it yours

1. Rename the project in `package.json` and update the brand in `app/welcome/welcome.tsx`.
2. Reset versioning: set `version` in `package.json` to your starting point (for example `0.1.0`) and delete `CHANGELOG.md`. Your copy has none of the template's tags, so release-please starts fresh.
3. Swap the hero image and its photographer credit.
4. Add routes in `app/routes/` (register them in `app/routes.ts`) and components with `pnpm dlx shadcn@latest add <component>`.
5. Replace the favicon. Edit `assets/favicon-tile.svg`, then run `pnpm favicon`.

For automated releases, turn on **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**. Use [Conventional Commits](https://www.conventionalcommits.org/) and squash-merge PRs with a conventional title: `feat:` and `fix:` commits open a release PR, and merging it tags and publishes the release. If you don't want this, delete `.github/workflows/release-please.yml`.

## Testing

Tests sit next to the code as `*.test.ts(x)` files under `app/` and run in jsdom. `app/routes/home.test.tsx` is the pattern to copy: it renders the route inside `createRoutesStub`, because `<Link>` needs a router.

## Environment variables

Copy `.env.example` to `.env` (gitignored). `SPA=true` makes every command build a static SPA. `VITE_*` variables are exposed to browser code, so never put secrets in them.

## Going deeper

| Page                                                                 | Covers                                              |
| -------------------------------------------------------------------- | --------------------------------------------------- |
| [Call Sheet](https://felton.github.io/quiet-on-set/docs/call-sheet/) | Getting started, scripts, agents                    |
| [Blocking](https://felton.github.io/quiet-on-set/docs/blocking/)     | Project structure, routes, layouts, rendering modes |
| [Props](https://felton.github.io/quiet-on-set/docs/props/)           | Every shipped component, live, with source          |
| [Wardrobe](https://felton.github.io/quiet-on-set/docs/wardrobe/)     | Theme tokens, dark mode, fonts, hero, favicon       |
| [Wrap](https://felton.github.io/quiet-on-set/docs/wrap/)             | Building, static hosting, GitHub Pages, FAQ         |

---

Hero photo by [stefano stacchini](https://unsplash.com/@stak59) on [Unsplash](https://unsplash.com).
