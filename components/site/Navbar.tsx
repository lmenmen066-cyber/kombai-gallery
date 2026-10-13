'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, Command } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { usePrefs } from '@/lib/store/prefs'
import { fadeUp, pickMotionVariant } from '@/lib/motion/variants'

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Metrics', href: '#metrics' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Components', href: '/components' },
  { label: 'Dashboard', href: '/dashboard' },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const reduced = !!useReducedMotion()
  const openPalette = usePrefs((s) => s.openPalette)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when the mobile drawer is open
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduced ? 0.12 : 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-quiet',
        scrolled
          ? 'border-b border-border/70 bg-surface/70 backdrop-blur-md shadow-elevation1'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="#top" className="group flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] text-sm font-bold text-white shadow-elevation2">
              K
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Kombai</span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-fg transition-transform duration-300 ease-quiet group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openPalette()}
              aria-label="Open command palette"
              title="Search & commands (⌘K)"
              className="hidden h-9 items-center gap-2 rounded-lg border border-border px-2.5 text-sm text-fg-muted transition-colors hover:bg-surface-raised hover:text-fg sm:flex"
            >
              <Command className="h-4 w-4" />
              <span className="text-xs">⌘K</span>
            </button>
            <ThemeToggle />
            <div className="hidden md:block">
              <Button href="/login" size="sm">
                Get started
              </Button>
            </div>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-fg md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Container>

      {/* mobile drawer */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-surface/95 backdrop-blur-md md:hidden"
          >
            <Container>
              <motion.nav
                variants={pickMotionVariant(
                  { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
                  reduced,
                )}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1 py-6"
              >
                {NAV.map((item) => (
                  <motion.div key={item.href} variants={pickMotionVariant(fadeUp, reduced)}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-border py-4 font-display text-2xl tracking-tight text-fg"
                    >
                      {item.label}
                      <span aria-hidden className="text-fg-subtle">
                        →
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={pickMotionVariant(fadeUp, reduced)} className="pt-6">
                  <Button href="/login" fullWidth onClick={() => setOpen(false)}>
                    Get started
                  </Button>
                </motion.div>
              </motion.nav>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
