# quiet-on-set docs

This branch holds the source of the quiet-on-set docs site, published at <https://felton.github.io/quiet-on-set/>. It is not part of the template. Scaffold from `main` or a release tag instead.

The site is itself a quiet-on-set project, started from the release in `TEMPLATE_VERSION`.

- `pnpm dev`: dev server at `http://localhost:5173/quiet-on-set/`
- `pnpm build`: pre-rendered static site in `build/client`
- `pnpm check`: format, lint, typecheck, tests
- `pnpm sync:template`: update to the release in `TEMPLATE_VERSION`: re-copy the template's UI components, theme and `.nvmrc` from its tag, and match the versions of the dependencies both projects share

`app/components/ui` is vendored from the template. Make template changes on `main` and release them. Then, here: bump `TEMPLATE_VERSION`, run `pnpm sync:template`, review the diff, and open a PR. This branch is an orphan, so it can't merge `main`; the sync copies from the tag by path instead. `git cherry-pick` also works for a one-off fix that hasn't been released yet. Pushes to `docs` deploy through `.github/workflows/docs.yml`.

Work in a separate worktree so `main` and `docs` never share a working copy:

```bash
git worktree add ../quiet-on-set-docs docs
```
