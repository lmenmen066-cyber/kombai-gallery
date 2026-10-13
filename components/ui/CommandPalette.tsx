'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Search,
  Home,
  LayoutDashboard,
  CreditCard,
  LogIn,
  Images,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Gauge,
  Waves,
  Wand2,
  MousePointer2,
  MousePointerClick,
  ArrowUpToLine,
  CornerDownLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useTheme } from '@/components/providers/ThemeProvider'
import { usePrefs } from '@/lib/store/prefs'
import { toast } from '@/lib/store/toast'

type Command = {
  id: string
  group: string
  label: string
  hint?: string
  keywords?: string
  icon: LucideIcon
  run: () => void
}

/**
 * Global command palette (⌘K / Ctrl+K). One Radix Dialog, one flat list of
 * commands grouped into Navigation / Theme / Preferences / Actions, filtered by
 * a normalized query with arrow-key + Enter selection. Its commands mutate the
 * same theme context and prefs store the rest of the UI reads, so toggling
 * motion or the cursor here has an immediate, site-wide effect.
 */
export function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()
  const reduced = !!useReducedMotion()
  const { setTheme, theme } = useTheme()
  const setMotion = usePrefs((s) => s.setMotion)
  const setCursor = usePrefs((s) => s.setCursor)
  const motionPref = usePrefs((s) => s.motion)
  const cursorPref = usePrefs((s) => s.cursor)
  const open = usePrefs((s) => s.paletteOpen)
  const setOpen = usePrefs((s) => s.closePalette)
  const toggleOpen = usePrefs((s) => s.togglePalette)

  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const goSection = (id: string) => {
    if (pathname !== '/') {
      router.push('/')
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const commands = React.useMemo<Command[]>(() => {
    const list: Command[] = [
      { id: 'nav-home', group: 'Navigation', label: 'Home', icon: Home, keywords: 'landing start', run: () => router.push('/') },
      { id: 'nav-dash', group: 'Navigation', label: 'Dashboard', icon: LayoutDashboard, keywords: 'app stats table', run: () => router.push('/dashboard') },
      { id: 'nav-pricing', group: 'Navigation', label: 'Pricing', icon: CreditCard, keywords: 'plans billing', run: () => router.push('/pricing') },
      { id: 'nav-components', group: 'Navigation', label: 'Component index', icon: Search, keywords: 'catalog storybook gallery list', run: () => router.push('/components') },
      { id: 'nav-login', group: 'Navigation', label: 'Sign in', icon: LogIn, keywords: 'login auth', run: () => router.push('/login') },
      { id: 'sec-features', group: 'Jump to section', label: 'Features', icon: Sparkles, run: () => goSection('features') },
      { id: 'sec-imagery', group: 'Jump to section', label: 'Imagery', icon: Images, keywords: 'lqip blur', run: () => goSection('imagery') },
      { id: 'sec-wizard', group: 'Jump to section', label: 'Onboarding wizard', icon: Wand2, keywords: 'stepper form', run: () => goSection('wizard') },

      { id: 'th-light', group: 'Theme', label: 'Light mode', icon: Sun, run: () => setTheme('light') },
      { id: 'th-dark', group: 'Theme', label: 'Dark mode', icon: Moon, run: () => setTheme('dark') },
      { id: 'th-system', group: 'Theme', label: 'System theme', icon: Monitor, run: () => setTheme('system') },

      { id: 'mo-auto', group: 'Motion', label: 'Motion: follow system', icon: Gauge, hint: 'auto', run: () => setMotion('auto') },
      { id: 'mo-reduce', group: 'Motion', label: 'Motion: reduce', icon: Gauge, hint: 'less', run: () => setMotion('reduce') },
      { id: 'mo-full', group: 'Motion', label: 'Motion: full', icon: Waves, hint: 'all', run: () => setMotion('full') },

      { id: 'cur-on', group: 'Cursor', label: 'Custom cursor: on', icon: MousePointer2, run: () => setCursor(true) },
      { id: 'cur-off', group: 'Cursor', label: 'Custom cursor: off', icon: MousePointerClick, run: () => setCursor(false) },

      { id: 'act-top', group: 'Actions', label: 'Scroll to top', icon: ArrowUpToLine, run: () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) },
    ]
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pathname, setTheme, setMotion, setCursor, reduced])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q))
  }, [commands, query])

  const run = (c: Command) => {
    c.run()
    setOpen()
    toast.show({ variant: 'success', title: c.label, duration: 2200 })
  }

  // keep selection in range as the query narrows the list
  React.useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, filtered.length - 1)))
  }, [filtered.length])

  // scroll the active row into view
  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  // global ⌘K / Ctrl+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleOpen])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (filtered.length ? (a + 1) % filtered.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (filtered.length ? (a - 1 + filtered.length) % filtered.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const c = filtered[active]
      if (c) run(c)
    }
  }

  const isCurrent = (c: Command): boolean => {
    if (c.id.startsWith('th-')) return c.id === `th-${theme}`
    if (c.id === 'mo-auto') return motionPref === 'auto'
    if (c.id === 'mo-reduce') return motionPref === 'reduce'
    if (c.id === 'mo-full') return motionPref === 'full'
    if (c.id === 'cur-on') return cursorPref === true
    if (c.id === 'cur-off') return cursorPref === false
    if (c.id.startsWith('nav-')) {
      return (
        (c.id === 'nav-home' && pathname === '/') ||
        (c.id === 'nav-dash' && pathname === '/dashboard') ||
        (c.id === 'nav-pricing' && pathname === '/pricing') ||
        (c.id === 'nav-login' && pathname === '/login')
      )
    }
    return false
  }

  let lastGroup = ''

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) setOpen()
        else usePrefs.getState().openPalette()
      }}
    >
      <DialogPrimitive.Portal>
        <AnimatePresence>
          {open ? (
            <DialogPrimitive.Overlay asChild key="p-overlay">
              <motion.div
                {...(reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } })}
                transition={{ duration: reduced ? 0 : 0.16 }}
                className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
          ) : null}
        </AnimatePresence>

        <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center p-4 pt-[12vh]">
          <AnimatePresence>
            {open ? (
              <DialogPrimitive.Content
                asChild
                key="p-content"
                className="pointer-events-auto outline-none"
                onOpenAutoFocus={(e) => {
                  e.preventDefault()
                  inputRef.current?.focus()
                }}
              >
                <motion.div
                  {...(reduced
                    ? {}
                    : {
                        initial: { opacity: 0, scale: 0.98, y: -8 },
                        animate: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.98, y: -6 },
                      })}
                  transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  className="w-[min(600px,94vw)] overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-elevation5"
                >
                  <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">
                    Search commands to navigate and change preferences.
                  </DialogPrimitive.Description>

                  {/* input */}
                  <div className="flex items-center gap-3 border-b border-border px-4">
                    <Search className="h-4 w-4 shrink-0 text-fg-subtle" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setActive(0)
                      }}
                      onKeyDown={onKeyDown}
                      placeholder="Type a command or search…"
                      role="combobox"
                      aria-expanded
                      aria-controls="palette-list"
                      aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
                      className="h-14 w-full bg-transparent text-[0.98rem] text-fg outline-none placeholder:text-fg-subtle"
                    />
                    <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle sm:block">
                      Esc
                    </kbd>
                  </div>

                  {/* list */}
                  <div id="palette-list" ref={listRef} role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
                    {filtered.length === 0 ? (
                      <div className="px-3 py-10 text-center text-sm text-fg-subtle">
                        No commands match “{query}”.
                      </div>
                    ) : (
                      filtered.map((c, i) => {
                        const header = c.group !== lastGroup
                        lastGroup = c.group
                        const on = i === active
                        return (
                          <React.Fragment key={c.id}>
                            {header ? (
                              <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                                {c.group}
                              </div>
                            ) : null}
                            <button
                              type="button"
                              id={`cmd-${c.id}`}
                              data-idx={i}
                              role="option"
                              aria-selected={on}
                              onMouseMove={() => setActive(i)}
                              onClick={() => run(c)}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                                on ? 'bg-accent text-accent-contrast' : 'text-fg hover:bg-surface',
                              )}
                            >
                              <c.icon className={cn('h-4 w-4 shrink-0', on ? 'text-accent-contrast' : 'text-fg-subtle')} />
                              <span className="min-w-0 flex-1 truncate">{c.label}</span>
                              {isCurrent(c) ? (
                                <span className={cn('text-caption', on ? 'text-accent-contrast/80' : 'text-fg-subtle')}>current</span>
                              ) : c.hint ? (
                                <span className={cn('text-caption', on ? 'text-accent-contrast/80' : 'text-fg-subtle')}>{c.hint}</span>
                              ) : null}
                              {on ? <CornerDownLeft className="h-3.5 w-3.5 shrink-0 opacity-70" /> : null}
                            </button>
                          </React.Fragment>
                        )
                      })
                    )}
                  </div>

                  <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[11px] text-fg-subtle">
                    <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1">↑</kbd><kbd className="rounded border border-border px-1">↓</kbd> navigate</span>
                    <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1">↵</kbd> select</span>
                    <span className="ml-auto">Kombai commands</span>
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            ) : null}
          </AnimatePresence>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
