# Splitwisely — Design System

Style: **dark glassmorphism**. Deep navy canvas with soft indigo, teal, and magenta glows behind frosted panels.

## Source of truth (mockups)

| Screen | Mockup | Notes |
| --- | --- | --- |
| 2 Dashboard | [`../Dashboard-html/Main.dc.html`](../Dashboard-html/Main.dc.html) | Implement from inline styles; do not ship the mockup runtime |
| 4 Group detail | [`../Group detail-html/Group.dc.html`](../Group%20detail-html/Group.dc.html) | Balance card, simplified payments, expenses, members |
| 5 Add expense | **TBD** | Placeholder until mockup lands; follow tokens + form patterns below |

Artboard reference size in mockups: **390×844** (mobile-first).

## Tokens (CSS custom properties)

```css
:root {
  --bg-base: #0B1020;
  --blob-indigo: #6366F1;
  --blob-teal: #14B8A6;
  --blob-magenta: #EC4899;
  --glass-fill: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.16);
  --glass-blur: blur(20px) saturate(140%);
  --glass-fallback: rgba(20, 26, 46, 0.92);
  --text-primary: #F8FAFC;
  --text-secondary: #A5B4CF;
  --accent: #818CF8;
  --accent-gradient-from: #6366F1; /* mockups also use #4F46E5 → #7C3AED */
  --accent-gradient-to: #8B5CF6;
  --positive: #34D399;
  --negative: #FB7185;
  --neutral: #94A3B8;
  --radius-card: 20px;
  --radius-control: 14px;
  --space: 8px;
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
}
```

Primary button gradient in mockups: `linear-gradient(135deg, #4F46E5, #7C3AED)` — prefer matching mockups over abstract token when they differ slightly.

Light theme later: swap token values only.

## Rules

- Glass accent on cards, bottom nav, modals; dense scrolling lists use more opaque fill.
- `@supports (backdrop-filter: blur(1px))` for blur; else `--glass-fallback`. Same when `prefers-reduced-transparency: reduce`.
- Blur 12–20px; max two stacked blurred layers.
- Body text ≥ 4.5:1 on glass.
- Owe/owed: `--negative` / `--positive` + sign (`+` / `−`) + words ("you owe" / "you are owed").
- Radius: 20px cards, 14px inputs/buttons; 8px spacing grid.
- Font: Plus Jakarta Sans; `font-variant-numeric: tabular-nums` on all money.

## Component specs

### Glass card

- Padding 16–20px; radius 20px; fill + 1px border; optional blur.
- Used for overall balance, group rows container accents, settle summary.

### Buttons

| Variant | Style |
| --- | --- |
| Primary | Gradient fill, white text, height 44–48px, radius 14px |
| Secondary / ghost | Glass fill + border, primary text |
| Icon circle | 44×44, glass, for back / notifications |

### Inputs

- Height ~48px; radius 14px; glass or opaque dark fill; label above in `--text-secondary`.
- Error text in `--negative` below field.

### List rows

- Height ~64px for group rows (avatar 44×44 radius 14px, title, subtitle, amount + caption).
- Prefer slightly higher opacity than hero cards for long lists.

### Bottom tab bar

- Glass bar; icons + labels; active = `--accent`.
- Tabs (proposed): Home, Groups, Activity, Friends, Profile — or Home / Groups / Activity / Profile with FAB for add. Align with Ionic tabs in Phase 1 shell.

### Modals / sheets

- Glass panel; max two blur layers with content behind.
- Settle up and split-type pickers as sheets.

### Toasts

- Short, high-contrast; success/error; do not rely on color alone.

### Empty / loading

- Empty: one sentence + primary CTA.
- Loading: skeleton blocks matching card radii (avoid spinner-only on dashboard).

## Screen wireframes (text)

### 1. Sign in / sign up

- Brand wordmark **Splitwisely** near top (hero-level, not tiny nav).
- Email, password; submit primary; link to toggle mode.
- Blobs in background; form on glass card.

### 2. Dashboard — **mockup exists**

- Greeting + name; notification icon button.
- Overall balance glass card: big signed amount, "You are owed overall" / owe copy; sub-row You owe | You are owed.
- CTA row: Add expense | Settle up.
- Groups section header + See all; glass group rows with net + caption.
- Recent activity list (compact).
- Bottom tabs.

### 3. Groups list

- Title Groups; FAB or primary Add group.
- Full list of group rows (same row component as dashboard).

### 4. Group detail — **mockup exists**

- Back; title; members · currency.
- Your balance card + Settle up.
- Simplified payments list (name + "pays you" / "you pay" + amount).
- Expenses list; Members section.
- FAB or primary Add expense.

### 5. Add expense — **mockup pending**

- Amount (major unit input → convert to minor on submit).
- Description; payer select; participants multi-select.
- Split type: equal | exact | percentage | shares.
- Dynamic split editor; live sum validation.
- Save primary.

### 6. Settle up

- From / to members; amount; optional note; confirm.
- Prefill from simplified suggestion when navigated from group.

### 7. Friends

- List of users sharing groups; shared group count.

### 8. Activity feed

- Chronological cards: actor, type summary, amount if any, relative time.

### 9. Profile / settings

- Name, email (read-only), default currency, theme (client), sign out.

## Motion

- Subtle fade/slide on page enter (150–250ms).
- Button press opacity/scale lightly.
- Avoid continuous blur animation.
- Respect `prefers-reduced-motion`.

## Accessibility

- Focus rings visible on controls.
- Icon buttons have `aria-label` (mockups already do).
- Contrast AA for body; large amounts can be AAA.
- Screen reader: announce balance with words, not color.
