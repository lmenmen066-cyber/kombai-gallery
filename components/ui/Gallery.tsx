'use client'

import * as React from 'react'
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type GalleryItem = { id: string; cat: string; title: string; from: string; to: string; span?: 'wide' | 'tall' | 'big' }

const spanClass: Record<NonNullable<GalleryItem['span']>, string> = {
  wide: 'sm:col-span-2',
  tall: 'row-span-2',
  big: 'col-span-2 row-span-2',
}

/**
 * Masonry-flavored gallery with a FLIP-animated category filter (Framer
 * `layout` + `popLayout`) and a keyboard-accessible lightbox (Esc, arrows).
 * Tiles are self-contained CSS gradients — no external image dependencies.
 */
export function Gallery({ items, className }: { items: GalleryItem[]; className?: string }) {
  const reduced = !!useReducedMotion()
  const cats = React.useMemo(() => ['All', ...Array.from(new Set(items.map((i) => i.cat)))], [items])
  const [active, setActive] = React.useState('All')
  const [lightbox, setLightbox] = React.useState<number | null>(null)

  const shown = active === 'All' ? items : items.filter((i) => i.cat === active)

  const close = () => setLightbox(null)
  const step = (d: number) =>
    setLightbox((cur) => (cur === null ? cur : (cur + d + shown.length) % shown.length))

  React.useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, shown.length])

  return (
    <div className={cn('w-full', className)}>
      {/* filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {cats.map((c) => {
          const on = c === active
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setActive(c)
                setLightbox(null)
              }}
              className="relative rounded-full px-4 py-1.5 text-sm font-medium outline-none transition-colors"
            >
              {on ? (
                <motion.span
                  layoutId="gal-chip"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }}
                />
              ) : null}
              <span className={on ? 'text-accent-contrast' : 'text-fg-muted hover:text-fg'}>{c}</span>
            </button>
          )
        })}
      </div>

      <LayoutGroup>
        <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((item, i) => (
              <motion.button
                layout={!reduced}
                key={item.id}
                type="button"
                data-cursor="View"
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, scale: reduced ? 1 : 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.92 }}
                transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                className={cn(
                  'group relative overflow-hidden rounded-xl border border-border text-left',
                  item.span && spanClass[item.span],
                )}
              >
                <motion.div
                  className="h-full w-full"
                  style={{ backgroundImage: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
                  whileHover={{ scale: reduced ? 1 : 1.05 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <div className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black/55 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-white/70">{item.cat}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {/* lightbox */}
      <AnimatePresence>
        {lightbox !== null && shown[lightbox] ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
            className="fixed inset-0 z-[90] flex flex-col bg-black/85 p-4 backdrop-blur-md sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${shown[lightbox].title}, image ${lightbox + 1} of ${shown.length}`}
          >
            <div className="flex items-center justify-between text-white/80">
              <span className="text-sm">
                {lightbox + 1} / {shown.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={shown[lightbox].id}
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
                  transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 0.61, 0.36, 1] }}
                  className="flex h-full max-h-[64vh] w-full max-w-3xl flex-col justify-end rounded-2xl p-8"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${shown[lightbox].from}, ${shown[lightbox].to})`,
                  }}
                >
                  <div className="text-white">
                    <p className="text-caption uppercase tracking-[0.18em] text-white/80">
                      {shown[lightbox].cat}
                    </p>
                    <h3 className="mt-1 font-display text-h2 font-bold">{shown[lightbox].title}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                aria-label="Previous image"
                onClick={() => step(-1)}
                className="absolute left-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => step(1)}
                className="absolute right-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
