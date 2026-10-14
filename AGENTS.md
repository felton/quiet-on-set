# quiet-on-set

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

- `.agents/skills/react-router/` is React Router's official agent skill: mode-specific guidance and references. Read its `SKILL.md` before changing routes, loaders/actions, data loading, or SSR/SPA/pre-render settings. This app uses **Framework mode**. (`.claude/skills/react-router` is a symlink to it so Claude Code loads it automatically.)

## Conventions

**shadcn/ui is the Base UI variant.** Compose custom elements with the `render` prop. Never use `asChild`; it does not exist here.

```tsx
<NavigationMenuLink render={<Link to="/about" />}>About</NavigationMenuLink>
```

- Add components with `pnpm dlx shadcn@latest add <name>`.
- Route modules type their loaders, actions and meta with `import type { Route } from "./+types/<file>"`. If the import is missing, run `pnpm typecheck` to generate it.
- Use Tailwind theme tokens (`bg-background`, `text-muted-foreground`, `border`, `bg-muted`) instead of raw palette colors. They handle dark mode, so color `dark:` variants are rarely needed.
- Dark mode is the `dark` class on `<html>`, set before paint by `themeScript` in `app/lib/theme.ts`. There is no theme provider or React state: style with `dark:` variants, and switch with `setTheme()` / `toggleTheme()` (`<ThemeToggle />` is in the header).
- Images from Unsplash use `UnsplashPicture`. Pass the `photoId` path segment from the URL. Set `breakpoints` so the largest `width` matches the largest size the image actually renders. Use `priority` only for above-the-fold images. Credit the photographer in a caption.

## Commits and releases

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. release-please derives versions and the changelog from them.
- Do not edit `CHANGELOG.md` or the `version` in `package.json` by hand.
