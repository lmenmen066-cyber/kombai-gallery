import * as React from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * A hairline separator. `label` renders centered text on a horizontal line
 * ("or" dividers). `variant` picks a solid, dashed or fading-to-transparent
 * treatment. Orientation is horizontal by default; pass `vertical` for column
 * rules inside flex rows.
 */
export function Divider({
  label,
  className,
  variant = 'solid',
  vertical,
}: {
  label?: React.ReactNode
  className?: string
  variant?: 'solid' | 'dashed' | 'fade'
  vertical?: boolean
}) {
  const style =
    variant === 'dashed' ? { borderStyle: 'dashed' } : variant === 'fade' ? { borderStyle: 'none' } : {}
  if (vertical) {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        style={style}
        className={cn(
          'inline-block h-full w-px self-stretch',
          variant === 'fade'
            ? 'bg-gradient-to-b from-transparent via-border to-transparent'
            : 'bg-border',
          variant === 'dashed' && 'border-l border-dashed border-border w-0',
          className,
        )}
      />
    )
  }
  if (!label) {
    return (
      <hr
        style={style}
        className={cn(
          'my-0 h-px w-full border-0',
          variant === 'fade' ? 'divider-fade' : variant === 'dashed' ? 'border-t border-dashed border-border' : 'bg-border',
          className,
        )}
      />
    )
  }
  return (
    <div className={cn('flex items-center gap-3 text-caption text-fg-subtle', className)}>
      <span className="divider-fade h-px flex-1" />
      <span className="uppercase tracking-[0.16em]">{label}</span>
      <span className="divider-fade h-px flex-1" />
    </div>
  )
}
