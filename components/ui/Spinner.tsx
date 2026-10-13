'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

/**
 * Circular spinner for button/loading states. Pure transform (rotate) so it
 * stays GPU-composited. `label` sets the accessible description; when omitted
 * it is treated as decorative (`aria-hidden`).
 */
export function Spinner({
  size = 16,
  className,
  label,
}: {
  size?: number
  className?: string
  label?: string
}) {
  const reduced = !!useReducedMotion()
  return (
    <motion.span
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      animate={reduced ? undefined : { rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
      className={cn(
        'inline-block rounded-full border-2 border-current border-t-transparent',
        className,
      )}
      style={{ width: size, height: size }}
    />
  )
}
