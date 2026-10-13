'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const TRIGGER_BASE = 'kg-tooltip'

/**
 * Tooltip on Radix (delay, focus/hover/keyboard, positioning, ARIA) with a
 * quiet Framer entrance (fade + tiny scale/offset). Wrap consumers in
 * `<TooltipProvider>` — or use the self-contained `Tooltip` convenience below.
 */
export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent({
  children,
  side = 'top',
  className,
}: {
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}) {
  const reduced = !!useReducedMotion()
  const offset = { top: { y: 4 }, bottom: { y: -4 }, left: { x: 4 }, right: { x: -4 } }[side]
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={8}
        collisionPadding={12}
        className="z-[80]"
        asChild
      >
        <motion.div
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, ...offset, scale: 0.98 },
                animate: { opacity: 1, x: 0, y: 0, scale: 1 },
                exit: { opacity: 0, ...offset, scale: 0.98 },
              })}
          transition={{ duration: reduced ? 0 : 0.16, ease: [0.22, 0.61, 0.36, 1] }}
          className={cn(
            'rounded-lg bg-surface-inverse px-3 py-1.5 text-[0.8rem] font-medium text-fg-inverse shadow-elevation4',
            className,
          )}
        >
          {children}
          <TooltipPrimitive.Arrow
            width={12}
            height={6}
            className="fill-surface-inverse"
          />
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

/** One-shot convenience: pass a trigger + label; includes its own Provider. */
export function Tooltip({
  label,
  children,
  side = 'top',
}: {
  label: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}) {
  const uid = React.useId()
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild id={`${TRIGGER_BASE}-${uid}`}>
          {children as React.ReactElement}
        </TooltipPrimitive.Trigger>
        <TooltipContent side={side}>{label}</TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}
