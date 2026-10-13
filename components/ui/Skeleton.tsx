'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Shimmer placeholder. `block`/`line`/`circle` variants for compositing a
 * skeleton that mirrors a real layout. The sweep animation is CSS-only and
 * auto-disabled by the global prefers-reduced-motion override in globals.css.
 */
export function Skeleton({
  className,
  shape = 'block',
  lines,
}: {
  className?: string
  shape?: 'block' | 'line' | 'circle'
  lines?: number
}) {
  if (shape === 'circle') {
    return <span className={cn('inline-block rounded-full bg-border/60', className)} aria-hidden />
  }
  if (lines && lines > 0) {
    return (
      <div className={cn('space-y-2', className)} aria-hidden>
        {Array.from({ length: lines }).map((_, i) => (
          <Shimmer key={i} className={cn('h-3.5 rounded-md', i === lines - 1 && 'w-2/3')} />
        ))}
      </div>
    )
  }
  return <Shimmer className={cn('rounded-md', className)} />
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('shimmer bg-border/50', className)}
      style={{
        backgroundImage:
          'linear-gradient(90deg, hsl(var(--border)/0.35) 25%, hsl(var(--border)/0.7) 37%, hsl(var(--border)/0.35) 63%)',
        backgroundSize: '400% 100%',
      }}
    />
  )
}
