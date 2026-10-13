'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

/**
 * Radix Tabs with a sliding active-pill indicator (shared `layoutId`) and a
 * fade/slide content transition. Controlled so the pill only renders under the
 * active tab. Reduced-motion disables both animations.
 */
export function Tabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: { value: string; label: string; content: React.ReactNode }[]
  defaultValue?: string
  className?: string
}) {
  const reduced = !!useReducedMotion()
  const [value, setValue] = React.useState(defaultValue ?? tabs[0]?.value)

  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={setValue}
      className={cn('w-full', className)}
    >
      <TabsPrimitive.List className="relative inline-flex gap-1 rounded-xl border border-border bg-surface-raised p-1">
        {tabs.map((t) => {
          const active = t.value === value
          return (
            <TabsPrimitive.Trigger
              key={t.value}
              value={t.value}
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-fg-muted outline-none transition-colors hover:text-fg data-[state=active]:text-fg-inverse"
            >
              {active ? (
                <motion.span
                  layoutId="tabs-indicator"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-lg bg-accent"
                  initial={false}
                  transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 34 }}
                />
              ) : null}
              {t.label}
            </TabsPrimitive.Trigger>
          )
        })}
      </TabsPrimitive.List>

      <div className="mt-5">
        {tabs.map((t) => (
          <TabsPrimitive.Content key={t.value} value={t.value} className="outline-none" asChild>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {t.content}
            </motion.div>
          </TabsPrimitive.Content>
        ))}
      </div>
    </TabsPrimitive.Root>
  )
}
