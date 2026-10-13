'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useScrollPosition } from '@/lib/hooks/useScrollReveal'

/** Appears after ~500px of scroll; smooth-scrolls back to top. */
export function BackToTop() {
  const show = useScrollPosition(500)
  const reduced = !!useReducedMotion()
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          whileHover={reduced ? undefined : { y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-border bg-surface-raised text-fg shadow-elevation3 transition-colors hover:bg-surface"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
