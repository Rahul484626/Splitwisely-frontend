# Splitwisely — Mobile (Ionic + Capacitor)

## Status (Phase 6)

- Capacitor app id: `com.rahul.splitwisely`
- Android project: [`android/`](../android/) (generated)
- Plugins wired: Preferences (tokens), Status Bar, Splash Screen, Share, Camera (helper ready), App
- Web + Android share this Angular codebase; data goes through the same API

## Daily workflow

```bash
# 1. API running (host machine)
cd ../Splitwisely-backend && npm run dev

# 2. Build web assets + sync native
cd ../Splitwisely-frontend
npm run cap:sync          # build + npx cap sync
npm run cap:android       # open Android Studio
```

After **any** frontend code change that should ship in the APK:

```bash
npm run cap:sync
# then Run in Android Studio (or `npx cap run android` if SDK/emulator ready)
```

API-only changes (backend) need **no** Capacitor rebuild — just restart/redeploy the API.

## API URL on device

| Target | `apiBaseUrl` |
| --- | --- |
| Browser (`ng serve`) | `http://localhost:3000/api/v1` |
| Android emulator | auto-rewrites `localhost` → `10.0.2.2` |
| Physical phone | set LAN IP in `src/environments/environment.ts`, e.g. `http://192.168.x.x:3000/api/v1` |

`capacitor.config.ts` sets `server.cleartext: true` for local HTTP during development.

## Token storage

| Platform | Storage |
| --- | --- |
| Web | `sessionStorage` |
| Native | `@capacitor/preferences` (app-private) + in-memory cache for the HTTP interceptor |

Hydrated once in `initNativeShell()` before Angular boots.

## Plugins

| Plugin | Use |
| --- | --- |
| Preferences | Access + refresh tokens |
| Status Bar | Style + background follow the active theme (`ThemeService`) |
| Splash Screen | Auto-hide, navy background |
| Share | Settle-up suggestions share sheet |
| Camera | `CameraService.takeReceiptPhoto()` ready (not in expense form yet) |
| Push | Stretch — add `@capacitor/push-notifications` when FCM is configured |

## Themes on native

The web layer owns theming (`data-theme` on `<html>`). On native,
`ThemeService` also updates the status bar style and background color whenever
the theme changes — dark themes use white-on-dark, **Daylight** switches to
light style with a pale background. Values come from the theme catalog, so a new
theme needs no native changes.

## Android Studio requirements

1. Install [Android Studio](https://developer.android.com/studio) (includes JDK + SDK).
2. Open the `android/` folder (`npm run cap:android`).
3. Let Gradle sync; create/start an emulator or plug in a device with USB debugging.
4. Run **app**.

## iOS

Needs a Mac + Xcode + Apple Developer account:

```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

Ship **PWA + Android** first if you have no Mac.

## Release checklist

- [x] Capacitor Android project present
- [x] Tokens on Preferences (native) / sessionStorage (web)
- [x] Splash / status bar configured
- [x] Share on settle-up
- [ ] Camera wired into add-expense (stretch)
- [ ] Push notifications + FCM (stretch)
- [ ] Production `apiBaseUrl` (HTTPS)
- [ ] Android release signing / Play upload
- [ ] Smoke on emulator: login → add expense → balances
