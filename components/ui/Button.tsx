'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'link'
type Size = 'sm' | 'md' | 'lg'

const base =
  'relative inline-flex items-center justify-center gap-2 font-medium select-none ' +
  'transition-colors duration-200 ease-quiet focus-visible:outline-none ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-contrast rounded-lg shadow-elevation2 hover:shadow-elevation4',
  secondary: 'bg-surface-raised text-fg border border-border rounded-lg hover:bg-surface',
  outline: 'border border-fg text-fg rounded-lg hover:bg-fg hover:text-fg-inverse',
  ghost: 'text-fg-muted rounded-lg hover:text-fg hover:bg-surface-raised',
  link: 'text-fg underline-offset-4 hover:underline px-0 rounded-none',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-[0.9rem]',
  md: 'h-11 px-5 text-[0.98rem]',
  lg: 'h-12 px-6 text-base',
}

type ButtonBaseProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  fullWidth?: boolean
  /** Adds a sweep highlight on hover + subtle scale on press. */
  interactive?: boolean
}

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; asChild?: false }
type ButtonAsLink = ButtonBaseProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href'
  > & { asChild?: false }

/**
 * Editorial button: near-black primary CTA, quiet springs, and a
 * `primary`-only shine sweep that respects `prefers-reduced-motion`.
 * Renders an <a> when `href` is provided (uses next/link), else a <button>.
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    fullWidth,
    interactive = true,
    ...rest
  } = props
  const reduced = !!useReducedMotion()

  const classes = cn(
    base,
    variants[variant],
    variant !== 'link' && sizes[size],
    fullWidth && 'w-full',
    className,
  )

  const motionProps = interactive
    ? {
        whileHover: reduced ? undefined : { scale: variant === 'link' ? 1 : 1.02 },
        whileTap: reduced ? undefined : { scale: 0.97 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 24 },
      }
    : {}

  const inner = (
    <>
      {variant === 'primary' && !reduced ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-quiet group-hover/btn:translate-x-full" />
        </span>
      ) : null}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  )

  if ('href' in props && typeof props.href === 'string') {
    const { href, ...aRest } = props as ButtonAsLink
    return (
      <motion.div {...motionProps} className={cn('inline-flex', fullWidth && 'w-full')}>
        <Link
          href={href}
          {...(aRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          className={cn(classes, 'group/btn')}
        >
          {inner}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      {...(rest as React.ComponentProps<typeof motion.button>)}
      {...motionProps}
      className={cn(classes, 'group/btn')}
    >
      {inner}
    </motion.button>
  )
}
