'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'
import { Toggle } from '@/components/ui/Toggle'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { cn } from '@/lib/utils/cn'
import { fadeUp, staggerContainer, pickMotionVariant } from '@/lib/motion/variants'

type Category =
  | 'Primitives'
  | 'Navigation & Layout'
  | 'Overlays & Disclosure'
  | 'Forms & Interaction'
  | 'Media & Charts'
  | 'Dashboard'
  | 'Motion & Hooks'
  | 'Providers'

type Entry = {
  name: string
  path: string
  category: Category
  desc: string
  live?: boolean
}

const CATEGORIES: Category[] = [
  'Primitives',
  'Navigation & Layout',
  'Overlays & Disclosure',
  'Forms & Interaction',
  'Media & Charts',
  'Dashboard',
  'Motion & Hooks',
  'Providers',
]

const ENTRIES: Entry[] = [
  { name: 'Container', path: 'components/ui/Container.tsx', category: 'Primitives', desc: 'Centred max-width with responsive gutters; sizes sm→full.' },
  { name: 'Section', path: 'components/ui/Section.tsx', category: 'Primitives', desc: 'Section rhythm + SectionHeader + Eyebrow; tones default/raised/inverse/grid.' },
  { name: 'Button', path: 'components/ui/Button.tsx', category: 'Primitives', desc: 'Five variants, three sizes, renders link or button; spring tap + shine sweep.', live: true },
  { name: 'Badge', path: 'components/ui/Badge.tsx', category: 'Primitives', desc: 'Status chips; solid semantic tones (AA-checked), dot / count / size.', live: true },
  { name: 'Divider', path: 'components/ui/Divider.tsx', category: 'Primitives', desc: 'Hairline solid / dashed / fade / vertical / labelled.', live: true },
  { name: 'Card', path: 'components/ui/Card.tsx', category: 'Primitives', desc: 'Media + header + body + footer slots, hover lift.' },
  { name: 'Skeleton', path: 'components/ui/Skeleton.tsx', category: 'Primitives', desc: 'Shimmer block / line / circle loader.', live: true },
  { name: 'Spinner', path: 'components/ui/Spinner.tsx', category: 'Primitives', desc: 'Circular GPU-rotate indicator, optional live label.', live: true },

  { name: 'Navbar', path: 'components/site/Navbar.tsx', category: 'Navigation & Layout', desc: 'Sticky bar that blurs on scroll, hover underline, mobile drawer.' },
  { name: 'Footer', path: 'components/site/Footer.tsx', category: 'Navigation & Layout', desc: 'Brand + link columns + subscribe + social.' },
  { name: 'Hero', path: 'components/site/Hero.tsx', category: 'Navigation & Layout', desc: 'Typewriter headline, magnetic CTA, parallax glow.' },
  { name: 'Toolbar', path: 'components/ui/Toolbar.tsx', category: 'Navigation & Layout', desc: 'Floating blurred pill; active tool slides via layoutId.' },
  { name: 'FloatingDock', path: 'components/site/FloatingDock.tsx', category: 'Navigation & Layout', desc: 'Home section navigator driven by scroll-spy + Toolbar.' },
  { name: 'ScrollProgress', path: 'components/ui/ScrollProgress.tsx', category: 'Navigation & Layout', desc: 'Top reading-progress bar.' },
  { name: 'BackToTop', path: 'components/ui/BackToTop.tsx', category: 'Navigation & Layout', desc: 'Threshold fade-in jump-to-top.' },
  { name: 'Cursor', path: 'components/ui/Cursor.tsx', category: 'Navigation & Layout', desc: 'Custom dot + lagging ring; morphs over targets; gated + reduced-motion aware.' },
  { name: 'ThemeToggle', path: 'components/ui/ThemeToggle.tsx', category: 'Navigation & Layout', desc: 'light / dark / system switch.' },

  { name: 'Modal', path: 'components/ui/Modal.tsx', category: 'Overlays & Disclosure', desc: 'Radix Dialog: focus trap, ESC, scroll lock, scale/fade entrance.' },
  { name: 'Accordion', path: 'components/ui/Accordion.tsx', category: 'Overlays & Disclosure', desc: 'Height reveal with rotating chevron.' },
  { name: 'Tabs', path: 'components/ui/Tabs.tsx', category: 'Overlays & Disclosure', desc: 'Controlled tabs; shared layoutId pill under the active tab.' },
  { name: 'Tooltip', path: 'components/ui/Tooltip.tsx', category: 'Overlays & Disclosure', desc: 'Radix tooltip with per-instance id and arrow.' },
  { name: 'Toast', path: 'components/ui/Toast.tsx', category: 'Overlays & Disclosure', desc: 'Zustand queue + Toaster; slide-in, countdown bar, hover-pause.' },

  { name: 'Field', path: 'components/ui/Field.tsx', category: 'Forms & Interaction', desc: 'Floating label, centre-out focus bar, error shake, drawn success check.' },
  { name: 'Toggle', path: 'components/ui/Toggle.tsx', category: 'Forms & Interaction', desc: 'role=switch with a spring thumb.', live: true },
  { name: 'Stepper', path: 'components/ui/Stepper.tsx', category: 'Forms & Interaction', desc: 'Horizontal + vertical; active pulse, connector fill, aria-live.' },
  { name: 'MagneticButton', path: 'components/ui/MagneticButton.tsx', category: 'Forms & Interaction', desc: 'Button that leans toward the cursor with label depth.', live: true },
  { name: 'QRCode', path: 'components/ui/QRCode.tsx', category: 'Forms & Interaction', desc: 'qrcode data-URI + diagonal clip draw-in + copy / download.' },
  { name: 'Chat', path: 'components/ui/Chat.tsx', category: 'Forms & Interaction', desc: 'Spring bubbles, typing dots, auto-scroll, working send form.' },
  { name: 'Testimonials', path: 'components/ui/Testimonials.tsx', category: 'Forms & Interaction', desc: 'Masonry wall, gradient avatars, star stagger, hover tilt.' },

  { name: 'Carousel', path: 'components/ui/Carousel.tsx', category: 'Media & Charts', desc: 'Slide / fade, drag, autoplay pause-on-hover, dot indicators.' },
  { name: 'Gallery', path: 'components/ui/Gallery.tsx', category: 'Media & Charts', desc: 'Masonry + FLIP category filter + keyboard lightbox.' },
  { name: 'VideoPlayer', path: 'components/ui/VideoPlayer.tsx', category: 'Media & Charts', desc: 'Custom HTML5 controls: buffered/played seek, volume, fullscreen, auto-hide.' },
  { name: 'BlurImage', path: 'components/ui/BlurImage.tsx', category: 'Media & Charts', desc: 'LQIP blur-up that never reflows; graceful onError.' },
  { name: 'Charts', path: 'components/ui/Charts.tsx', category: 'Media & Charts', desc: 'Self-drawn SVG AreaLineChart / BarChart / DonutChart with draw-in.' },

  { name: 'Shell', path: 'components/dashboard/Shell.tsx', category: 'Dashboard', desc: 'Collapsible sidebar (icon rail ↔ labels) + top bar.' },
  { name: 'StatCard', path: 'components/dashboard/StatCard.tsx', category: 'Dashboard', desc: 'IntersectionObserver-gated count-up with directional delta.' },
  { name: 'DataTable', path: 'components/dashboard/DataTable.tsx', category: 'Dashboard', desc: 'Sortable, filterable, paginated table with row hover.' },

  { name: 'useScrollReveal', path: 'lib/hooks/useScrollReveal.ts', category: 'Motion & Hooks', desc: 'Reveal + useStaggeredAnimation + useScrollPosition helpers.' },
  { name: 'useCountUp', path: 'lib/hooks/useCountUp.ts', category: 'Motion & Hooks', desc: 'Ease-out count-up that fires once on reveal.' },
  { name: 'useAnimatedNumber', path: 'lib/hooks/useAnimatedNumber.ts', category: 'Motion & Hooks', desc: 'Count that re-eases whenever the target changes (price toggle).' },
  { name: 'useMagnetic', path: 'lib/hooks/useMagnetic.ts', category: 'Motion & Hooks', desc: 'Pointer-follow motion values for magnetic targets.' },
  { name: 'usePrefersReducedMotion', path: 'lib/hooks/usePrefersReducedMotion.ts', category: 'Motion & Hooks', desc: 'Reactive OS reduced-motion preference.' },
  { name: 'motion/variants', path: 'lib/motion/variants.ts', category: 'Motion & Hooks', desc: 'Shared fadeUp / slideIn / stagger + pickMotionVariant reduced-collapse.' },

  { name: 'ThemeProvider', path: 'components/providers/ThemeProvider.tsx', category: 'Providers', desc: 'localStorage theme with system tracking; toggles the dark class.' },
  { name: 'PrefsProvider', path: 'components/providers/PrefsProvider.tsx', category: 'Providers', desc: 'Drives Framer MotionConfig from the prefs store (motion override).' },
  { name: 'usePrefs', path: 'lib/store/prefs.ts', category: 'Providers', desc: 'Zustand UI preferences: motion, cursor, palette open.' },
  { name: 'toast store', path: 'lib/store/toast.ts', category: 'Providers', desc: 'Zustand toast queue + imperative toast() helper.' },
]

