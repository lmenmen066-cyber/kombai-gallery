'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Animated number that RE-runs every time `target` changes, easing from the
 * value currently on screen to the new target. Unlike `useCountUp` (which
 * guards itself to fire once for a scroll reveal), this is meant for values
 * that change in place — e.g. a price swapping between monthly and annual.
 *
 * Falls back to an instant jump under `prefers-reduced-motion`.
 */
export function useAnimatedNumber(
  target: number,
  opts: { duration?: number; precision?: number } = {},
): number {
  const { duration = 600, precision = 0 } = opts
  const reduced = !!useReducedMotion()
  const [value, setValue] = useState(target)
  const displayRef = useRef(target) // last value actually shown
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    displayRef.current = value
  })

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }
    const from = displayRef.current
    if (from === target) return
    const t0 = performance.now()
    const f = 10 ** precision
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(Math.round((from + (target - from) * eased) * f) / f)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // value intentionally omitted: we snapshot it via displayRef on each render
    // so a running animation isn't restarted by its own state updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduced, duration, precision])

  return value
}
