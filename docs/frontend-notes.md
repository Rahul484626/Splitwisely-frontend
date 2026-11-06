# Splitwisely — Frontend Notes

## Proposed folder layout (Phase 1)

```
src/
  app/
    core/           # auth interceptor, API config, guards
    shared/         # glass-card, amount pipe, UI primitives
    features/
      auth/
      dashboard/
      groups/
      expenses/
      friends/
      activity/
      profile/
  theme/
    tokens.scss
    glass.scss
  environments/
```

## Environment

| Var | Example |
| --- | --- |
| `API_BASE_URL` | `http://localhost:3000/api/v1` |

Device testing: use machine LAN IP, not `localhost`.

CORS is configured on the backend via `FRONTEND_ORIGIN`.

## API client

- Early phases: thin Angular `HttpClient` services matching `api.md`.
- Phase 5: generate typed client from backend OpenAPI (ADR-0006).
- Never duplicate response shapes that drift from `api.md`.

## Money UX

- Inputs collect major units (rupees) as strings/decimals in the form UI.
- Convert to integer minor units **once** before API calls (e.g. multiply by 100 for INR).
- Display with `tabular-nums` and locale formatting from minor units.

## Auth storage

| Platform | Access | Refresh |
| --- | --- | --- |
| Web (dev) | memory | memory or session (tighten in Phase 5/6) |
| Native | secure storage | secure storage |

## Scripts (after scaffold)

- `npm start` — serve
- `npm test` — unit
- `npm run e2e` — Playwright
- `npm run build` — web asset for Capacitor
