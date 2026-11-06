# AGENTS.md — Splitwisely Frontend

Operating manual for AI agents in this repository.

## Product

**Splitwisely** — expense-splitting app (web + Android + iOS via Capacitor). UI only in this repo.

## Two-repo layout

| Repo | Role |
| --- | --- |
| Sibling **Splitwisely-backend** | API, Postgres, **shared product docs** (`prd`, `database`, `api`, …) |
| **This repo** | Ionic Angular + Capacitor; design/mobile docs; mockups |

**Contract:** backend [`docs/api.md`](https://github.com/Rahul484626/Splitwisely-backend/blob/main/docs/api.md). Local sibling path: `../Splitwisely-backend/docs/`. Update `api.md` before inventing endpoints. See backend `docs/skills.md` contract checklist.

## Non-negotiable rules

1. Money display: format from integer minor units; never compute money with floats.
2. Glass is an accent with solid fallbacks (`docs/design.md`).
3. Owe vs owed: color **and** `+`/`−` **and** words.
4. Mockups under `Dashboard-html/` and `Group detail-html/` are **reference**, not production code.
5. Conventional Commits. Append `docs/progress.md` after each task.

## Stack (pin at Phase 1 after version check)

- Angular (latest stable) standalone + signals
- Ionic Angular + Capacitor
- SCSS + CSS custom properties
- Playwright for e2e (later)

Reference check Nov 2026: Angular 22.x, Ionic 9.x, Capacitor 8.6.x stable (9.x beta — prefer stable unless team chooses otherwise).

## How to run (after Phase 1)

```bash
npm install
npm start                 # ionic/angular serve
# API_BASE_URL → backend, default http://localhost:3000/api/v1
```

## Docs map

| File | When |
| --- | --- |
| [docs/README.md](./docs/README.md) | Index + links to backend docs |
| [docs/design.md](./docs/design.md) | Tokens, components, screens |
| [docs/mobile.md](./docs/mobile.md) | Capacitor, Android/iOS, PWA |
| [docs/frontend-notes.md](./docs/frontend-notes.md) | Folders, env, API client |
| [docs/progress.md](./docs/progress.md) | Frontend session log |

Backend docs (required reading for features): `prd.md`, `api.md`, `database.md`, `architecture.md`, `roadmap.md`.
