# Splitwisely Frontend — Progress Log

Append after every completed task. Newest first.

---

## 2026-11-06 — Themes + Settings screen

**Changed**

- Six palettes (`midnight`, `ocean`, `forest`, `ember`, `amethyst`, `daylight`) in `src/theme/themes.scss`, selected via `data-theme` on `<html>`.
- `ThemeService` (`src/app/core/theme/`) applies, persists (`localStorage: splitwisely.theme`), and syncs the native status bar style/color per theme.
- Inline script in `index.html` paints the saved theme before Angular boots (no flash).
- New `/settings` page: theme picker with live preview swatches, account details, sign out. Dashboard and Groups header now link to it instead of a bare "Sign out".
- Split tokens: structural (`tokens.scss`) vs. palette (`themes.scss`). Added `--input-bg`, `--hairline`, `--bg-elevated`, and `--blob-*` channel tokens so no component hardcodes colors.
- `initNativeShell()` no longer sets the status bar color — `ThemeService` owns it.

**Next**

- Install Android Studio → `npm run cap:android` → Run on emulator.
- Phase 7 ship (deploy API + web README/demo), or wire camera into add-expense / push.

---

## 2026-11-06 — Phase 6 Capacitor Android

**Changed**

- Added Capacitor 8 + `android/` platform (`com.rahul.splitwisely`).
- Plugins: Preferences, Status Bar, Splash Screen, Share, Camera, App.
- Tokens: Preferences on native, sessionStorage on web; hydrate before bootstrap.
- Android emulator API host: `localhost` → `10.0.2.2` via `resolveApiBaseUrl()`.
- Scripts: `npm run cap:sync`, `npm run cap:android`.
- Settle-up **Share** uses native share sheet / Web Share / clipboard fallback.
- Docs: `docs/mobile.md` updated.

**Next**

- Install Android Studio → `npm run cap:android` → Run on emulator.
- Phase 7 ship (deploy API + web README/demo), or wire camera into add-expense / push.

---

## 2026-11-06 — Phase 5 / 4 / …

Polish + e2e, balances, expenses, auth, shell.
