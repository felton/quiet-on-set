import { REPO_URL } from "~/content/nav";
import { templateVersion } from "~/lib/template-version";

export function SiteFooter() {
  return (
    <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
      Built with{" "}
      <a
        href={`${REPO_URL}/releases/tag/v${templateVersion}`}
        className="underline underline-offset-2 hover:text-foreground"
      >
        quiet-on-set v{templateVersion}
      </a>
      .
    </footer>
  );
}
