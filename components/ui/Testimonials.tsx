'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { fadeUp, staggerContainer, pickMotionVariant } from '@/lib/motion/variants'

export type Testimonial = {
  name: string
  role: string
  quote: string
  rating: number
  from: string
  to: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Aria Fontaine',
    role: 'Design Lead, Northwind',
    quote:
      'It quietly removed a week of debate. The tokens made the whole team agree on spacing and colour without a single pixel-pushing argument.',
    rating: 5,
    from: '#f5c9a0',
    to: '#c9a3ff',
  },
  {
    name: 'Devon Park',
    role: 'Frontend Engineer, Loop',
    quote: 'Motion presets that respect reduced-motion out of the box. I stopped hand-tuning every transition.',
    rating: 5,
    from: '#a4d1ff',
    to: '#84fab0',
  },
  {
    name: 'Mireia Sol',
    role: 'Founder, Cadence',
    quote:
      'We shipped a marketing site and an app shell from the same primitives. Consistency for free — the fluid type scale alone saved hours on responsive tuning.',
    rating: 4,
    from: '#c9a3ff',
    to: '#a4d1ff',
  },
  {
    name: 'Tobias Reyner',
    role: 'PM, Fieldnote',
    quote: 'Accessible overlays that just work with a keyboard. Our audit passed without remediation tickets.',
    rating: 5,
    from: '#ff9a9e',
    to: '#fbc2eb',
  },
  {
    name: 'Hana Ozturk',
    role: 'Staff Designer, Vantage',
    quote: 'Dark mode was one class swap. Nothing else in our stack had gotten that right.',
    rating: 5,
    from: '#84fab0',
    to: '#8fd3f4',
  },
  {
    name: 'Marcus Vale',
    role: 'CTO, Sable Labs',
    quote:
      'Primitives so small they disappear into the page. The bundle stays lean and the design language stays coherent across two products.',
    rating: 4,
    from: '#f6d365',
    to: '#fda085',
  },
]

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Stars({ rating, reduced }: { rating: number; reduced: boolean }) {
  return (
    <motion.div
      variants={pickMotionVariant(staggerContainer(0.12, 0.15), reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const on = i < rating
        return (
          <span key={i} className="relative grid place-items-center">
            <Star className="h-4 w-4 text-fg-subtle/40" strokeWidth={1.5} />
            {on ? (
              <motion.span
                variants={{
                  hidden: reduced ? { opacity: 1 } : { opacity: 0, scale: 0.4 },
                  visible: reduced ? { opacity: 1 } : { opacity: 1, scale: 1 },
                }}
                className="absolute inset-0"
              >
                <Star className="h-4 w-4 text-[#e8a33d]" fill="currentColor" strokeWidth={0} />
              </motion.span>
            ) : null}
          </span>
        )
      })}
    </motion.div>
  )
}

function Tile({ t, reduced }: { t: Testimonial; reduced: boolean }) {
  return (
    <motion.figure
      variants={pickMotionVariant(fadeUp, reduced)}
      whileHover={reduced ? undefined : { rotate: t.rating % 2 ? -0.7 : 0.7, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="surface-card mb-5 break-inside-avoid p-6 transition-shadow hover:shadow-elevation4"
    >
      <Quote className="h-6 w-6 text-fg-subtle/40" aria-hidden />
      <blockquote className="mt-3 text-[0.98rem] leading-relaxed text-fg">{t.quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white shadow-elevation1"
          style={{ backgroundImage: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
        >
          {initials(t.name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-fg">{t.name}</span>
          <span className="block truncate text-caption text-fg-subtle">{t.role}</span>
        </span>
        <span className="ml-auto">
          <Stars rating={t.rating} reduced={reduced} />
        </span>
      </figcaption>
    </motion.figure>
  )
}

/**
 * Testimonial wall — a responsive CSS-columns masonry (no JS layout math),
 * gradient-initial avatars, a decorative quote glyph, and star ratings that
 * light up one-by-one as each card scrolls into view. Cards tilt and lift a
 * hair on hover; all of it is inert under `prefers-reduced-motion`.
 */
export function TestimonialWall({
  items = TESTIMONIALS,
  className,
}: {
  items?: Testimonial[]
  className?: string
}) {
  const reduced = !!useReducedMotion()
  return (
    <motion.div
      variants={pickMotionVariant(staggerContainer(0.08), reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.15, once: true }}
      className={cn('columns-1 gap-5 sm:columns-2 lg:columns-3', className)}
    >
      {items.map((t) => (
        <Tile key={t.name} t={t} reduced={reduced} />
      ))}
    </motion.div>
  )
}
