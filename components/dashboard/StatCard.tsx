'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { fadeUp, pickMotionVariant } from '@/lib/motion/variants'

/**
 * Dashboard KPI tile. Reveals with the shared fade-up, then counts its value up
 * once it scrolls into view (IntersectionObserver-gated so the count doesn't
 * finish off-screen). A signed delta renders a directional badge.
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  delta,
  className,
}: {
  icon: LucideIcon
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  delta?: number
  className?: string
}) {
  const reduced = !!useReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [start, setStart] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStart(true), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const n = useCountUp(value, { start, precision: decimals, duration: 1400 })
  const up = (delta ?? 0) >= 0

  return (
    <motion.div
      ref={ref}
      variants={pickMotionVariant(fadeUp, reduced)}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={cn('surface-card flex flex-col gap-3 p-5', className)}
    >
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-border text-fg">
          <Icon className="h-4 w-4" />
        </span>
        {delta !== undefined ? (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-caption font-medium tabular-nums',
              up ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger',
            )}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        ) : null}
      </div>
      <div>
        <div className="font-display text-3xl font-bold tabular-nums tracking-tight text-fg">
          {prefix}
          {n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
          {suffix}
        </div>
        <div className="mt-1 text-sm text-fg-muted">{label}</div>
      </div>
    </motion.div>
  )
}
