import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names and deduplicate Tailwind utilities.
 * `cn('px-2', isActive && 'px-4')` → `'px-4'` (later wins, Tailwind-aware).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Guarded SSR/CSR check used by hooks that touch window/document. */
export const isBrowser = typeof window !== 'undefined'

/** Clamp a number to `[min, max]`. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** Round to `precision` decimal places. */
export function round(value: number, precision = 0) {
  const f = 10 ** precision
  return Math.round(value * f) / f
}

/** Format a number with thousands separators and optional prefix/suffix. */
export function formatNumber(
  value: number,
  opts: { decimals?: number; prefix?: string; suffix?: string } = {},
) {
  const { decimals = 0, prefix = '', suffix = '' } = opts
  return (
    prefix +
    value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix
  )
}
