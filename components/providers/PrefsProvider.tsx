'use client'

import * as React from 'react'
import { MotionConfig } from 'framer-motion'
import { usePrefs, motionToReducedMotion } from '@/lib/store/prefs'

const STORAGE_KEY = 'kg.prefs'

/**
 * Wraps the tree in a Framer <MotionConfig> whose `reducedMotion` follows the
 * user's in-app preference (auto = respect OS, reduce = force on, full = force
 * off), and keeps that preference + the cursor toggle in localStorage. Because
 * the store's server default is `auto`, SSR markup is deterministic; we hydrate
 * from storage only after mount (and never write before we've read).
 */
export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const motion = usePrefs((s) => s.motion)
  const cursor = usePrefs((s) => s.cursor)
  const hydrate = usePrefs((s) => s.hydrate)
  const ready = React.useRef(false)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const p = JSON.parse(raw) as { motion?: unknown; cursor?: unknown }
        hydrate({
          motion: p.motion === 'reduce' || p.motion === 'full' || p.motion === 'auto' ? p.motion : undefined,
          cursor: typeof p.cursor === 'boolean' ? p.cursor : undefined,
        })
      }
    } catch {
      /* ignore malformed / unavailable storage */
    }
    ready.current = true
  }, [hydrate])

  React.useEffect(() => {
    if (!ready.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ motion, cursor }))
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [motion, cursor])

  return <MotionConfig reducedMotion={motionToReducedMotion(motion)}>{children}</MotionConfig>
}
