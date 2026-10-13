'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Users,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Search,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Badge } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'

const NAV = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { key: 'projects', label: 'Projects', icon: FolderKanban, href: '/dashboard#projects' },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard#analytics' },
  { key: 'customers', label: 'Customers', icon: Users, href: '/dashboard#customers' },
  { key: 'reports', label: 'Reports', icon: FileText, href: '/dashboard#reports' },
  { key: 'settings', label: 'Settings', icon: Settings, href: '/dashboard#settings' },
]

function NavList({
  active,
  collapsed,
  onNavigate,
}: {
  active: string
  collapsed: boolean
  onNavigate?: (key: string) => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const on = item.key === active
        const link = (
          <Link
            href={item.href}
            onClick={() => onNavigate?.(item.key)}
            aria-current={on ? 'page' : undefined}
            className={cn(
              'relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              collapsed && 'lg:justify-center lg:px-0',
              on ? 'bg-surface-raised text-fg shadow-elevation1' : 'text-fg-muted hover:text-fg hover:bg-surface-raised',
            )}
          >
            {on ? (
              <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-accent" />
            ) : null}
            <item.icon className={cn('h-[18px] w-[18px] shrink-0', on && 'text-accent')} />
            <span className={cn('truncate', collapsed && 'lg:hidden')}>{item.label}</span>
          </Link>
        )
        return collapsed ? (
          <Tooltip key={item.key} label={item.label}>
            {link}
          </Tooltip>
        ) : (
          <React.Fragment key={item.key}>{link}</React.Fragment>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] text-sm font-bold text-white shadow-elevation2">
        K
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-fg">Kombai</span>
    </Link>
  )
}

/**
 * Dashboard chrome: a collapsible sidebar (icon rail ↔ full labels), a
 * persistent top bar (search, notifications, theme, avatar) and, below `lg`,
 * the sidebar becomes an off-canvas drawer. Active item uses a shared
 * `layoutId` pill; collapsed items surface their label through a tooltip.
 */
export function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  const reduced = !!useReducedMotion()
  const [collapsed, setCollapsed] = React.useState(false)
  const [drawer, setDrawer] = React.useState(false)
  const [active, setActive] = React.useState('overview')

  React.useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  const sidebarInner = (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className={cn('flex h-10 items-center px-2', collapsed && 'lg:justify-center lg:px-0')}>
        <span className={cn(collapsed && 'lg:hidden')}>
          <Brand />
        </span>
      </div>
      <NavList active={active} collapsed={collapsed} onNavigate={(k) => (setActive(k), setDrawer(false))} />
      <div className={cn('mt-auto', collapsed && 'lg:hidden')}>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-fg-subtle">Plan</p>
          <p className="mt-1 text-sm font-medium text-fg">Studio</p>
          <p className="mt-0.5 text-caption text-fg-muted">12 of 20 seats used</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-accent" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface text-fg lg:grid lg:grid-cols-[auto_1fr]">
      {/* desktop sidebar */}
      <aside
        className={cn(
          'sticky top-0 hidden h-screen border-r border-border bg-surface-raised/40 transition-[width] duration-300 ease-quiet lg:block',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        {sidebarInner}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute bottom-4 right-3 grid h-8 w-8 place-items-center rounded-lg border border-border text-fg-muted transition-colors hover:bg-surface hover:text-fg"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              onClick={() => setDrawer(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: reduced ? 0 : -280 }}
              animate={{ x: 0 }}
              exit={{ x: reduced ? 0 : -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-surface-raised lg:hidden"
            >
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-fg-muted hover:bg-surface hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarInner}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      {/* main column */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-fg lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="font-display text-lg font-semibold tracking-tight">{title}</h1>

          <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            <input
              placeholder="Search…"
              aria-label="Search dashboard"
              className="h-10 w-full rounded-lg border border-border bg-surface-raised pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-fg/30"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative ml-auto grid h-9 w-9 place-items-center rounded-lg border border-border text-fg transition-colors hover:bg-surface-raised sm:ml-0"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1">
              <Badge tone="danger" size="xs" className="h-4 min-w-4 justify-center px-1">
                3
              </Badge>
            </span>
          </button>
          <ThemeToggle />
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] text-xs font-bold text-white shadow-elevation1"
          >
            AR
          </span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
