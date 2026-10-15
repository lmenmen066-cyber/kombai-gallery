## Summary

- What does this PR change, and why?

## Screenshots / recordings

- Before / after for any visual change (light and dark mode, and reduced-motion if relevant).

## Test plan

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `node scripts/contrast-audit.mjs` — no hard (< 3.0:1) contrast regressions
- [ ] Manual check at 320px and on desktop

## Accessibility / motion

- New interactions honour `prefers-reduced-motion` and are keyboard-operable with visible focus.

## Notes

- Related issues, follow-ups, or anything reviewers should know.
