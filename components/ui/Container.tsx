import * as React from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Centered max-width container with responsive gutters.
 * `bleed` breaks out of the container for full-bleed sections if needed.
 */
export function Container({
  className,
  children,
  size = 'lg',
}: {
  className?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}) {
  const max = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-[84rem]',
    full: 'max-w-none',
  }[size]
  return <div className={cn('mx-auto w-full px-gutter', max, className)}>{children}</div>
}
