# Splitwisely Frontend

Ionic Angular + Capacitor client for **Splitwisely**.

Sibling backend: [Splitwisely-backend](https://github.com/Rahul484626/Splitwisely-backend)

## Requirements

- Node.js **≥ 22.22.3** (Angular 22)
- Android Studio (for native runs)

## Quick start (web)

```bash
npm install
npm start          # http://localhost:4200
npm run test:unit
npm run build      # outputs to www/
```

API URL: `src/environments/environment.ts` (`apiBaseUrl`).

## Android

```bash
# API must be running on the host
npm run cap:sync      # build www + sync native
npm run cap:android   # open Android Studio → Run
```

Emulator maps `localhost` → `10.0.2.2` automatically. Physical device: set your LAN IP in `environment.ts`. Details: [`docs/mobile.md`](./docs/mobile.md).

## Docs

See [`AGENTS.md`](./AGENTS.md) and [`docs/`](./docs/).

## Status

Phases 1–6: web app + Capacitor Android shell (Preferences tokens, splash/status bar, share). Push/camera-in-form are stretch.
