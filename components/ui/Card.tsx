'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

/**
 * Editorial card container with an optional gradient media slot, header
 * (title + eyebrow + right slot), body, footer and a hover elevation. Pass
 * `interactive` to opt into lift + shine; wrap in an <a>/<button> yourself if
 * the whole card should be clickable.
 */
export function Card({
  children,
  className,
  media,
  eyebrow,
  title,
  headerRight,
  footer,
  interactive = true,
  padded = true,
}: {
  children?: React.ReactNode
  className?: string
  media?: React.ReactNode
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  headerRight?: React.ReactNode
  footer?: React.ReactNode
  interactive?: boolean
  padded?: boolean
}) {
  const reduced = !!useReducedMotion()
  return (
    <motion.div
      whileHover={interactive && !reduced ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'group/card relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-elevation2 transition-shadow hover:shadow-elevation4',
        className,
      )}
    >
      {media ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <motion.div
            className="h-full w-full"
            whileHover={{ scale: reduced ? 1 : 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {media}
          </motion.div>
        </div>
      ) : null}
      {title || eyebrow || headerRight ? (
        <div className={cn('flex items-start justify-between gap-4', padded ? 'p-6 pb-3' : 'px-1 pt-3')}>
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">{eyebrow}</p>
            ) : null}
            <h3 className="mt-1 font-display text-[1.05rem] font-semibold text-fg">{title}</h3>
          </div>
          {headerRight}
        </div>
      ) : null}
      <div className={cn('text-body text-fg-muted', padded ? 'px-6 pb-6' : 'px-1 pb-1')}>
        {children}
      </div>
      {footer ? (
        <div className={cn('mt-auto border-t border-border', padded ? 'px-6 py-4' : 'px-1 py-2')}>
          {footer}
        </div>
      ) : null}
    </motion.div>
  )
}
