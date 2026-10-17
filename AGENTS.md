# quiet-on-set docs

**This is the `docs` branch: the docs site, not the template.** It's a quiet-on-set project, pre-rendered and deployed to GitHub Pages at https://felton.github.io/quiet-on-set/ by `.github/workflows/docs.yml`. Template changes belong on `main`.

## Docs-site rules

- `app/components/ui/` is vendored from the template release in `TEMPLATE_VERSION`. Don't edit the template's components here: change them on `main`, release, bump `TEMPLATE_VERSION`, run `pnpm sync:template` (it also matches shared dependency versions). Components added only for the docs are listed in `docsOnly` in `scripts/sync-template.mjs`; add new ones there.
- Never hard-code a template release in `app/content`: write `v__TEMPLATE_VERSION__`, which the MDX build fills in from `TEMPLATE_VERSION`. A test enforces this.
- Page bodies are MDX in `app/content/`. `app/content/nav.ts` is the page list (sidebar, prev/next, edit links); add a page there and in `app/routes.ts`.
- The site is served under `/quiet-on-set/`. Link with `<Link>` (or root-relative Markdown links, which MDX maps to `<Link>`), never a hard-coded `href="/..."`.
- `pnpm build` runs `scripts/flatten-prerender.mjs` after React Router: it moves pages out of `build/client/quiet-on-set/` and writes `404.html`.
- No actions or runtime loaders: loaders run once at build time.

The template's own notes follow.

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
- `~/` is an alias for `app/`

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

## Commits and releases

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. release-please derives versions and the changelog from them.
- Do not edit `CHANGELOG.md` or the `version` in `package.json` by hand. The one exception is setting up a new project from this template: reset `version` and delete the template's `CHANGELOG.md` (README, "Making it yours").
