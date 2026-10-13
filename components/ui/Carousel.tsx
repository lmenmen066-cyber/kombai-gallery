'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { clamp } from '@/lib/utils/cn'

export type Slide = { title: string; body: string; from: string; to: string }

const enter = (dir: number, reduced: boolean) => ({ x: reduced ? 0 : dir * 60, opacity: 0 })
const center = { x: 0, opacity: 1 }
const exit = (dir: number, reduced: boolean) => ({ x: reduced ? 0 : dir * -60, opacity: 0 })

/**
 * Accessible carousel: prev/next + dot controls, drag/touch to swipe, optional
 * autoplay that pauses on hover/focus. Direction-aware slide+fade transition.
 * All motion collapses under prefers-reduced-motion (and autoplay is disabled).
 */
export function Carousel({
  slides,
  autoPlay = true,
  interval = 4500,
  className,
}: {
  slides: Slide[]
  autoPlay?: boolean
  interval?: number
  className?: string
}) {
  const reduced = !!useReducedMotion()
  const n = slides.length
  const [[index, dir], setState] = React.useState<[number, number]>([0, 0])
  const [paused, setPaused] = React.useState(false)

  const paginate = React.useCallback(
    (d: number) => setState(([i]) => [(clamp(i + d, 0, n - 1) + n) % n, d]),
    [n],
  )
  const goTo = (i: number) => setState(([cur]) => [i, i > cur ? 1 : -1])

  React.useEffect(() => {
    if (!autoPlay || reduced || paused || n <= 1) return
    const t = setInterval(() => paginate(1), interval)
    return () => clearInterval(t)
  }, [autoPlay, reduced, paused, interval, paginate, n])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const power = info.offset.x + info.velocity.x * 0.2
    if (power < -80) paginate(1)
    else if (power > 80) paginate(-1)
  }

  const slide = slides[index]

  return (
    <div
      className={cn('group/carousel relative select-none', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-raised">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={index}
            custom={dir}
            draggable
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={onDragEnd}
            initial={enter(dir, reduced)}
            animate={center}
            exit={exit(dir, reduced)}
            transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative cursor-grab active:cursor-grabbing"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${n}`}
          >
            <div
              className="flex h-[300px] flex-col justify-end p-8 text-white sm:h-[360px]"
              style={{ backgroundImage: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}
            >
              <h3 className="font-display text-h2 font-bold drop-shadow-sm">{slide.title}</h3>
              <p className="mt-2 max-w-[46ch] text-body text-white/90">{slide.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <NavButton aria-label="Previous slide" onClick={() => paginate(-1)} className="left-3">
          <ChevronLeft className="h-5 w-5" />
        </NavButton>
        <NavButton aria-label="Next slide" onClick={() => paginate(1)} className="right-3">
          <ChevronRight className="h-5 w-5" />
        </NavButton>

        <button
          type="button"
          aria-label={paused ? 'Resume autoplay' : 'Pause autoplay'}
          onClick={() => setPaused((p) => !p)}
          disabled={!autoPlay || reduced}
          className="absolute bottom-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 disabled:opacity-0"
        >
          {paused || reduced ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Choose slide">
        {slides.map((s, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to ${s.title}`}
            onClick={() => goTo(i)}
            className="grid place-items-center p-1"
          >
            <motion.span
              animate={{ width: i === index ? 26 : 8, opacity: i === index ? 1 : 0.4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="h-2 rounded-full bg-fg"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function NavButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        'absolute top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25',
        className,
      )}
    >
      {children}
    </button>
  )
}
