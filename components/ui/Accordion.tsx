'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * Smoothly animating accordion on Radix's accessible Collapsible semantics.
 * Height is animated via Framer Motion `height: auto` with a masked overflow;
 * reduced-motion collapses to an instant show/hide.
 */
export function Accordion({
  items,
  type = 'single',
  className,
}: {
  items: { q: string; a: React.ReactNode }[]
  type?: 'single' | 'multiple'
  className?: string
}) {
  const reduced = !!useReducedMotion()
  return (
    <AccordionPrimitive.Root
      type={type}
      collapsible={type === 'single'}
      className={cn('w-full divide-y divide-border rounded-xl border border-border bg-surface-raised', className)}
    >
      {items.map((it, i) => (
        <AccordionPrimitive.Item key={i} value={String(i)} className="px-5">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left font-display text-[1.05rem] font-medium text-fg outline-none transition-colors hover:text-fg data-[state=open]:text-fg">
              {it.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border text-fg-muted transition-colors group-hover:bg-surface">
                <motion.span
                  variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 },
                  }}
                  transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{ display: 'inline-flex' }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content
            forceMount
            className="overflow-hidden data-[state=closed]:hidden"
          >
            <motion.div
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="pb-5 text-body text-fg-muted">{it.a}</div>
            </motion.div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