function LivePreview({ name }: { name: string }) {
  const [on, setOn] = React.useState(true)
  switch (name) {
    case 'Button':
      return (
        <div className="flex flex-wrap gap-2">
          {(['primary', 'secondary', 'outline', 'ghost'] as const).map((v) => (
            <Button key={v} variant={v} size="sm">
              {v}
            </Button>
          ))}
        </div>
      )
    case 'Badge':
      return (
        <div className="flex flex-wrap gap-2">
          <Badge tone="success" dot>Active</Badge>
          <Badge tone="warning">Beta</Badge>
          <Badge tone="danger">Error</Badge>
          <Badge tone="info">Docs</Badge>
          <Badge tone="brand">New</Badge>
        </div>
      )
    case 'Divider':
      return (
        <div className="flex w-full flex-col gap-3">
          <Divider />
          <Divider label="or" variant="fade" />
        </div>
      )
    case 'Skeleton':
      return (
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )
    case 'Spinner':
      return (
        <div className="flex items-center gap-3 text-sm text-fg-muted">
          <Spinner label="Loading" /> <Spinner size={22} /> loading…
        </div>
      )
    case 'Toggle':
      return (
        <div className="flex items-center gap-3">
          <Toggle checked={on} onChange={setOn} label="Example switch" />
          <span className="text-sm text-fg-muted">{on ? 'On' : 'Off'}</span>
        </div>
      )
    case 'MagneticButton':
      return (
        <div className="flex items-center gap-3">
          <MagneticButton size="sm">Follow me</MagneticButton>
          <span className="text-caption text-fg-subtle">hover the button</span>
        </div>
      )
    default:
      return null
  }
}

