#!/bin/sh
# Re-copy the template's UI components and theme from the release tag in
# TEMPLATE_VERSION, then record which components that release ships.
# Run after bumping TEMPLATE_VERSION, review the diff, then commit.
set -eu

tag="v$(cat TEMPLATE_VERSION)"
ui=app/components/ui

# Components the docs site adds on top of the template. Sync leaves them alone.
docs_only="accordion alert badge breadcrumb card input sheet sidebar skeleton switch table tabs tooltip"

git fetch --tags --quiet

# `git checkout <tag> -- <paths>` overlays: it updates files the tag has and
# leaves the docs-only components in place (`git restore --source` would delete them).
git checkout "$tag" -- "$ui" app/app.css app/lib/theme.ts app/components/theme-toggle.tsx

git ls-tree --name-only "$tag" "$ui/" | xargs -n1 basename | sed 's/\.tsx$//' > app/content/shipped-components.txt

# Flag files the tag doesn't have and that aren't docs-only: most likely a
# component the template removed.
stale=""
for f in "$ui"/*.tsx; do
  name=$(basename "$f" .tsx)
  grep -qx "$name" app/content/shipped-components.txt && continue
  case " $docs_only " in *" $name "*) continue ;; esac
  stale="$stale $f"
done

echo "Synced $ui and theme from $tag."
if [ -n "$stale" ]; then
  echo "Not in $tag and not docs-only (delete, or add to docs_only):$stale" >&2
  exit 1
fi
