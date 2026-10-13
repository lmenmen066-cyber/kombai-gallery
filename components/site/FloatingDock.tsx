'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Home, Sparkles, Images, LayoutGrid, CreditCard } from 'lucide-react'
import { Toolbar, type ToolbarItem } from '@/components/ui/Toolbar'

const ITEMS: ToolbarItem[] = [
  { id: 'top', label: 'Top', icon: Home },
  { id: 'features', label: 'Features', icon: Sparkles },
  { id: 'media', label: 'Media', icon: Images },
  { id: 'elements', label: 'Elements', icon: LayoutGrid },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
]

const NAVBAR_OFFSET = 72

/**
 * Home-page floating dock. Drives a generic <Toolbar> from real page state: a
 * scroll listener tracks which section is in view (active indicator slides via
 * the shared layoutId), clicking jumps with an offset for the fixed navbar, and
 * the whole dock only surfaces once you're past the fold. Mounted only on `/`.
 */
export function FloatingDock() {
  const reduced = !!useReducedMotion()
  const [active, setActive] = React.useState('top')
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    let raf = 0
    const measure = () => {
      const y = window.scrollY
      setVisible(y > 600)
      const probe = y + window.innerHeight * 0.35
      let cur = ITEMS[0].id
      for (const it of ITEMS) {
        if (it.id === 'top') continue
        const el = document.getElementById(it.id)
        const top = el ? el.getBoundingClientRect().top + y : Infinity
        if (probe >= top) cur = it.id
      }
      setActive(cur)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const go = (id: string) => {
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth'
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior })
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET, behavior })
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4"
        >
          <Toolbar
            items={ITEMS}
            activeId={active}
            onSelect={go}
            ariaLabel="Jump to section"
            indicatorId="dock-active"
            className="max-w-[calc(100vw-2rem)]"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
