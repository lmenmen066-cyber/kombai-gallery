'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { fadeUp, pickMotionVariant } from '@/lib/motion/variants'
import { useReducedMotion } from 'framer-motion'

/**
 * Vertical section rhythm with an optional scroll-reveal. `tone` just paints a
 * different background from the token palette; all keep editorial generosity.
 */
export function Section({
  children,
  className,
  id,
  tone = 'default',
  reveal = true,
  as: Tag = 'section',
}: {
  children: React.ReactNode
  className?: string
  id?: string
  tone?: 'default' | 'raised' | 'inverse' | 'grid'
  reveal?: boolean
  as?: 'section' | 'div' | 'footer' | 'header'
}) {
  const reduced = !!useReducedMotion()
  const MotionTag = motion[Tag] as typeof motion.section
  const tones: Record<string, string> = {
    default: '',
    raised: 'bg-surface-raised',
    inverse: 'bg-surface-inverse text-fg-inverse',
    grid: 'relative overflow-hidden',
  }
  const inner = (
    <div className={cn('relative py-section', tones[tone], className)} id={id}>
      {tone === 'grid' ? <div aria-hidden className="absolute inset-0 hairline-grid" /> : null}
      <div className="relative">{children}</div>
    </div>
  )
  if (!reveal) return React.createElement(Tag, { className: 'w-full' }, inner)
  return (
    <MotionTag
      variants={pickMotionVariant(fadeUp, reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.15, once: true }}
      className="w-full"
    >
      {inner}
    </MotionTag>
  )
}

/** Small overline label above headings — used across sections. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-caption font-medium uppercase tracking-[0.18em] text-fg-muted',
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-border-strong" />
      {children}
    </span>
  )
}

/** Section heading + optional lede, sized with the fluid type scale. */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = 'left',
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-h2 max-w-[22ch]">{title}</h2>
      {lede ? <p className="text-lead text-fg-muted max-w-[56ch]">{lede}</p> : null}
    </div>
  )
}
