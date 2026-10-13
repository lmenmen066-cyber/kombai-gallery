'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type State = 'idle' | 'error' | 'success'

/**
 * Text input with a floating label, a center-out focus bar, and quiet
 * validation motion: an error shake + red border, a success check that draws
 * itself. `message` renders under the field coloured by state.
 *
 * Uncontrolled by default; pass `value`/`onChange` to control it. Always
 * paired with a `useId` label for correct a11y.
 */
export function Field({
  label,
  type = 'text',
  state = 'idle',
  message,
  className,
  id: idProp,
  value,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: {
  label: string
  type?: string
  state?: State
  message?: string
  className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
    value?: string
    onChange?: (v: string) => void
  }) {
  const autoId = React.useId()
  const id = idProp ?? autoId
  const reduced = !!useReducedMotion()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [focused, setFocused] = React.useState(false)
  const hasValue = !!(value ?? inputRef.current?.value ?? '')

  const border =
    state === 'error'
      ? 'border-danger focus-within:border-danger'
      : state === 'success'
        ? 'border-success/70 focus-within:border-success'
        : 'border-border focus-within:border-fg/40'

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <motion.div
        animate={
          !reduced && state === 'error' ? { x: [0, -6, 5, -3, 2, 0] } : { x: 0 }
        }
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={cn(
          'relative overflow-hidden rounded-xl border bg-surface-raised transition-colors',
          border,
        )}
      >
        <input
          {...rest}
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          placeholder=" "
          aria-invalid={state === 'error' || undefined}
          aria-describedby={message ? `${id}-msg` : undefined}
          className="w-full bg-transparent px-4 pb-2 pt-6 text-[0.98rem] text-fg outline-none"
        />
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-4 origin-left text-fg-subtle transition-all duration-200 ease-quiet',
            hasValue || focused ? 'top-2 text-caption font-medium text-fg-muted' : 'top-1/2 -translate-y-1/2 text-[0.98rem]',
          )}
        >
          {label}
        </label>

        {state === 'success' ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6 9 17l-5-5"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </svg>
        ) : null}

        {/* center-out focus bar */}
        <motion.span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-center bg-accent"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </motion.div>

      {message ? (
        <p
          id={`${id}-msg`}
          role={state === 'error' ? 'alert' : undefined}
          className={cn(
            'px-1 text-caption',
            state === 'error' ? 'text-danger' : state === 'success' ? 'text-success' : 'text-fg-subtle',
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
