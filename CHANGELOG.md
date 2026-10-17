# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Releases are tagged `vX.Y.Z`; each tag publishes a GitHub Release automatically
(see `.github/workflows/release.yml`).

## [Unreleased]

## [0.1.0] - 2026-10-17

Initial release — a Kombai-inspired, light-first editorial design system and showcase.

### Added
- **Design system**: semantic HSL CSS-variable tokens, fluid `clamp()` type scale, 4px
  spacing grid, five-level elevation, light/dark theming.
- **Components** (real, keyboard-accessible, `prefers-reduced-motion` aware): Button,
  Badge, Card, Divider, Skeleton, Spinner, Field, Toggle, Stepper (horizontal + vertical),
  Tabs, Accordion, Modal, Tooltip, Toast, Carousel, Gallery, VideoPlayer, Chat, QRCode,
  Testimonials, BlurImage (LQIP), self-drawn SVG Charts, Toolbar, Cursor, MagneticButton,
  CommandPalette, ThemeToggle, ScrollProgress, BackToTop.
- **Routes**: `/` (13-section marketing page), `/components` (searchable index with live
  previews), `/dashboard` (app shell + KPI cards + charts + sortable/filterable/paginated
  table), `/pricing` (billing toggle with animated prices + comparison matrix), `/login`
  (split-panel auth + password-strength + toasts).
- **Global state**: Zustand prefs (motion/cursor/palette) driving Framer `MotionConfig`,
  a theme provider, and a toast queue; a global ⌘K command palette.
- **Tooling**: accessibility contrast audit (`scripts/contrast-audit.mjs`), ESLint 9/10 flat
  config, CI (`ci.yml`), Dependabot version + security updates, branch protection with
  required checks and a merge queue, PR template, self-hosted fonts, this CHANGELOG and a
  tag-driven GitHub Release workflow.

### Dependencies (baseline)
Next 16 · React 19 · Tailwind CSS 4 · tailwind-merge 3 · Framer Motion 14 ·
ESLint 10 (flat) · lucide-react 1.x · Zustand 5 · Radix UI (latest patches).

[Unreleased]: https://github.com/lmenmen066-cyber/kombai-gallery/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/lmenmen066-cyber/kombai-gallery/releases/tag/v0.1.0
