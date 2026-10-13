import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'brand'
type Size = 'xs' | 'sm' | 'md'

const toneClass: Record<Tone, string> = {
  default: 'bg-border text-fg',
  outline: 'border border-border text-fg-muted bg-transparent',
  brand: 'bg-gradient-to-r from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] text-[#1a1a1a] font-semibold',
  // Solid chips: white label on the (dark) light-theme hues, near-black ink on
  // the (light) dark-theme hues — verified ≥4.5:1 for every tone/theme.
  success: 'bg-success text-white dark:text-[#111318]',
  warning: 'bg-warning text-white dark:text-[#111318]',
  danger: 'bg-danger text-white dark:text-[#111318]',
  info: 'bg-info text-white dark:text-[#111318]',
}

const sizeClass: Record<Size, string> = {
  xs: 'px-1.5 h-4 text-[10px] tracking-wide',
  sm: 'px-2 h-5 text-caption',
  md: 'px-2.5 h-6 text-[0.78rem]',
}

/**
 * Small labelling chip. Optional `dot` for status, `count` renders a numeric
 * pill, and `as` lets you semantically promote it to a span or div.
 */
export function Badge({
  children,
  tone = 'default',
  size = 'sm',
  dot,
  className,
  as: Tag = 'span',
}: {
  children: React.ReactNode
  tone?: Tone
  size?: Size
  dot?: boolean
  className?: string
  as?: 'span' | 'div'
}) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium leading-none',
        toneClass[tone],
        sizeClass[size],
        className,
      )}
    >
      {dot ? <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full bg-current opacity-80')} /> : null}
      {children}
    </Tag>
  )
}
