'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ToolbarItem = {
  id: string
  label: string
  icon: LucideIcon
}

/**
 * Floating toolbar — a blurred, bordered pill of tool buttons. The active item
 * carries a shared `layoutId` indicator that slides between buttons, its label
 * expands while others reveal theirs on hover. Presentational: the parent owns
 * positioning, `activeId` and `onSelect`. Fully keyboard-operable and it dials
 * the sliding/spring animation down to instant under `prefers-reduced-motion`.
 */
export function Toolbar({
  items,
  activeId,
  onSelect,
  className,
  ariaLabel = 'Toolbar',
  indicatorId = 'toolbar-active',
}: {
  items: ToolbarItem[]
  activeId: string
  onSelect: (id: string) => void
  className?: string
  ariaLabel?: string
  /** Unique per mounted instance so two toolbars never share one layoutId. */
  indicatorId?: string
}) {
  const reduced = !!useReducedMotion()

  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={cn(
        'pointer-events-auto flex items-center gap-1 rounded-full border border-border/70 bg-surface/70 p-1.5 text-fg shadow-elevation4 backdrop-blur-md',
        className,
      )}
    >
      {items.map((it) => {
        const on = it.id === activeId
        return (
          <button
            key={it.id}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(it.id)}
            title={it.label}
            className={cn(
              'group relative flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium outline-none transition-colors',
              'focus-visible:ring-2 focus-visible:ring-fg/30',
              on ? 'text-accent-contrast' : 'text-fg-muted hover:text-fg',
            )}
          >
            {on ? (
              <motion.span
                layoutId={indicatorId}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
              />
            ) : null}
            <it.icon className={cn('h-[18px] w-[18px] shrink-0', on ? 'text-accent-contrast' : 'text-fg-muted group-hover:text-fg')} />
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-quiet',
                on
                  ? 'max-w-[12ch] opacity-100'
                  : 'max-w-0 opacity-0 group-hover:max-w-[12ch] group-hover:opacity-100 focus-visible:max-w-[12ch] focus-visible:opacity-100',
              )}
            >
              {it.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
