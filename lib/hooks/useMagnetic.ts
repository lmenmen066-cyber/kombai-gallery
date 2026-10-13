'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Magnetic pointer-follow for a target element.
 *
 * Returns `ref` to attach to the container that captures mousemove, and
 * motion values `x`/`y` you apply to an inner element. The magnetic pull is
 * subtle (default strength 0.18, radius 90px) so it reads as polish, not
 * gimmick. Disabled entirely under `prefers-reduced-motion`.
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  strength = 0.18,
  radius = 90,
) {
  const ref = useRef<T | null>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const reduced = !!useReducedMotion()
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.6 })

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let frame = 0
    const onMove = (ev: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = ev.clientX - cx
      const dy = ev.clientY - cy
      const dist = Math.hypot(dx, dy)
      const max = Math.max(r.width, r.height) / 2 + radius
      if (dist > max) {
        rawX.set(0)
        rawY.set(0)
        return
      }
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        rawX.set(dx * strength)
        rawY.set(dy * strength)
      })
    }
    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }
    window.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [rawX, rawY, radius, reduced, strength])

  return { ref, x, y }
}
