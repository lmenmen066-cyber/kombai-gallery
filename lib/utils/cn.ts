import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// This theme defines custom font-size utilities (text-caption/body/lead/h1/h2/h3/
// display). By default tailwind-merge can't tell those from text-COLOR utilities,
// so it would treat `text-caption` and `text-white` as the same group and drop the
// earlier one (e.g. silently removing a badge's `text-white`). Register our scale
// as font-size so sizes merge against sizes and colors against colors.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['caption', 'body', 'lead', 'h1', 'h2', 'h3', 'display'] }],
    },
  },
})

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
