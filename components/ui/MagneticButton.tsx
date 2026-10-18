'use client'

import * as React from 'react'
import { motion, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useMagnetic } from '@/lib/hooks/useMagnetic'

/**
 * A Button that leans toward the cursor as it approaches — the whole control
 * follows the pointer (spring via `useMagnetic`), while the label rides along at
 * ~40% for a subtle sense of depth. It falls back to a plain Button with zero
 * movement under `prefers-reduced-motion`, and outside a small radius it snaps
 * back to rest, so it reads as polish rather than a gimmick.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  type,
  disabled,
  variant = 'primary',
  size = 'md',
  fullWidth,
  interactive = true,
  className,
  strength = 0.35,
  radius = 120,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode
  href?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  interactive?: boolean
  className?: string
  strength?: number
  radius?: number
  'aria-label'?: string
}) {
  const { ref, x, y } = useMagnetic<HTMLSpanElement>(strength, radius)
  const innerX = useTransform(x, (v) => v * 0.4)
  const innerY = useTransform(y, (v) => v * 0.4)

  return (
    <motion.span ref={ref} style={{ x, y }} className="relative inline-flex will-change-transform">
      <Button
        href={href}
        onClick={onClick}
        type={type}
        disabled={disabled}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        interactive={interactive}
        className={className}
        aria-label={ariaLabel}
      >
        <motion.span style={{ x: innerX, y: innerY }} className="inline-flex items-center gap-2">
          {children}
        </motion.span>
      </Button>
    </motion.span>
  )
}
