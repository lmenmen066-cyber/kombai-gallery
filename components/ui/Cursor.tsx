'use client'

import * as React from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { usePrefs } from '@/lib/store/prefs'

// A CSS-selector "cluster" for anything the cursor should react to.
const INTERACTIVE =
  'a, button, [role="button"], [role="switch"], [role="tab"], input, textarea, select, label, summary, [data-cursor]'

/**
 * Custom cursor: a precise inner dot plus a spring-lagged ring. Over any
 * interactive element the ring swells (and shows a short `data-cursor` label,
 * e.g. "View"), and it contracts briefly on press. It mounts only when the
 * device reports a fine pointer AND the user hasn't asked for reduced motion —
 * otherwise the native cursor stays and this renders nothing. It also toggles
 * `html.kg-cursor`, which is the only thing that hides the native pointer, so a
 * JS failure can never leave the user cursor-less.
 */
export function Cursor() {
  const reduced = !!useReducedMotion()
  const enabled = usePrefs((s) => s.cursor)
  const [mounted, setMounted] = React.useState(false)
  const [hover, setHover] = React.useState(false)
  const [down, setDown] = React.useState(false)
  const [label, setLabel] = React.useState<string | null>(null)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 320, damping: 26, mass: 0.5 })
  const ringY = useSpring(dotY, { stiffness: 320, damping: 26, mass: 0.5 })

  React.useEffect(() => {
    if (!enabled || reduced) {
      document.documentElement.classList.remove('kg-cursor')
      setMounted(false)
      return
    }
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    const root = document.documentElement
    root.classList.add('kg-cursor')
    setMounted(true)

    const move = (e: PointerEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE)
      if (el) {
        setHover(true)
        setLabel(el.getAttribute('data-cursor'))
      } else {
        setHover(false)
        setLabel(null)
      }
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    const onLeave = () => setMounted(false)
    const onEnter = () => setMounted(true)
    const onMq = (ev: MediaQueryListEvent) => {
      if (ev.matches) {
        root.classList.add('kg-cursor')
        setMounted(true)
      } else {
        root.classList.remove('kg-cursor')
        setMounted(false)
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    mq.addEventListener('change', onMq)
    return () => {
      root.classList.remove('kg-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      mq.removeEventListener('change', onMq)
    }
  }, [reduced, enabled, dotX, dotY])

  if (!mounted) return null

  return (
    <>
      {/* lagging ring / halo */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white"
          animate={{
            width: hover ? 56 : 34,
            height: hover ? 56 : 34,
            backgroundColor: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0)',
            scale: down ? 0.82 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ marginLeft: 0, marginTop: 0 }}
        >
          {label ? (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white">{label}</span>
          ) : null}
        </motion.div>
      </motion.div>

      {/* precise dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ x: dotX, y: dotY }}
        animate={{ scale: hover ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-white" />
      </motion.div>
    </>
  )
}
