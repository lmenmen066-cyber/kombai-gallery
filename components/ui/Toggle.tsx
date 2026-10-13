'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

/**
 * Accessible toggle switch. Uses `role="switch"` + `aria-checked`; the thumb
 * slides with a spring and the track colour crossfades. Sizes: sm/md/lg.
 * Reduced-motion swaps the spring for an instant jump.
 */
export function Toggle({
  checked,
  onChange,
  disabled,
  size = 'md',
  label,
  id,
  className,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  id?: string
  className?: string
}) {
  const reduced = !!useReducedMotion()
  const dims = {
    sm: { track: 'h-5 w-9 p-0.5', thumb: 'h-4 w-4', shift: 16 },
    md: { track: 'h-7 w-12 p-1', thumb: 'h-5 w-5', shift: 20 },
    lg: { track: 'h-8 w-14 p-1', thumb: 'h-6 w-6', shift: 24 },
  }[size]

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex items-center rounded-full transition-colors duration-200 outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        dims.track,
        checked ? 'bg-accent' : 'bg-border',
        className,
      )}
    >
      <motion.span
        layout={!reduced}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 32 }}
        animate={{ x: checked ? dims.shift : 0 }}
        className={cn(
          'block rounded-full bg-white shadow-elevation2',
          dims.thumb,
        )}
      />
    </button>
  )
}
