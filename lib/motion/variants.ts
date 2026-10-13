import type { Transition, Variants } from 'framer-motion'

/**
 * Shared Framer Motion variants — the "quiet, editorial" motion language.
 *
 * Rules:
 *  - Only `opacity` + `transform` animate (GPU-composited).
 *  - Springs are gentle (stiffness 220–280, damping 26–30) so elements glide
 *    instead of overshooting.
 *  - `reduced` variants collapse offsets and durations to near-zero.
 */

export const EASE_OUT = [0.22, 0.61, 0.36, 1] as const
export const EASE_SPRINGY = [0.34, 1.56, 0.64, 1] as const

export const transitionQuiet: Transition = {
  duration: 0.45,
  ease: EASE_OUT,
}

export const transitionSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
  mass: 0.9,
}

export const transitionReduced: Transition = { duration: 0.12, ease: 'linear' }

/** Fade + slide-up. Use on individual reveal items. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: transitionQuiet },
  reduced: { opacity: 1, y: 0, transition: transitionReduced },
}

/** Plain fade — for backdrops, overlays, colour swaps. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionQuiet },
  reduced: { opacity: 1, transition: transitionReduced },
}

/** Slide in from left/right, used by drawers and mobile menus. */
export const slideIn = (dir: 'left' | 'right' = 'left'): Variants => ({
  hidden: { opacity: 0, x: dir === 'left' ? -16 : 16 },
  visible: { opacity: 1, x: 0, transition: transitionQuiet },
  reduced: { opacity: 1, x: 0, transition: transitionReduced },
})

/** Parent that staggers its children's reveal. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
  reduced: { transition: { duration: 0 } },
})

/**
 * Pick the right variant set for the user's motion preference.
 * When reduced is true we swap `visible` for the `reduced` variant.
 */
export function pickMotionVariant(variants: Variants, reduced: boolean) {
  if (!reduced) return variants
  // Collapse offsets and durations while keeping the same visible/hidden labels.
  const reduceOne = (v: unknown) => {
    if (typeof v !== 'object' || v === null) return v
    const obj: Record<string, unknown> = { ...(v as Record<string, unknown>) }
    if ('y' in obj) obj.y = 0
    if ('x' in obj) obj.x = 0
    if ('scale' in obj) obj.scale = 1
    obj.opacity = 1
    obj.transition = transitionReduced
    return obj
  }
  return {
    hidden: variants.hidden,
    visible: reduceOne(variants.visible),
  } as Variants
}
