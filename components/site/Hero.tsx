'use client'

import * as React from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Eyebrow } from '@/components/ui/Section'
import { fadeUp, pickMotionVariant } from '@/lib/motion/variants'

const ROTATING = ['design system', 'motion language', 'component kit', 'editorial layout']

/** Typewriter that cycles the rotating words; static when reduced-motion. */
function Typewriter({ words }: { words: string[] }) {
  const reduced = !!useReducedMotion()
  const [index, setIndex] = React.useState(0)
  const [text, setText] = React.useState('')
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    if (reduced) {
      setText(words[0])
      return
    }
    const full = words[index % words.length]
    let timeout: ReturnType<typeof setTimeout>
    if (!deleting && text === full) {
      timeout = setTimeout(() => setDeleting(true), 1500)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => i + 1)
    } else {
      timeout = setTimeout(
        () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
        deleting ? 40 : 85,
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words, reduced])

  return (
    <span className="inline-flex items-baseline">
      <span className="brand-gradient-text">{text}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-fg/60 animate-caret"
      />
    </span>
  )
}

export function Hero() {
  const reduced = !!useReducedMotion()
  const { scrollY } = useScroll()
  const blobY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 120])
  const lines = ['A quiet, editorial', 'interface for'] as const

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-section">
      {/* decorative gradient glow, parallaxed on scroll */}
      <motion.div
        aria-hidden
        style={{ y: blobY }}
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[520px] bg-radial opacity-90"
      />
      <div aria-hidden className="absolute inset-0 -z-10 hairline-grid opacity-40" />

      <Container>
        <motion.div
          variants={pickMotionVariant(
            { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } },
            reduced,
          )}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={pickMotionVariant(fadeUp, reduced)}>
            <Eyebrow className="mb-6 justify-center">
              <Sparkles className="h-3.5 w-3.5" />
              Kombai-inspired · Next.js 14 · Motion
            </Eyebrow>
          </motion.div>

          <motion.h1
            variants={pickMotionVariant(fadeUp, reduced)}
            className="text-display font-display font-bold"
          >
            {lines[0]}
            <br />
            {lines[1]}{' '}
            <span className="relative whitespace-nowrap">
              <Typewriter words={ROTATING} />
            </span>
          </motion.h1>

          <motion.p
            variants={pickMotionVariant(fadeUp, reduced)}
            className="mt-6 max-w-[52ch] text-lead text-fg-muted"
          >
            A light-first, typography-led design system with restrained motion, real accessibility,
            and a warm-to-cool gradient accent — every token and component built to feel calm,
            considered, and unmistakably editorial.
          </motion.p>

          <motion.div
            variants={pickMotionVariant(fadeUp, reduced)}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <MagneticButton href="#get-started" size="lg" strength={0.28} radius={120}>
              Start building
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <Button href="#showcase" variant="secondary" size="lg">
              Explore components
            </Button>
          </motion.div>

          <motion.div
            variants={pickMotionVariant(fadeUp, reduced)}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-caption text-fg-subtle"
          >
            {['prefers-reduced-motion aware', 'WCAG focus states', 'Dark mode', 'Type-safe'].map(
              (t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-fg-subtle" />
                  {t}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
