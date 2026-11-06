# Splitwisely Frontend — Progress Log

Append after every completed task. Newest first.

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
