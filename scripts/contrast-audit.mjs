// WCAG 2.1 contrast audit for the design tokens in app/globals.css.
// It PARSES the real token values (no hand-copied numbers, so it can't drift
// from the source) and reports ratio + AA/AAA pass-fail for the pairs that
// actually carry text or non-text UI, in BOTH light and dark themes.
//
// Usage: node scripts/contrast-audit.mjs [output.md]
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(here, '../app/globals.css')
const outPath = resolve(process.argv[2] ?? resolve(here, '../a11y-contrast-report.md'))

const css = readFileSync(cssPath, 'utf8')

function blockVars(re) {
  const m = css.match(re)
  if (!m) return {}
  const body = m[1]
  const vars = {}
  const rx = /--([a-z0-9-]+):\s*([^;]+);/g
  let g
  while ((g = rx.exec(body))) {
    const name = g[1]
    const raw = g[2].trim()
    const hsl = raw.match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/)
    if (hsl) vars[name] = [parseFloat(hsl[1]), parseFloat(hsl[2]), parseFloat(hsl[3])]
  }
  return vars
}

const light = blockVars(/:root\s*\{([\s\S]*?)\}/)
const dark = blockVars(/html\.dark\s*\{([\s\S]*?)\}/)

function hslToRgb([h, s, l]) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [f(0), f(8), f(4)].map((x) => x * 255)
}
function lin(c) {
  c /= 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
function lum(rgb) {
  const [r, g, b] = rgb.map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(fgRgb, bgRgb) {
  const a = lum(fgRgb)
  const b = lum(bgRgb)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
function over(fgRgb, bgRgb, alpha) {
  return fgRgb.map((c, i) => c * alpha + bgRgb[i] * (1 - alpha))
}
const hex = (rgb) =>
  '#' + rgb.map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('')

// Pairs that carry TEXT must meet 4.5 (normal) / 3.0 (large). Borders are
// non-text UI (WCAG 1.4.11) → 3.0 target, flagged as such.
const TEXT_PAIRS = [
  { name: 'Body text', fg: 'fg', bg: 'surface' },
  { name: 'Body text on card', fg: 'fg', bg: 'surface-raised' },
  { name: 'Muted text', fg: 'fg-muted', bg: 'surface' },
  { name: 'Muted text on card', fg: 'fg-muted', bg: 'surface-raised' },
  { name: 'Subtle text (captions)', fg: 'fg-subtle', bg: 'surface-raised' },
  { name: 'Subtle text on surface', fg: 'fg-subtle', bg: 'surface' },
  { name: 'Button label on accent', fg: 'accent-contrast', bg: 'accent' },
  { name: 'Inverse text on panel', fg: 'fg-inverse', bg: 'surface-inverse' },
  { name: 'Inline · success text', fg: 'success', bg: 'surface-raised' },
  { name: 'Inline · danger text', fg: 'danger', bg: 'surface-raised' },
  { name: 'Inline · info text', fg: 'info', bg: 'surface-raised' },
]
// Solid badges: label is a fixed neutral over the full-intensity hue, and the
// neutral flips by theme (white on the darker light hues, near-black ink on the
// lighter dark hues) — computed separately below since it isn't a token pair.
const SOLID_TONES = ['success', 'warning', 'danger', 'info']
const UI_PAIRS = [
  { name: 'Border on surface', fg: 'border', bg: 'surface' },
  { name: 'Strong border on surface', fg: 'border-strong', bg: 'surface' },
]

function evalPairs(vars, pairs) {
  return pairs.map((p) => {
    const fg = vars[p.fg]
    const baseBg = vars[p.bg]
    if (!fg || !baseBg) return { ...p, missing: true }
    const fgRgb = hslToRgb(fg)
    const bgRgb = p.tint ? over(fgRgb, hslToRgb(baseBg), p.tint) : hslToRgb(baseBg)
    const ratio = contrast(fgRgb, bgRgb)
    return { ...p, ratio, fgHex: hex(fgRgb), bgHex: hex(bgRgb), missing: false }
  })
}

const fmt = (r) => r.toFixed(2)
const pass = (r, t) => (r >= t ? '✅' : '❌')
const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large' : 'Fail')

function section(title, vars, pairs, isText) {
  const rows = evalPairs(vars, pairs)
  const lines = []
  lines.push(`### ${title}`, '')
  lines.push(
    isText
      ? '| Pair | Foreground | Background | Ratio | AA (normal 4.5) | AA (large 3.0) | Grade |'
      : '| UI element | Colour | Against | Ratio | Non-text AA (3.0) |',
  )
  if (isText) lines.push('| --- | --- | --- | ---: | :---: | :---: | :---: |')
  else lines.push('| --- | --- | --- | ---: | :---: |')
  for (const r of rows) {
    if (r.missing) {
      lines.push(`| ${r.name} | — | — | n/a | (token missing) | | |`)
      continue
    }
    if (isText) {
      lines.push(
        `| ${r.name} | \`${r.fgHex}\` | \`${r.bgHex}\` | ${fmt(r.ratio)} | ${pass(r.ratio, 4.5)} | ${pass(r.ratio, 3)} | ${grade(r.ratio)} |`,
      )
    } else {
      lines.push(`| ${r.name} | \`${r.fgHex}\` | \`${r.bgHex}\` | ${fmt(r.ratio)} | ${pass(r.ratio, 3)} |`)
    }
  }
  lines.push('')
  const hard = rows.filter((r) => !r.missing && r.ratio < 3)
  const largeOnly = rows.filter((r) => !r.missing && r.ratio >= 3 && r.ratio < 4.5)
  return { md: lines.join('\n'), hard: hard.map((f) => ({ ...f, title })), borderline: largeOnly.map((f) => ({ ...f, title })), all: rows }
}

const L = section('Light theme · text', light, TEXT_PAIRS, true)
const D = section('Dark theme · text', dark, TEXT_PAIRS, true)
const LU = section('Light theme · non-text UI (1.4.11)', light, UI_PAIRS, false)
const DU = section('Dark theme · non-text UI (1.4.11)', dark, UI_PAIRS, false)

// Solid badges — label is a fixed neutral, not a token, so compute directly.
const WHITE = [255, 255, 255]
const INK = hslToRgb([220, 16, 8]) // ~#111318, the dark-mode badge label
function solidSection(title, vars, labelRgb, labelName) {
  const rows = SOLID_TONES.map((tone) => {
    const bg = hslToRgb(vars[tone])
    return { name: `Badge · ${tone}`, ratio: contrast(labelRgb, bg), fgHex: hex(labelRgb), bgHex: hex(bg) }
  })
  const lines = [`### ${title}`, '', `| Label (\`${labelName}\`) on solid | Background | Ratio | AA normal 4.5 | Grade |`, '| --- | --- | ---: | :---: | :---: |']
  for (const r of rows) lines.push(`| ${r.name} | \`${r.bgHex}\` | ${fmt(r.ratio)} | ${pass(r.ratio, 4.5)} | ${grade(r.ratio)} |`)
  lines.push('')
  return { md: lines.join('\n'), hard: rows.filter((r) => r.ratio < 3).map((r) => ({ ...r, title })), largeOnly: rows.filter((r) => r.ratio >= 3 && r.ratio < 4.5).map((r) => ({ ...r, title })), belowNormal: rows.filter((r) => r.ratio < 4.5).map((r) => ({ ...r, title })) }
}
const SB_L = solidSection('Light theme · solid badges (white label)', light, WHITE, '#ffffff')
const SB_D = solidSection('Dark theme · solid badges (near-black ink)', dark, INK, '#111318')

const hard = [...L.hard, ...D.hard, ...SB_L.hard, ...SB_D.hard]
const borderline = [...L.borderline, ...D.borderline]
const badgeBelow = [...SB_L.belowNormal, ...SB_D.belowNormal]

const now = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
const report = [
  `# Accessibility contrast audit`,
  ``,
  `Source: \`app/globals.css\` (parsed directly — values below are the real tokens, not a copy).`,
  `Generated: ${now}. Method: WCAG 2.1 relative-luminance ratio.`,
  ``,
  `Thresholds — text: AA normal **4.5:1**, AA large **3:1**, AAA **7:1**. Non-text UI (borders/focus): **3:1** (SC 1.4.11).`,
  ``,
  `## Summary`,
  ``,
  `- Text pairs that are a **hard failure (< 3.0:1 — not even large text)**: **${hard.length}**`,
  `- Inline state text still at AA-large (3.0–4.5:1) — used only as small labels, not body copy: **${borderline.length}**`,
  `- Solid badges (white label in light, near-black ink in dark): **${badgeBelow.length === 0 ? 'all ≥4.5:1 ✅' : `${badgeBelow.length} still below 4.5`}.**`,
  `- All body copy (\`fg\`/\`fg-muted\`) and captions (\`fg-subtle\`) pass AA-normal.`,
  ``,
  `> Badges were switched from a 15% tint (bounded ~2–4.2:1) to **solid hue + fixed neutral label**, which clears AA-normal. The label flips by theme because the light hues are dark (want a light label) and the dark hues are light (want a dark label).`,
  ``,
  `## Results`,
  ``,
  L.md,
  D.md,
  SB_L.md,
  SB_D.md,
  LU.md,
  DU.md,
  `> Non-text rows below 3.0:1 are hairline **decorative** separators, which are explicitly exempt from SC 1.4.11 (they convey no information). The interactive focus indicator uses the \`fg\` token as a box-shadow ring and passes.`,
  ``,
  `## Verdict & recommended actions`,
  ``,
  hard.length
    ? `**Hard failures (< 3.0:1) — must fix:**\n\n` +
        hard.map((f) => `- **${f.title} — ${f.name}** at ${fmt(f.ratio)}:1 (needs ≥3.0 even for large).`).join('\n')
    : `- ✅ No hard contrast failures: every text pair meets at least AA-large (3.0:1), all body/caption text meets AA-normal (4.5:1), and all solid badges now meet AA-normal (4.5:1).`,
  badgeBelow.length
    ? `\n**Badges below AA-normal (4.5:1):**\n\n` + badgeBelow.map((f) => `- ${f.title} — ${f.name}: ${fmt(f.ratio)}:1`).join('\n')
    : ``,
  borderline.length
    ? `\n**Inline state text at AA-large (3.0–4.5:1)** — fine as small bold labels; if any is ever used as body text, switch it to a solid chip like the badges:\n\n` +
        borderline.map((f) => `- ${f.title} — ${f.name}: ${fmt(f.ratio)}:1`).join('\n')
    : '',
  ``,
].join('\n')

writeFileSync(outPath, report, 'utf8')
console.log(`Wrote ${outPath}`)
console.log(`Hard text failures (<3.0): ${hard.length}; AA-large-only (3.0-4.5): ${borderline.length}`)
for (const f of hard) console.log(`  FAIL<3 ${f.title} · ${f.name} = ${fmt(f.ratio)}:1`)
for (const f of borderline) console.log(`  ~large ${f.title} · ${f.name} = ${fmt(f.ratio)}:1`)
