# kombai-gallery

A quiet, **editorial design system** built with **Next.js 14 (App Router) · Tailwind CSS 3.4 ·
Framer Motion 11 · Radix UI · Zustand · TypeScript**, inspired by the
[Kombai Gallery](https://kombai.com/gallery/web) reference site's own chrome: **light-first,
typography-led, generous spacing, restrained motion, subtle warm→cool gradient accent**.

Every component is a **real, wired implementation** — not a stub — and the whole site is verified
on a standing `typecheck + build (static prerender) + live `next start` + curl` cadence.

> 📖 **Live component index:** the running app has a Storybook-style catalog at
> **[`/components`](/components)** — searchable, grouped by category, with live previews.
> The inventory below mirrors it.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Verify before shipping (this is the standing quality gate):

```bash
npm run typecheck    # tsc --noEmit  (TypeScript strict)
npm run lint         # next lint
npm run build        # next build — all routes must prerender statically
node scripts/contrast-audit.mjs   # WCAG 2.1 contrast report over the real tokens
```

Scripts also include `npm start` (serve the production build).

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 14 App Router, React 18 |
| Styling | Tailwind CSS 3.4 + semantic CSS-variable tokens |
| Motion | Framer Motion 11 — `transform`/`opacity` only, reduced-motion aware |
| A11y primitives | Radix UI (Dialog · Accordion · Tabs · Tooltip) + custom wrappers |
| Icons | lucide-react |
| State | Zustand (toasts, UI preferences); theme via React context |
| Fonts | `next/font/google` — Syne (display) · Space Grotesk (body) · JetBrains Mono (code) |
| QR | `qrcode` (browser build) |
| Type safety | TypeScript 5 strict, `@/*` path alias |

---

## Routes

| Path | What it is |
| --- | --- |
| `/` | Marketing home — 13 sections composing the whole system |
| `/components` | Searchable, grouped **component index** with live previews |
| `/dashboard` | App shell: collapsible sidebar + top bar, KPI cards, SVG charts, sortable/filterable/paginated data table |
| `/pricing` | Billing toggle with animated prices, plan cards, comparison matrix, FAQ |
| `/login` | Split-panel auth: social buttons, password-strength meter, spinner submit, toasts |

Global chrome mounted once in `app/layout.tsx`: `ThemeProvider › PrefsProvider › { children,
`<Toaster/>`, `<Cursor/>`, `<CommandPalette/>` }`.

---

## Design system

**Tokens** (`app/globals.css` + `tailwind.config.ts`)
- Semantic colour variables (`--surface`, `--surface-raised`, `--fg`, `--fg-muted`, `--fg-subtle`,
  `--accent`, `--border`, plus `--success/warning/danger/info`), consumed only through Tailwind
  classes — never hard-coded hex in components — so **dark mode is a single `dark` class on `<html>`**.
- Fluid type scale via `clamp()` (Display / H1 / H2 / H3 / Lead / Body / Caption).
- 4px-grid spacing with semantic `section`/`gutter`; five-level elevation `shadow-elevation{1..5}`.
- Two brand gradients — `--gradient-brand` (peach → lavender → sky) and a radial hero glow.

**Motion language** (`lib/motion/variants.ts`)
- Shared `fadeUp` / `fadeIn` / `slideIn` / `staggerContainer`, plus `pickMotionVariant(variants, reduced)`
  which collapses offsets/durations under `prefers-reduced-motion`.

**Providers & global state**
- `ThemeProvider` — `light`/`dark`/`system` in `localStorage('kg.theme')`, pre-hydration script avoids flash.
- `PrefsProvider` + `usePrefs` (Zustand) — **motion** (`auto`/`reduce`/`full`) drives Framer
  `MotionConfig`; **cursor** toggle; palette open state. Persisted client-side after hydrate.
- `toast` store + `<Toaster/>` — queue with slide-in, countdown bar and hover-pause.

**Accessibility & motion**
- Keyboard-operable controls, ARIA roles, visible focus rings, `aria-live` where state changes.
- `prefers-reduced-motion` honoured everywhere; can also be forced via the ⌘K palette.
- Custom cursor activates **only** on `pointer: fine` and never under reduced motion; it is the only
  thing that hides the native pointer, so a JS failure can't leave a user cursor-less.
- `scripts/contrast-audit.mjs` parses the real `globals.css` tokens and reports WCAG ratios for
  text + solid-badge pairs in both themes — a regression baseline for any future token change.

---

## Component inventory

### Primitives
`Container` · `Section` (+ `SectionHeader`, `Eyebrow`) · `Button` (5 variants × 3 sizes, renders link
or button, spring tap + shine) · `Badge` (solid AA-checked tones, dot/count/size) · `Divider`
(solid/dashed/fade/vertical/labelled) · `Card` (media + header/body/footer, hover lift) · `Skeleton`
(shimmer) · `Spinner`.

### Navigation & layout
`Navbar` (sticky blur-on-scroll + drawer) · `Footer` · `Hero` (typewriter, magnetic CTA, parallax) ·
`Toolbar` (floating blurred pill, `layoutId` active) · `FloatingDock` (scroll-spy section navigator) ·
`ScrollProgress` · `BackToTop` · `Cursor` (custom dot + lagging ring) · `ThemeToggle`.

### Overlays & disclosure
`Modal` (Radix focus trap + scale/fade) · `Accordion` (height reveal) · `Tabs` (controlled,
`layoutId` pill) · `Tooltip` (per-instance id) · `Toast`.

### Forms & interaction
`Field` (floating label, focus bar, error shake, drawn check) · `Toggle` (`role=switch`, spring) ·
`Stepper` (**horizontal + vertical**, pulse, connector fill) · `MagneticButton` (cursor-follow) ·
`QRCode` (data-URI + clip draw-in + copy/download) · `Chat` (spring bubbles, typing dots, autoscroll) ·
`Testimonials` (masonry, star stagger, hover tilt).

### Media & charts
`Carousel` (slide/fade, drag, autoplay) · `Gallery` (masonry + FLIP filter + keyboard lightbox) ·
`VideoPlayer` (custom HTML5 controls, buffered/played seek, auto-hide) · `BlurImage` (LQIP blur-up) ·
`Charts` (`AreaLineChart` / `BarChart` / `DonutChart` — self-drawn SVG, pathLength/scaleY/dashoffset).

### Dashboard
`Shell` (collapsible sidebar + top bar) · `StatCard` (IO-gated count-up) · `DataTable`
(sortable + filterable + paginated).

### Motion & hooks (`lib/`)
`useScrollReveal` / `useStaggeredAnimation` / `useScrollPosition` · `useCountUp` (fires once) ·
`useAnimatedNumber` (re-eases on target change — used by the price toggle) · `useMagnetic` ·
`usePrefersReducedMotion`.

### Interaction system
`CommandPalette` — global **⌘K / Ctrl+K** palette that navigates and mutates theme / motion / cursor
prefs live.

---

## Repo structure

```
app/
  layout.tsx            providers + global chrome
  page.tsx              home (section composition)
  components/page.tsx   live component index
  dashboard/ login/ pricing/
components/
  providers/            ThemeProvider, PrefsProvider
  ui/                   design-system primitives & patterns
  site/                 Navbar, Hero, Footer, HomeSections, FloatingDock, ImagerySection
  dashboard/            Shell, StatCard, DataTable
lib/
  utils/cn.ts           motion/variants.ts
  hooks/                useScrollReveal, useCountUp, useAnimatedNumber, useMagnetic, …
  store/                toast.ts, prefs.ts
scripts/
  contrast-audit.mjs    WCAG contrast report (parses globals.css)
```

---

## Design principles

- Only `transform` / `opacity` animate (GPU-composited); no `left`/`top`/`width` transitions.
- `prefers-reduced-motion` is a first-class branch, not an afterthought.
- Semantic colour tokens only — dark mode is one class flip, contrast is audited in CI-style runs.
- Mobile-first: every layout is usable at 320px; content code-splits per route.

---

## Dependency baseline

The toolchain is kept current; every major bump landed on `main` behind the required
`Lint` + `Build` checks (each verified with a clean CI `npm ci`, not just a local build).

| Package | Version |
| --- | --- |
| next | ^16.4.2 |
| react / react-dom | ^19.3.1 |
| framer-motion | ^14.3.0 |
| tailwindcss | ^4.3.3 |
| tailwind-merge | ^3.7.0 |
| eslint | ^10.13.0 (flat config) |
| eslint-config-next | ^16.4.2 |
| lucide-react | ^1.58.0 |
| zustand | ^5.0.15 |
| @radix-ui/* | ^1.x latest patch |

## Upgrade log

- **Next 14 → 15** — required for the React 19 peer (Next 14 pins `react ^18`).
- **ESLint 9 + flat config** — replaced `.eslintrc.json` with `eslint.config.mjs`; `next lint` → `eslint .` (Next 16 removes `next lint`).
- **Next 15 → 16** — Turbopack build; `eslint-config-next@16` exports a flat `Linter.Config[]`, so the config imports it directly (FlatCompat crashes on the flat array). Its new React Compiler hooks rules (`set-state-in-effect`/`refs`) are demoted to warnings; genuine ones (`DataTable`, `Charts`) fixed in place.
- **lucide-react 0.46 → 1.x** — v1 removed brand icons; `Github`/`Twitter`/`Linkedin` replaced by a shared inline `BrandIcons` module.
- **framer-motion 11 → 14** — all runtime symbols used are still exported; type-level changes cleared by CI.
- **Tailwind 3 → 4** — `@import "tailwindcss"` + `@config` (reuses the theme) + `@custom-variant dark` (class strategy); `autoprefixer` dropped (bundled); `<alpha-value>` → `color-mix`.
- **tailwind-merge 2 → 3**, **ESLint 9 → 10** — landed after their companions (Tailwind v4, flat config) were in place; `twMerge`/flat-config APIs unchanged.
- CI hardening: `next build` retries ×3 to absorb transient `next/font`+Turbopack fetch flakes.

## CI & merging

`main` is protected by required status checks (**Lint**, **Build**) and a **merge queue**:
mark a PR ready (or let Dependabot auto-merge non-major bumps) and it rebases onto the
latest `main`, runs the checks, and merges only when green — no manual merge, no
out-of-date races. Enable/manage the queue under **Settings → General → Merge queue**.

## Dependabot

Two Dependabot channels keep dependencies current without manual toil:

- **Version updates** (`.github/dependabot.yml`): weekly (Mon 09:00 Asia/Shanghai) —
  bumps GitHub Actions and npm deps; npm minor/patch are grouped into one PR, majors stay
  separate. Non-major PRs are auto-merged on green (majors left for human review).
- **Security updates** (repo setting): when a CVE lands on a dependency, Dependabot opens a
  patched PR automatically. Requires the dependency graph + vulnerability alerts, which are
  enabled; toggle under **Settings → Code and automation → Security & analysis**.

Note: current advisories are all dev-only (production dependencies report 0 vulnerabilities),
so we deliberately do not run `npm audit fix --force` — it would force breaking majors on the
toolchain for no shipped-code benefit.
