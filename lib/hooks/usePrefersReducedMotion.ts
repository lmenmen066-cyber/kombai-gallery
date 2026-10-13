'use client'

import { useEffect, useState } from 'react'
import { isBrowser } from '@/lib/utils/cn'

/**
 * Reactively reports the user's `prefers-reduced-motion` OS setting.
 *
 * Every animation in this system consults the returned boolean and collapses
 * y/x offsets / long durations to `0` / `120ms` when true — so the same tree
 * renders without motion for users who asked for it.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (!isBrowser) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (!isBrowser) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
