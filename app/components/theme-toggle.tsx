import { Moon, Sun } from "lucide-react";

import { Button } from "~/components/ui/button";
import { toggleTheme } from "~/lib/theme";

/**
 * Shows a sun in light mode and a moon in dark mode. Which icon is visible is
 * decided by CSS (`dark:` variants), not React state, so the server render
 * always matches and there's no hydration mismatch or icon flicker.
 */
export function ThemeToggle() {
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
