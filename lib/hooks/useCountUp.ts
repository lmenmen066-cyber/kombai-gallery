'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Animate a number toward `target` — spring-based count-up.
 *
 * Returns a live `current` value (rounded per `precision`) you can drop into
 * any text node. Honors `prefers-reduced-motion`: if the user prefers reduced
 * motion, jumps straight to `target`. `start` triggers the animation — flip
 * it to re-run.
 */
export function useCountUp(
  target: number,
  opts: { duration?: number; precision?: number; start?: boolean } = {},
) {
  const { duration = 1200, precision = 0, start = true } = opts
  const reduced = !!useReducedMotion()
  const [value, setValue] = useState<number>(0)
  const rafRef = useRef<number | null>(null)
  const fromRef = useRef<number>(0)
  const startedRef = useRef<boolean>(false)

  useEffect(() => {
    if (!start) return
    if (reduced) {
      setValue(target)
      return
    }
    if (startedRef.current) return
    startedRef.current = true
    fromRef.current = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      // easeOutCubic — quick start, gentle settle.
      const eased = 1 - Math.pow(1 - p, 3)
      const v = fromRef.current + (target - fromRef.current) * eased
      const f = 10 ** precision
      setValue(Math.round(v * f) / f)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, start, reduced, duration, precision])

  return value
}
