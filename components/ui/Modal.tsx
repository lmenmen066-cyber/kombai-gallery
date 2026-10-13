'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * Accessible modal on Radix Dialog (focus trap, ESC, scroll lock, aria) with a
 * quiet Framer Motion entrance — overlay fades, panel scales/fades in.
 * `forceMount` + `present`-style AnimatePresence lets the *exit* animation play.
 * Honors prefers-reduced-motion by collapsing transitions to instant.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
}) {
  const reduced = !!useReducedMotion()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <AnimatePresence>
          {open ? (
            <DialogPrimitive.Overlay asChild key="overlay">
              <motion.div
                {...(reduced
                  ? {}
                  : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } })}
                transition={{ duration: reduced ? 0 : 0.2 }}
                className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
          ) : null}
        </AnimatePresence>

        <div className="pointer-events-none fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4">
          <AnimatePresence>
            {open ? (
              <DialogPrimitive.Content
                asChild
                key="content"
                className="pointer-events-auto outline-none"
              >
                <motion.div
                  {...(reduced
                    ? {}
                    : {
                        initial: { opacity: 0, scale: 0.96, y: 8 },
                        animate: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.97, y: 6 },
                      })}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className={cn(
                    'relative w-[min(560px,92vw)] rounded-2xl border border-border bg-surface-raised p-6 shadow-elevation5',
                  )}
                >
                  <DialogPrimitive.Title className="font-display text-h3 font-semibold text-fg">
                    {title}
                  </DialogPrimitive.Title>
                  {description ? (
                    <DialogPrimitive.Description className="mt-2 text-body text-fg-muted">
                      {description}
                    </DialogPrimitive.Description>
                  ) : (
                    <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
                  )}
                  {children ? <div className="mt-5 text-body text-fg">{children}</div> : null}
                  {footer ? <div className="mt-6 flex items-center justify-end gap-2">{footer}</div> : null}
                  <DialogPrimitive.Close
                    aria-label="Close"
                    className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-surface hover:text-fg"
                  >
                    <X className="h-4 w-4" />
                  </DialogPrimitive.Close>
                </motion.div>
              </DialogPrimitive.Content>
            ) : null}
          </AnimatePresence>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
