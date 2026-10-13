'use client'

import * as React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/** Fixed top progress bar tied to page scroll — quiet, 2px, brand gradient. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.4 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand"
    />
  )
}
