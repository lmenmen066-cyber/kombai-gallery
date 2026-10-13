'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const EASE = [0.22, 0.61, 0.36, 1] as const

function points(values: number[], w: number, h: number, pad: number): [number, number][] {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const span = max - min || 1
  const n = values.length
  const innerW = w - pad * 2
  const innerH = h - pad * 2
  return values.map((v, i) => {
    const x = pad + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
    const y = pad + innerH - ((v - min) / span) * innerH
    return [x, y]
  })
}

/** Catmull-Rom → cubic bezier smoothing for a soft, editorial line. */
function smooth(pts: [number, number][]): string {
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }
  return d
}

/**
 * Area + line chart drawn on load via Framer `pathLength` (the stroke writes
 * itself left-to-right), the fill fading in behind it. Uniform viewBox scaling
 * keeps the line crisp; a dot per datapoint staggers in after the draw.
 */
export function AreaLineChart({
  values,
  labels,
  className,
  color = '#c9a3ff',
}: {
  values: number[]
  labels?: string[]
  className?: string
  color?: string
}) {
  const reduced = !!useReducedMotion()
  const gid = React.useId().replace(/:/g, '')
  const W = 640
  const H = 260
  const pad = 22
  const pts = points(values, W, H, pad)
  const line = smooth(pts)
  const area = pts.length
    ? `${line} L ${pts[pts.length - 1][0].toFixed(2)} ${H - pad} L ${pts[0][0].toFixed(2)} ${H - pad} Z`
    : ''
  const grid = [0.25, 0.5, 0.75]

  return (
    <figure className={cn('w-full', className)} aria-label="Line chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {grid.map((g) => (
          <line
            key={g}
            x1={pad}
            x2={W - pad}
            y1={pad + (H - pad * 2) * g}
            y2={pad + (H - pad * 2) * g}
            className="stroke-border"
            strokeWidth={1}
            strokeDasharray="4 6"
            opacity={0.6}
          />
        ))}
        <motion.path
          d={area}
          fill={`url(#fill-${gid})`}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.5, ease: EASE }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}
        />
        {pts.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={3.5}
            fill="white"
            stroke={color}
            strokeWidth={2}
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: reduced ? 0 : 0.6 + i * 0.06, ease: EASE }}
          />
        ))}
      </svg>
      {labels ? (
        <div className="mt-2 flex justify-between px-1 text-[11px] text-fg-subtle">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      ) : null}
    </figure>
  )
}

/** Vertical bar chart — each bar grows from the baseline, staggered. */
export function BarChart({
  data,
  className,
  color = 'var(--accent)',
}: {
  data: { label: string; value: number }[]
  className?: string
  color?: string
}) {
  const reduced = !!useReducedMotion()
  const W = 640
  const H = 260
  const pad = 22
  const max = Math.max(...data.map((d) => d.value), 1)
  const innerW = W - pad * 2
  const innerH = H - pad * 2
  const slot = innerW / data.length
  const barW = Math.min(slot * 0.5, 46)

  return (
    <figure className={cn('w-full', className)} aria-label="Bar chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={pad}
            x2={W - pad}
            y1={pad + innerH - innerH * g}
            y2={pad + innerH - innerH * g}
            className="stroke-border"
            strokeWidth={1}
            strokeDasharray="4 6"
            opacity={0.5}
          />
        ))}
        {data.map((d, i) => {
          const h = (d.value / max) * innerH
          const x = pad + slot * i + (slot - barW) / 2
          const y = pad + innerH - h
          return (
            <g key={d.label}>
              <motion.rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={6}
                fill={color}
                style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
                initial={reduced ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : i * 0.07, ease: EASE }}
              />
              <text
                x={x + barW / 2}
                y={H - 6}
                textAnchor="middle"
                className="fill-current text-fg-subtle"
                style={{ fontSize: 11 }}
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

/** Donut with segments that sweep in via stroke-dashoffset, legend alongside. */
export function DonutChart({
  segments,
  className,
  centerLabel,
}: {
  segments: { label: string; value: number; color: string }[]
  className?: string
  centerLabel?: string
}) {
  const reduced = !!useReducedMotion()
  const size = 220
  const stroke = 22
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0) || 1

  let acc = 0
  const arcs = segments.map((s) => {
    const frac = s.value / total
    const dash = frac * c
    const offset = acc * c
    acc += frac
    return { ...s, dash, offset }
  })

  return (
    <div className={cn('flex flex-col items-center gap-6 sm:flex-row sm:gap-8', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full -rotate-90" role="img" aria-label="Donut chart">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-border/60" />
          {arcs.map((a) => (
            <motion.circle
              key={a.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${a.dash} ${c - a.dash}`}
              initial={reduced ? false : { strokeDashoffset: -c }}
              animate={{ strokeDashoffset: -a.offset }}
              transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-fg">{total}</div>
            {centerLabel ? <div className="text-caption text-fg-subtle">{centerLabel}</div> : null}
          </div>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-2.5">
        {arcs.map((a) => (
          <li key={a.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
            <span className="text-fg-muted">{a.label}</span>
            <span className="ml-auto font-medium tabular-nums text-fg">
              {Math.round((a.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
