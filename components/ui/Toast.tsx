'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast, type ToastItem, type ToastVariant } from '@/lib/store/toast'

const CONFIG: Record<
  ToastVariant,
  { icon: typeof Info; accent: string; text: string }
> = {
  success: { icon: CheckCircle2, accent: 'bg-success', text: 'text-success' },
  error: { icon: XCircle, accent: 'bg-danger', text: 'text-danger' },
  warning: { icon: AlertTriangle, accent: 'bg-warning', text: 'text-warning' },
  info: { icon: Info, accent: 'bg-info', text: 'text-info' },
}

function ToastCard({
  item,
  dismiss,
  reduced,
}: {
  item: ToastItem
  dismiss: (id: string) => void
  reduced: boolean
}) {
  const { icon: Icon, accent, text } = CONFIG[item.variant]
  const [remaining, setRemaining] = React.useState(item.duration)
  const [paused, setPaused] = React.useState(false)

  const countdown = item.duration > 0 && !paused
  React.useEffect(() => {
    if (!countdown) return
    const step = 40
    const iv = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - step))
    }, step)
    return () => window.clearInterval(iv)
  }, [countdown])

  React.useEffect(() => {
    if (item.duration > 0 && remaining <= 0) dismiss(item.id)
  }, [remaining, item.duration, item.id, dismiss])

  const pct = item.duration > 0 ? (remaining / item.duration) * 100 : 100

  return (
    <motion.div
      layout={!reduced}
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      initial={{ opacity: 0, x: reduced ? 0 : 28, y: reduced ? 0 : -8, scale: reduced ? 1 : 0.98 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: reduced ? 0 : 28, height: 0, marginTop: 0, marginBottom: 0, scale: reduced ? 1 : 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32, height: { duration: reduced ? 0 : 0.24 } }}
      className="pointer-events-auto relative w-[min(92vw,360px)] overflow-hidden rounded-xl border border-border bg-surface-raised shadow-elevation4"
    >
      <div className="flex items-start gap-3 p-4">
        <span className={cn('mt-0.5 shrink-0', text)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">{item.title}</p>
          {item.description ? (
            <p className="mt-0.5 text-caption leading-relaxed text-fg-muted">{item.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => dismiss(item.id)}
          aria-label="Dismiss notification"
          className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-surface hover:text-fg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {item.duration > 0 ? (
        <div className={cn('absolute inset-x-0 bottom-0 h-[3px]', accent)} style={{ width: `${pct}%`, opacity: paused ? 0.6 : 1 }} />
      ) : null}
    </motion.div>
  )
}

/**
 * Global toast viewport — mounts once (root layout). Reads the Zustand queue,
 * renders a top-right, pointer-events-isolated stack. Each toast slides + fades
 * in, collapses its height on exit, and runs a countdown bar that pauses while
 * hovered or focused. New toasts appear at the top; the store caps the stack.
 */
export function Toaster() {
  const toasts = useToast((s) => s.toasts)
  const dismiss = useToast((s) => s.dismiss)
  const reduced = !!useReducedMotion()

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
    >
      <AnimatePresence initial={false}>
        {[...toasts].reverse().map((t) => (
          <ToastCard key={t.id} item={t} dismiss={dismiss} reduced={reduced} />
        ))}
      </AnimatePresence>
    </div>
  )
}
