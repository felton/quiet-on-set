/**
 * Dark mode without a provider.
 *
 * The `dark` class on <html> is the single source of truth. `themeScript` is
 * inlined in <head> (see root.tsx) and runs before first paint, so there's no
 * flash of the wrong theme. With no saved choice it follows the OS setting,
 * live. Components never need theme state: style with `dark:` variants and
 * call `toggleTheme()` to switch.
 */

export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export const themeScript = `(() => {
  const key = ${JSON.stringify(THEME_STORAGE_KEY)};
  const query = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => {
    let saved = null;
    try { saved = localStorage.getItem(key); } catch {}
    document.documentElement.classList.toggle(
      "dark",
      saved ? saved === "dark" : query.matches,
    );
  };
  apply();
  query.addEventListener("change", apply);
  addEventListener("storage", (e) => e.key === key && apply());
})();`;

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.): the switch still works for this page view.
  }
}

export function toggleTheme() {
  setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
}
