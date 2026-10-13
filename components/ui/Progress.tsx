'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { clamp } from '@/lib/utils/cn'

/**
 * Linear and radial progress. Both accept 0..100 (clamped), expose
 * `role="progressbar"` with ARIA, and animate width / stroke-dashoffset with
 * the shared quiet timing curve. Reduced-motion snaps instantly.
 * `indeterminate` shows a looping pulse instead of a fixed fill.
 */
export function ProgressBar({
  value,
  indeterminate,
  className,
  label,
}: {
  value?: number
  indeterminate?: boolean
  className?: string
  label?: string
}) {
  const reduced = !!useReducedMotion()
  const pct = clamp(value ?? 0, 0, 100)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      aria-label={label}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-border/70', className)}
    >
      {indeterminate ? (
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-accent"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: reduced ? 0 : 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : (
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        />
      )}
    </div>
  )
}

/**
 * Circular progress — SVG stroke-dashoffset driven by `value`. Optional center
 * readout. Radius defaults are tuned for a 96px box but can be overridden.
 */
export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  className,
  formatValue = (v) => `${Math.round(v)}%`,
}: {
  value: number
  size?: number
  stroke?: number
  className?: string
  formatValue?: (v: number) => React.ReactNode
}) {
  const reduced = !!useReducedMotion()
  const pct = clamp(value ?? 0, 0, 100)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - pct / 100)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-border/70" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="fill-none stroke-accent"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={reduced ? { duration: 0 } : { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-[1.05rem] font-semibold text-fg">
        {formatValue(pct)}
      </span>
    </div>
  )
}
