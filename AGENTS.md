# quiet-on-set docs

**This is the `docs` branch: the docs site, not the template.** It's a quiet-on-set project, pre-rendered and deployed to GitHub Pages at https://felton.github.io/quiet-on-set/ by `.github/workflows/docs.yml`. Template changes belong on `main`.

## Docs-site rules

- `app/components/ui/` is vendored from the template release in `TEMPLATE_VERSION`. Don't edit the template's components here: change them on `main`, release, bump `TEMPLATE_VERSION`, run `pnpm sync:template` on a clean tree. It also three-way merges the template's changes into the customized files listed in `merged` in `scripts/sync-template.mjs` (resolve any conflicts it reports) and matches shared dependency versions. Components added only for the docs are listed in `docsOnly` in `scripts/sync-template.mjs`; add new ones there.
- Never hard-code a template release in `app/content`: write `v__TEMPLATE_VERSION__`, which the MDX build fills in from `TEMPLATE_VERSION`. A test enforces this.
- Page bodies are MDX in `app/content/`. `app/content/nav.ts` is the page list (sidebar, prev/next, edit links); add a page there and in `app/routes.ts`.
- The site is served under `/quiet-on-set/`. Link with `<Link>` (or root-relative Markdown links, which MDX maps to `<Link>`), never a hard-coded `href="/..."`.
- `pnpm build` runs `scripts/flatten-prerender.mjs` after React Router: it moves pages out of `build/client/quiet-on-set/` and writes `404.html`.
- No actions or runtime loaders: loaders run once at build time.
- Docs pages set their page tags with `docMeta()` from `app/content/nav.ts` in a `meta` export. Keep that here, even though the template notes below prefer `<title>` elements: the site-wide tags are in `root.tsx`, so nothing is lost.
- `app/lib/site.ts` is this site's own, not synced from the template. `scripts/flatten-prerender.mjs` reads the subpath from `site.url`.

The template's own notes follow, as of the release in `TEMPLATE_VERSION`.

Vite starter: React Router (framework mode), Tailwind CSS v4, shadcn/ui on **Base UI**, TypeScript. Package manager: **pnpm**.

## Commands

| Command          | What it does                         |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Dev server                           |
| `pnpm build`     | Production build                     |
| `pnpm fmt`       | Format files in place (oxfmt)        |
| `pnpm check`     | Format check, lint, typecheck, tests |
| `pnpm typecheck` | Generate route types and run `tsc`   |

**Run `pnpm check` before you consider a task done. It must pass.** CI runs the same command.

## Layout

- `app/root.tsx`: document shell, `<Meta>`/`<Links>`, error boundary
- `app/routes.ts`: route config. New routes must be registered here.
- `app/routes/`: route modules
- `app/components/ui/`: shadcn components. Add with the CLI; avoid hand-editing.
- `app/components/image/unsplash-picture.tsx`: responsive Unsplash images
- `app/lib/site.ts`: site name, description, public URL and social image
- `~/` is an alias for `app/`

## Already set up

Don't reinstall, reconfigure or replace these:

- Route type generation before `tsc` (`pnpm typecheck`)
- A separate `vitest.config.ts`, because the React Router Vite plugin doesn't run under Vitest
- shadcn/ui on Base UI, with components in `app/components/ui/`
- Dark mode that never flashes the wrong theme
- Formatting, linting, typecheck, tests and CI behind one command: `pnpm check`
- A root error boundary that renders 404s in server and SPA builds
- Site-wide head tags, and the subpath for routes and assets, both driven by `app/lib/site.ts`
- Releases with release-please

## Skills

- `.agents/skills/react-router/` is React Router's official agent skill: mode-specific guidance and references. Read its `SKILL.md` before changing routes, loaders/actions, data loading, or SSR/SPA/pre-render settings. This app uses **Framework mode**.
- `.agents/skills/shadcn/` is shadcn/ui's official agent skill. Read its `SKILL.md` before adding, composing or restyling components. This project uses the **Base UI** variant (`base-lyra` style in `components.json`).
- Both are symlinked into `.claude/skills/` so Claude Code loads them automatically.

## Conventions

**shadcn/ui is the Base UI variant.** Compose custom elements with the `render` prop. Never use `asChild`; it does not exist here.

```tsx
<NavigationMenuLink render={<Link to="/about" />}>About</NavigationMenuLink>
```

- Add components with `pnpm dlx shadcn@latest add <name>`.
- Route modules type their loaders, actions and meta with `import type { Route } from "./+types/<file>"`. If the import is missing, run `pnpm typecheck` to generate it.
- Use Tailwind theme tokens (`bg-background`, `text-muted-foreground`, `border`, `bg-muted`) instead of raw palette colors. They handle dark mode, so color `dark:` variants are rarely needed.
- Dark mode is the `dark` class on `<html>`, set before paint by `themeScript` in `app/lib/theme.ts`. There is no theme provider or React state: style with `dark:` variants, and switch with `setTheme("light" | "dark" | "system")`. `<ThemeToggle />` in the header is a Light / Dark / System menu.
- Images from Unsplash use `UnsplashPicture`. Pass the `photoId` path segment from the URL. Set `breakpoints` so the largest `width` matches the largest size the image actually renders. Use `priority` only for above-the-fold images. Credit the photographer in a caption.

## Site and head tags

- `app/lib/site.ts` holds facts about the site, with no functions. Fill in `name` and `description` from the brief.
- `url` is the full public address, including any subpath (`https://you.github.io/repo`). If the brief doesn't give one, leave it empty: the site serves from `/` and skips tags that need an absolute address. Never use `localhost`.
- The path in `url` sets `basename` in `react-router.config.ts` and `base` in `vite.config.ts`. Don't set them by hand.
- Site-wide tags (site name, social image, canonical link) are in `app/root.tsx`. Don't repeat them in routes.
- Page tags go in the route component as React `<title>` and `<meta>` elements, not in a `meta` export. Use `meta` only when tags come from `loaderData`.
- One social image per site: a file in `public/`, named in `site.image`.

## Testing

Tests sit next to the code as `*.test.ts(x)` and run in jsdom with Testing Library. Copy `app/routes/home.test.tsx`: render route components inside `createRoutesStub`, because `<Link>` needs a router.

## Environment variables

Copy `.env.example` to `.env`. `SPA=true` builds a static single-page app instead of the Node server. `VITE_*` variables are bundled into browser code, so never put secrets in them.

## Deploying

- `pnpm build` makes the Node server build (`pnpm start`, or the `Dockerfile`). `pnpm build:spa` makes a static build in `build/client`.
- GitHub Pages: follow [Wrap → GitHub Pages](https://felton.github.io/quiet-on-set/docs/wrap/#github-pages). Set `site.url` instead of editing `basename` and `base`. The flatten script is [`scripts/flatten-prerender.mjs`](https://github.com/felton/quiet-on-set/blob/docs/scripts/flatten-prerender.mjs).

## Working from a brief

- If `scripts/make-it-yours.mjs` exists, this is a fresh copy of the template: run `pnpm make-it-yours --name "…" --description "…" --yes` first (add `--url` if the brief gives a public address).
- Data, auth and storage aren't included. Choose them to the brief's spec, using the React Router skill for loaders, actions, sessions and forms.
- One check-in with the engineer is fine. If the brief leaves out both a data, auth or storage choice and a public address, ask about the data, auth or storage choice. `site.url` can stay empty.

## Commits and releases

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. release-please derives versions and the changelog from them.
- Do not edit `CHANGELOG.md` or the `version` in `package.json` by hand. The one exception is setting up a new project from this template, which `pnpm make-it-yours` does.