function Card({ e, reduced }: { e: Entry; reduced: boolean }) {
  return (
    <motion.div
      variants={pickMotionVariant(fadeUp, reduced)}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="surface-card flex flex-col gap-3 p-5 transition-shadow hover:shadow-elevation4"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[0.95rem] font-semibold text-fg">{e.name}</span>
        {e.live ? <Badge tone="outline" size="xs">live</Badge> : null}
      </div>
      <p className="text-sm text-fg-muted">{e.desc}</p>
      {e.live ? (
        <div className="mt-1 flex min-h-[52px] items-center rounded-lg border border-border bg-surface px-3 py-3">
          <LivePreview name={e.name} />
        </div>
      ) : null}
      <code className="mt-auto truncate text-[11px] text-fg-subtle">{e.path}</code>
    </motion.div>
  )
}

export default function ComponentsIndexPage() {
  const reduced = !!useReducedMotion()
  const [q, setQ] = React.useState('')
  const [cat, setCat] = React.useState<'All' | Category>('All')

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase()
    return ENTRIES.filter((e) => {
      const inCat = cat === 'All' || e.category === cat
      const inQ = !needle || `${e.name} ${e.desc} ${e.category}`.toLowerCase().includes(needle)
      return inCat && inQ
    })
  }, [q, cat])

  const total = ENTRIES.length

  return (
    <div className="min-h-screen bg-surface text-fg">
      <ScrollProgress />
      <Navbar />
      <main className="pt-28 pb-section">
        <Container size="xl">
          <SectionHeader
            eyebrow="Catalog"
            title="Component index"
            lede={`Every primitive, pattern and hook in this design system — ${total} entries across ${CATEGORIES.length} categories. Filter by name or category; cards marked “live” render the real component.`}
          />

          {/* controls */}
          <div className="mt-8 flex flex-col gap-4">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search components…"
                aria-label="Search components"
                className="h-11 w-full rounded-lg border border-border bg-surface-raised pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-fg/30"
              />
              {q ? (
                <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-fg-subtle hover:text-fg">
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {(['All', ...CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                    cat === c ? 'bg-accent text-accent-contrast' : 'border border-border text-fg-muted hover:text-fg',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* grouped list */}
          {filtered.length === 0 ? (
            <div className="mt-16 text-center text-fg-subtle">No components match “{q}”.</div>
          ) : (
            CATEGORIES.map((c) => {
              const items = filtered.filter((e) => e.category === c)
              if (items.length === 0) return null
              return (
                <section key={c} className="mt-12">
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-display text-xl font-semibold text-fg">{c}</h2>
                    <span className="text-caption text-fg-subtle">{items.length}</span>
                  </div>
                  <motion.div
                    variants={pickMotionVariant(staggerContainer(0.05), reduced)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.1, once: true }}
                    className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {items.map((e) => (
                      <Card key={e.name} e={e} reduced={reduced} />
                    ))}
                  </motion.div>
                </section>
              )
            })
          )}

          <div className="mt-16">
            <Divider />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-fg-muted">
                Live pages: <Link className="text-fg underline underline-offset-4" href="/dashboard">Dashboard</Link> ·{' '}
                <Link className="text-fg underline underline-offset-4" href="/pricing">Pricing</Link> ·{' '}
                <Link className="text-fg underline underline-offset-4" href="/login">Auth</Link> ·{' '}
                <Link className="text-fg underline underline-offset-4" href="/">Home</Link>
              </p>
              <Button href="/" variant="secondary" size="sm">← Back home</Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
