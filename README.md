# quiet on set

A quiet, ready-to-shoot Vite starter: React Router, shadcn/ui, Tailwind. Places, everyone.

`quiet-on-set` is a starting point for new web projects. The setup work is already done (routing, styling, components, formatting, CI), so you or a coding agent can start building the actual site straight away.

## What's on set

- **React Router v8** in framework mode, with server-side rendering and typed routes
- **Tailwind CSS v4** and **shadcn/ui** on the [Base UI](https://base-ui.com) variant
- **TypeScript**, plus **oxfmt** for formatting
- **`UnsplashPicture`**, a responsive `<picture>` component that builds art-directed crops for each Tailwind breakpoint from an Unsplash photo ID
- **GitHub Actions** for CI (check, build, and a clean-copy build), release-please for versioning, and grouped Dependabot updates
- **`AGENTS.md`**, which gives coding agents the commands, project layout and conventions

## Using the template

### Pin a release (recommended)

```bash
npx degit <owner>/quiet-on-set#v0.1.0 my-app
cd my-app
pnpm install
pnpm dev
```

This copies the files from that release with no git history, so your project starts with a clean repo. The available versions are listed on the [Releases](../../releases) page. Leave off `#v…` to get the latest `main`.

### "Use this template" on GitHub

Clicking **Use this template** creates a new repo from the current `main`. You can also do this from the command line:

```bash
gh repo create my-app --template <owner>/quiet-on-set --private --clone
```

### With a coding agent

Point the agent at the degit command above, then give it the brief for the site. Everything it needs to know is in `AGENTS.md`, which `CLAUDE.md` imports:

- how to add shadcn components (Base UI uses `render`, not `asChild`)
- where routes go and how to register them
- how to use `UnsplashPicture`
- to run `pnpm check` before it calls the work done

## Scripts

| Command          | What it does                            |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | Dev server at `http://localhost:5173`   |
| `pnpm build`     | Production build to `build/`            |
| `pnpm start`     | Serve the production build              |
| `pnpm fmt`       | Format everything                       |
| `pnpm check`     | Format check, lint, typecheck and tests |
| `pnpm typecheck` | Generate route types and run `tsc`      |

## Making it yours

1. Rename the project in `package.json` and update the brand in `app/welcome/welcome.tsx`.
2. Swap the hero image by passing a new `photoId` to `UnsplashPicture`, and update the photographer credit.
3. Add routes in `app/routes/` and register them in `app/routes.ts`.
4. Add components with `pnpm dlx shadcn@latest add <component>`.

## Deployment

`pnpm build` writes `build/client` (static assets) and `build/server` (the SSR server). Any host that runs Node can serve them with `pnpm start`, and the included `Dockerfile` packages the same thing for container platforms.

## Versioning

Releases are automated with [release-please](https://github.com/googleapis/release-please). Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`…). Merging the release PR bumps the version, updates `CHANGELOG.md`, and tags `vX.Y.Z`.

---

Hero photo by [stefano stacchini](https://unsplash.com/@stak59) on [Unsplash](https://unsplash.com).
