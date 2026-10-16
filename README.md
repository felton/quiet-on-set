# quiet on set

A quiet, ready-to-shoot Vite starter: React Router, shadcn/ui, Tailwind. Places, everyone.

`quiet-on-set` is a starting point for new web projects. The setup work is already done (routing, styling, components, formatting, CI), so you or a coding agent can start building the actual site straight away.

## What's on set

- **React Router v8** in framework mode, with server-side rendering and typed routes
- **Tailwind CSS v4** and **shadcn/ui** on the [Base UI](https://base-ui.com) variant
- **TypeScript**, with **oxfmt** for formatting and **oxlint** for linting
- **Vitest** and **Testing Library**, with a working example test for the home route
- **Dark mode** with a Light / Dark / System menu in the header. It follows the OS setting by default and needs no provider or extra dependency.
- **`UnsplashPicture`**, a responsive `<picture>` component that builds art-directed crops for each Tailwind breakpoint from an Unsplash photo ID
- **GitHub Actions** for CI (check, build, and a clean-copy build), release-please for versioning, and grouped Dependabot updates
- **`AGENTS.md`**, which gives coding agents the commands, project layout and conventions, plus the official React Router and shadcn/ui agent skills in `.agents/skills/`

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

## Testing

Tests sit next to the code they cover, as `*.test.ts(x)` files under `app/`. They run in jsdom using [Testing Library](https://testing-library.com/docs/react-testing-library/intro/). `app/routes/home.test.tsx` is the pattern to copy. It renders a route inside `createRoutesStub` because route components use `<Link>`, and `<Link>` needs a router:

```tsx
const Stub = createRoutesStub([{ path: "/", Component: Home }]);
render(<Stub initialEntries={["/"]} />);
expect((await screen.findByRole("heading", { level: 1 })).textContent).toBe("Places, everyone.");
```

Vitest uses its own config, `vitest.config.ts`, because the React Router Vite plugin doesn't run under Vitest. `vitest.setup.ts` cleans up the DOM between tests.

## Dark mode

The theme is a single `dark` class on `<html>`. No React context or provider is involved.

- `themeScript` in `app/lib/theme.ts` is inlined in `<head>` and runs before first paint, so the page never flashes the wrong theme. With System selected (the default), it follows the OS setting and updates when the OS setting changes. It also stays in sync across open tabs.
- `<ThemeToggle />` (`app/components/theme-toggle.tsx`) is a Light / Dark / System menu. The button shows a sun or a moon for whichever theme is currently showing, so with System selected it follows the OS. CSS picks the icon, so the server render always matches the client.
- Light and Dark are saved to `localStorage`. System is the default and clears the saved value, so the page goes back to following the OS.
- The menu is shadcn's `dropdown-menu` (`app/components/ui/dropdown-menu.tsx`). Its radio items set `closeOnClick`, because Base UI keeps a menu open after a radio pick by default.
- To style for dark mode, use `dark:` variants, or the shadcn color tokens in `app/app.css` (`bg-background`, `text-muted-foreground`, etc.), which handle it for you. Call `setTheme("light" | "dark" | "system")` or `toggleTheme()` from anywhere.

## Making it yours

1. Rename the project in `package.json` and update the brand in `app/welcome/welcome.tsx`.
2. Reset versioning. The copy carries over the template's `version` in `package.json` and its `CHANGELOG.md`, but none of its tags. Set `version` to your starting point (for example `0.1.0`) and delete `CHANGELOG.md`, so your first release starts clean. See [Versioning](#versioning).
3. Swap the hero image by passing a new `photoId` to `UnsplashPicture`, and update the photographer credit.
4. Add routes in `app/routes/` and register them in `app/routes.ts`.
5. Add components with `pnpm dlx shadcn@latest add <component>`.
6. Replace the favicon. `public/favicon.svg` follows the browser's light/dark setting. `public/favicon.ico` is the fallback for Safari: edit `assets/favicon-tile.svg`, then run `pnpm favicon` to rebuild it (needs `brew install vips` or GraphicsMagick).

## Environment variables

Copy `.env.example` to `.env` to set local values. `.env` is gitignored and left out of Docker images. The React Router CLI loads it for `dev`, `build` and `typegen`.

| Variable | Default | Effect                                                                                                        |
| -------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `SPA`    | unset   | `true` builds a static single-page app (`ssr: false`) instead of the Node server build                        |
| `VITE_*` | —       | Exposed to browser code as `import.meta.env.VITE_*`. They end up in the bundle, so never use them for secrets |

`SPA` can be set three ways: `pnpm build:spa` (one-off), `SPA=true pnpm build` (same thing, by hand), or `SPA=true` in `.env` (every command, including `dev`). With it set in `.env`, plain `pnpm build` also produces the SPA build.

## Deployment

### Node server (default)

`pnpm build` writes `build/client` (static assets) and `build/server` (the SSR server). Any host that runs Node can serve them with `pnpm start`. The included `Dockerfile` packages the same build for container platforms.

### Static hosting, no server

React Router can also build the app as plain static files: an `index.html`, JS and CSS that any web server can host (GitHub Pages, S3, Netlify, nginx). Routing then happens entirely in the browser. The rest of the app stays the same. There are two variants:

**SPA mode.** One `index.html`, and every route renders in the browser. This works like the classic client-side-routed React Router apps. It's built in, so no config edit is needed:

```bash
pnpm build:spa     # same as SPA=true pnpm build -> build/client/index.html
pnpm preview:spa   # serve it locally, with client-side routing fallback
```

`react-router.config.ts` reads the `SPA` environment variable (see [Environment variables](#environment-variables)) and sets `ssr: !spa`. To make SPA the permanent default, set `ssr: false` there directly.

There's no `index.html` source file in the repo. React Router generates it at build time from the `Layout` in `app/root.tsx`, so the head tags, fonts and dark-mode script are defined once for both modes.

**Pre-rendered.** Each static route is rendered to its own HTML file at build time, which helps SEO and first paint. Routes that aren't pre-rendered fall back to SPA mode.

```ts
export default {
  ssr: false,
  prerender: true, // or a list of paths: ["/", "/about"]
} satisfies Config;
```

In both modes, `pnpm build` outputs a deployable `build/client` folder. The trade-offs:

- No server code runs. Route `loader`s run at build time, and only on pre-rendered routes (in SPA mode, only the root route can have one). `action`s aren't allowed at all. To fetch data at runtime, use `clientLoader` / `clientAction`.
- The host has to send unknown URLs to the SPA entry so that deep links work. That entry is `index.html` in SPA mode. With `prerender`, it's `__spa-fallback.html` whenever `/` itself is pre-rendered. On Netlify this is a one-line `_redirects` file: `/*  /index.html  200`.
- Preview a static build with `pnpm preview:spa`, which is a plain static file server like your host will be. `pnpm start` will also run it, through the Node server, but that isn't how it gets served in production.

> The other route to a static app is React Router's _library mode_: a plain Vite app with `createBrowserRouter`, without the React Router Vite plugin. It's a different project structure, not a config change, so for this template use one of the settings above.

### GitHub Pages

GitHub Pages serves a project site from a subpath (`https://<user>.github.io/<repo>/`) and has no rewrite rules. That takes three changes on top of SPA mode:

1. **Subpath.** Set `ssr: false` and add `basename: "/<repo>/"` to `react-router.config.ts` and `base: "/<repo>/"` to `vite.config.ts`. Both are needed: the basename sets the route paths, and `base` sets the asset URLs.
2. **Deep links.** Pages serves `404.html` for any URL it can't find. Copying `index.html` there makes refreshes and shared links work. (Pages still reports those responses with a 404 status code. That's fine for a personal site, but if search ranking matters, use a host with proper rewrites.)
3. **Deploy workflow.** Add `.github/workflows/pages.yml` and set **Settings → Pages → Source** to "GitHub Actions":

```yaml
name: Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: cp build/client/index.html build/client/404.html
      - uses: actions/upload-pages-artifact@v5
        with:
          path: build/client
      - id: deployment
        uses: actions/deploy-pages@v5
```

Use SPA mode (without `prerender`) for GitHub Pages. With a `basename`, pre-rendered pages are written to a nested `<repo>/` folder that doesn't line up with how Pages serves the site.

## Versioning

Releases are automated with [release-please](https://github.com/googleapis/release-please). Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`…). On each push to `main`, release-please opens or updates a release PR. Merging that PR bumps the version, updates `CHANGELOG.md`, tags `vX.Y.Z` and publishes a GitHub Release. Only `feat:` and `fix:` commits (or a `!` breaking change) trigger a release, so squash-merge PRs with a conventional title.

The workflow uses the built-in `GITHUB_TOKEN`; no secret is needed. Each repo does need one setting turned on: **Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests"**.

**In a project made from this template,** the same workflow versions *your* project. A copy made with degit or **Use this template** starts with no tags and no release history from the template, so do step 2 of [Making it yours](#making-it-yours) and turn on the setting above in the new repo. If you don't want automated releases, delete `.github/workflows/release-please.yml`.

---

Hero photo by [stefano stacchini](https://unsplash.com/@stak59) on [Unsplash](https://unsplash.com).
