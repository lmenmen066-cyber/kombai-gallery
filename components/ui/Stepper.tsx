'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type Step = { title: string; description?: string; content?: React.ReactNode }

function StepDot({
  i,
  done,
  active,
  disabled,
  reduced,
  onClick,
}: {
  i: number
  done: boolean
  active: boolean
  disabled: boolean
  reduced: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'step' : undefined}
      className={cn(
        'relative grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors outline-none',
        done && 'border-accent bg-accent text-accent-contrast',
        active && 'border-accent text-accent',
        !done && !active && 'border-border text-fg-subtle',
        disabled && 'cursor-not-allowed',
      )}
    >
      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
      {active && !reduced ? (
        <motion.span
          className="absolute inset-0 -z-10 rounded-full ring-2 ring-accent/40"
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.55, 0, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          aria-hidden
        />
      ) : null}
    </button>
  )
}

/**
 * Multi-step indicator — `horizontal` (default) or `vertical`. Completed steps
 * show a check, the active step pulses, connectors fill with progress, and the
 * active panel cross-fades on change. Controlled: the parent drives `current` +
 * `onStepChange`. Reduced-motion keeps every state but drops the pulse/anim.
 */
export function Stepper({
  steps,
  current,
  onStepChange,
  orientation = 'horizontal',
  className,
}: {
  steps: Step[]
  current: number
  onStepChange?: (i: number) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  const reduced = !!useReducedMotion()
  const n = steps.length

  return (
    <div className={cn('w-full', className)}>
      {orientation === 'vertical' ? (
        <VerticalRail steps={steps} current={current} reduced={reduced} onStepChange={onStepChange} />
      ) : (
        <HorizontalRail steps={steps} current={current} reduced={reduced} onStepChange={onStepChange} />
      )}

      {/* content panel */}
      {steps[current]?.content ? (
        <div className={cn('relative', orientation === 'vertical' ? 'mt-2' : 'mt-8')}>
          <AnimateStep key={current} reduced={reduced} vertical={orientation === 'vertical'}>
            {steps[current].content}
          </AnimateStep>
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        Step {Math.min(current + 1, n)} of {n}: {steps[current]?.title ?? 'Complete'}
      </span>
    </div>
  )
}

function HorizontalRail({
  steps,
  current,
  reduced,
  onStepChange,
}: {
  steps: Step[]
  current: number
  reduced: boolean
  onStepChange?: (i: number) => void
}) {
  const n = steps.length
  return (
    <ol className="flex items-center">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <React.Fragment key={i}>
            <li className="flex items-center gap-3">
              <StepDot i={i} done={done} active={active} disabled={i > current} reduced={reduced} onClick={() => onStepChange?.(i)} />
              <div className="hidden sm:block">
                <p className={cn('text-sm font-medium leading-tight', active ? 'text-fg' : 'text-fg-muted')}>{s.title}</p>
                {s.description ? <p className="text-caption text-fg-subtle">{s.description}</p> : null}
              </div>
            </li>
            {i < n - 1 ? (
              <li className="mx-3 h-px flex-1 bg-border" aria-hidden>
                <motion.div
                  className="h-px origin-left bg-accent"
                  initial={false}
                  animate={{ scaleX: current > i ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                />
              </li>
            ) : null}
          </React.Fragment>
        )
      })}
    </ol>
  )
}

function VerticalRail({
  steps,
  current,
  reduced,
  onStepChange,
}: {
  steps: Step[]
  current: number
  reduced: boolean
  onStepChange?: (i: number) => void
}) {
  const n = steps.length
  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={i} className="flex gap-4">
            <div className="flex flex-col items-center self-stretch">
              <StepDot i={i} done={done} active={active} disabled={i > current} reduced={reduced} onClick={() => onStepChange?.(i)} />
              {i < n - 1 ? (
                <div className="my-1 w-px flex-1 bg-border" aria-hidden>
                  <motion.div
                    className="h-full w-px origin-top bg-accent"
                    initial={false}
                    animate={{ scaleY: current > i ? 1 : 0 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                  />
                </div>
              ) : null}
            </div>
            <div className={cn('pt-1', i < n - 1 ? 'pb-8' : 'pb-0')}>
              <p className={cn('text-sm font-medium leading-tight', active ? 'text-fg' : done ? 'text-fg' : 'text-fg-muted')}>
                {s.title}
              </p>
              {s.description ? <p className="mt-0.5 text-caption text-fg-subtle">{s.description}</p> : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function AnimateStep({ children, reduced, vertical }: { children: React.ReactNode; reduced: boolean; vertical: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : vertical ? { opacity: 0, y: 12 } : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
