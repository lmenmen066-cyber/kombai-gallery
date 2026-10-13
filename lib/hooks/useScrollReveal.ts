'use client'

import * as React from 'react'
import { useReducedMotion } from 'framer-motion'
import { fadeUp, pickMotionVariant, staggerContainer } from '@/lib/motion/variants'
import type { Variants } from 'framer-motion'

/**
 * Convenience wrapper for a single scroll-reveal element.
 *
 * Returns `{ ref, motionProps }` — spread `motionProps` onto a
 * `motion.div`/`motion.section` and set the returned `ref` on it too.
 * Honors `prefers-reduced-motion` automatically.
 */
export function useScrollReveal(
  amount = 0.25,
  once = true,
): {
  motionProps: {
    variants: Variants
    initial: 'hidden'
    whileInView: 'visible'
    viewport: { amount: number; once: boolean }
  }
  reduced: boolean
} {
  const reduced = !!useReducedMotion()
  return {
    reduced,
    motionProps: {
      variants: pickMotionVariant(fadeUp, reduced),
      initial: 'hidden' as const,
      whileInView: 'visible' as const,
      viewport: { amount, once },
    },
  }
}

/**
 * Container + child variant pair for staggered list reveals.
 *
 * Usage:
 *   <motion.ul {...stagger.root}>
 *     {items.map((i) => <motion.li {...stagger.child}>{i}</motion.li>)}
 *   </motion.ul>
 */
export function useStaggeredAnimation(stagger = 0.08, delay = 0) {
  const reduced = !!useReducedMotion()
  const container = pickMotionVariant(staggerContainer(stagger, delay), reduced)
  const child = pickMotionVariant(fadeUp, reduced)
  return {
    reduced,
    root: {
      variants: container,
      initial: 'hidden' as const,
      whileInView: 'visible' as const,
      viewport: { amount: 0.2, once: true },
    },
    child: { variants: child },
  }
}

/** Returns true once the page is scrolled past `threshold` pixels. */
export function useScrollPosition(threshold = 400): boolean {
  const [past, setPast] = React.useState(false)
  React.useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return past
}
