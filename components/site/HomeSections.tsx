'use client'

import * as React from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import {
  Layers,
  Wand2,
  Gauge,
  Accessibility,
  Palette,
  MousePointerClick,
  Check,
  Info,
  Plus,
  X,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeader, Eyebrow } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Modal } from '@/components/ui/Modal'
import { Accordion } from '@/components/ui/Accordion'
import { Tabs } from '@/components/ui/Tabs'
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip'
import { Carousel, type Slide } from '@/components/ui/Carousel'
import { Gallery, type GalleryItem } from '@/components/ui/Gallery'
import { Field } from '@/components/ui/Field'
import { Stepper, type Step } from '@/components/ui/Stepper'
import { ProgressBar, ProgressRing } from '@/components/ui/Progress'
import { Skeleton } from '@/components/ui/Skeleton'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/Badge'
import { Divider } from '@/components/ui/Divider'
import { Card } from '@/components/ui/Card'
import { Chat } from '@/components/ui/Chat'
import { QRCode } from '@/components/ui/QRCode'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { TestimonialWall } from '@/components/ui/Testimonials'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { cn } from '@/lib/utils/cn'
import { fadeUp, pickMotionVariant, staggerContainer } from '@/lib/motion/variants'

/* ------------------------------------------------------------------ Features */

const FEATURES = [
  { icon: Layers, title: 'Composable primitives', body: 'Container, Section, Button and friends are small, orthogonal, and type-safe.' },
  { icon: Wand2, title: 'Motion foundation', body: 'Shared Framer Motion variants — fade, slide, stagger — with zero overshoot.' },
  { icon: Gauge, title: 'Performance-first', body: 'Only transform/opacity animate; GPU-composited, code-split per route, no layout thrash.' },
  { icon: Accessibility, title: 'Accessible by default', body: 'Keyboard focus rings, ARIA on every control, prefers-reduced-motion honoured.' },
  { icon: Palette, title: 'Design tokens', body: 'Semantic colour vars drive light/dark. Type scale is fluid with clamp().' },
  { icon: MousePointerClick, title: 'Micro-interactions', body: 'Magnetic buttons, spring taps, count-ups, and hover shine — all subtle.' },
]

export function FeaturesSection() {
  const reduced = !!useReducedMotion()
  return (
    <Section id="features">
      <Container size="xl">
        <SectionHeader
          eyebrow="Components"
          title="Everything you need to build a calm, confident interface"
          lede="A compact system of primitives and patterns — each one real, each one accessible, all sharing the same quiet motion language."
        />
        <motion.div
          variants={pickMotionVariant(staggerContainer(0.08), reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2, once: true }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={pickMotionVariant(fadeUp, reduced)}
              whileHover={reduced ? undefined : { y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="surface-card group flex flex-col gap-3 p-6 transition-shadow hover:shadow-elevation4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-border text-fg transition-colors group-hover:bg-accent group-hover:text-accent-contrast">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="text-h3 font-display font-semibold">{f.title}</h3>
              <p className="text-body text-fg-muted">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  )
}

/* ------------------------------------------------------------------ Showcase */

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'link'] as const

export function ShowcaseSection() {
  const reduced = !!useReducedMotion()
  const [checked, setChecked] = React.useState(true)
  return (
    <Section id="showcase" tone="raised">
      <Container size="xl">
        <SectionHeader
          eyebrow="In the wild"
          title="A preview of the building blocks"
          lede="Buttons, a toggle, a theme switch, and a loading skeleton — live and interactive."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* buttons */}
          <motion.div variants={pickMotionVariant(fadeUp, reduced)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="surface-card p-6">
            <p className="text-caption uppercase tracking-[0.16em] text-fg-subtle">Buttons</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {VARIANTS.map((v) => (
                <Button key={v} variant={v}>
                  {v}
                </Button>
              ))}
            </div>
            <p className="mt-6 text-caption uppercase tracking-[0.16em] text-fg-subtle">Magnetic</p>
            <div className="mt-4 flex items-center gap-4 py-3">
              <MagneticButton size="lg">
                Hover me
                <Wand2 className="h-4 w-4" />
              </MagneticButton>
              <span className="text-sm text-fg-muted">The button leans toward your cursor.</span>
            </div>
          </motion.div>

          {/* switch + theme */}
          <motion.div variants={pickMotionVariant(fadeUp, reduced)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="surface-card p-6">
            <p className="text-caption uppercase tracking-[0.16em] text-fg-subtle">Controls</p>
            <div className="mt-4 flex items-center gap-4">
              <button
                role="switch"
                aria-checked={checked}
                onClick={() => setChecked((c) => !c)}
                className={cnSwitch(checked)}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  className="block h-5 w-5 rounded-full bg-white shadow-elevation2"
                />
              </button>
              <span className="text-sm text-fg-muted">Email notifications</span>
              <span className="ml-auto">
                <ThemeToggle />
              </span>
            </div>
            <div className="mt-6">
              <p className="mb-2 text-caption text-fg-subtle">Loading skeleton</p>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}

function cnSwitch(on: boolean) {
  return [
    'relative inline-flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-200',
    on ? 'bg-accent justify-end' : 'bg-border justify-start',
  ].join(' ')
}

/* ------------------------------------------------------------------- Metrics */

const STATS = [
  { value: 40, suffix: '+', label: 'Components & patterns' },
  { value: 12, suffix: '', label: 'Motion presets' },
  { value: 100, suffix: '%', label: 'Keyboard reachable' },
  { value: 3, suffix: 'ms', label: 'Median interaction latency', decimals: 0 },
]

function StatCard({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [start, setStart] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStart(true), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const n = useCountUp(value, { start, precision: decimals, duration: 1400 })
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span className="font-display text-display font-bold tabular-nums tracking-tight">
        {n}
        <span className="brand-gradient-text">{suffix}</span>
      </span>
      <span className="mt-2 text-sm text-fg-muted">{label}</span>
    </div>
  )
}

export function MetricsSection() {
  return (
    <Section id="metrics">
      <Container size="xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

/* ------------------------------------------------------------------- Pricing */

const PLANS = [
  { name: 'Starter', price: 0, blurb: 'For side projects.', features: ['Core primitives', 'Light/dark', 'Community support'], highlight: false },
  { name: 'Pro', price: 24, blurb: 'For working teams.', features: ['Everything in Starter', 'Advanced motion presets', 'Figma file', 'Priority support'], highlight: true },
  { name: 'Studio', price: 79, blurb: 'For agencies.', features: ['Everything in Pro', 'Unlimited seats', 'Onboarding', 'SLA'], highlight: false },
]

export function PricingSection() {
  const reduced = !!useReducedMotion()
  return (
    <Section id="pricing" tone="raised">
      <Container size="xl">
        <SectionHeader
          align="center"
          className="items-center mx-auto"
          eyebrow="Pricing"
          title="Simple plans, honest pricing"
          lede="Start free. Upgrade when the system starts shipping product for you."
        />
        <motion.div
          variants={pickMotionVariant(staggerContainer(0.1), reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2, once: true }}
          className="mt-12 grid items-stretch gap-5 md:grid-cols-3"
        >
          {PLANS.map((p) => (
            <motion.div
              key={p.name}
              variants={pickMotionVariant(fadeUp, reduced)}
              whileHover={reduced ? undefined : { y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className={[
                'relative flex flex-col gap-6 rounded-2xl border p-7 transition-shadow',
                p.highlight
                  ? 'border-transparent bg-surface-raised shadow-elevation5 ring-2 ring-fg'
                  : 'border-border bg-surface-raised shadow-elevation2',
              ].join(' ')}
            >
              {p.highlight ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] px-3 py-1 text-caption font-semibold uppercase tracking-widest text-[#1a1a1a]">
                  Most popular
                </span>
              ) : null}
              <div>
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-fg-muted">{p.blurb}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-display text-4xl font-bold">${p.price}</span>
                <span className="mb-1 text-sm text-fg-subtle">/mo</span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-fg-muted">
                    <Check className="h-4 w-4 text-fg" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.highlight ? 'primary' : 'secondary'} fullWidth>
                {p.price === 0 ? 'Get started' : 'Choose ' + p.name}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  )
}

/* ----------------------------------------------------------------------- CTA */

export function CTASection() {
  const reduced = !!useReducedMotion()
  return (
    <Section id="get-started">
      <Container size="xl">
        <motion.div
          variants={pickMotionVariant(fadeUp, reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-raised to-surface px-8 py-16 text-center shadow-elevation4 sm:px-16"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial opacity-70" />
          <div className="relative">
            <Eyebrow className="justify-center">Get started</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-[18ch] text-h1 font-display font-bold">
              Build interfaces that feel <span className="brand-gradient-text">set, not styled.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-lead text-fg-muted">
              Drop the system into a new or existing app and start shipping in minutes — real
              components, quiet motion, no config required.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href="#top" size="lg">
                Start building
              </Button>
              <Button href="#showcase" variant="secondary" size="lg">
                Browse the gallery
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}

/* ---------------------------------------------------------------- Interactive */

const FAQ = [
  { q: 'Is it accessible out of the box?', a: 'Yes — every interactive control is built on Radix primitives, so keyboard focus, ARIA roles, and screen-reader state come for free, plus visible focus rings throughout.' },
  { q: 'Does it respect reduced motion?', a: 'All Framer Motion variants swap to an instant or near-instant (≤120ms) version when prefers-reduced-motion is on, and count-ups jump straight to their target.' },
  { q: 'How is theming handled?', a: 'Colours are semantic CSS custom properties. Toggling the `dark` class on <html> swaps the whole palette — no duplicated Tailwind classes.' },
  { q: 'Can I use it on an existing site?', a: 'Absolutely — the primitives are dependency-light (clsx + tailwind-merge + framer-motion) and drop into any Next.js 14 App Router project.' },
]

export function InteractiveSection() {
  const [open, setOpen] = React.useState(false)
  return (
    <Section id="interactive">
      <Container size="xl">
        <SectionHeader
          eyebrow="Interaction"
          title="Disciplined overlays, disclosures, and hints"
          lede="Accordion, Tabs, Modal and Tooltip — each keyboard-accessible, each animated with the same quiet language."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Accordion items={FAQ} />

          <div className="flex flex-col gap-8">
            <Tabs
              tabs={[
                { value: 'design', label: 'Design', content: <TabPanel title="Design tokens" body="Colours, radii, shadows and a fluid type scale are declared once and referenced everywhere by name." /> },
                { value: 'motion', label: 'Motion', content: <TabPanel title="Motion presets" body="A handful of tuned variants — fade, slide, stagger — reused across every component for consistency." /> },
                { value: 'a11y', label: 'A11y', content: <TabPanel title="Accessibility" body="Focus traps, labelled controls, reduced-motion fallbacks and AA-contrast tokens are part of the base layer." /> },
              ]}
            />

            <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-2">
                <span className="font-display text-[1.05rem] font-medium text-fg">Need the details?</span>
                <TooltipProvider delayDuration={150}>
                  <Tooltip label="Opens a fully-trapped, ESC-dismissible dialog">
                    <button type="button" aria-label="More info" className="grid h-6 w-6 place-items-center rounded-full text-fg-subtle transition-colors hover:text-fg">
                      <Info className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setOpen(true)}>Open modal</Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Everything is componentized"
        description="This dialog uses Radix's focus trap, ESC handling and scroll lock, with a Framer scale+opacity entrance."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Got it</Button>
          </>
        }
      >
        Drop the system into a new or existing app and start shipping — real, accessible components with no configuration required.
      </Modal>
    </Section>
  )
}

function TabPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="surface-card p-5">
      <h4 className="font-display text-[1.05rem] font-semibold text-fg">{title}</h4>
      <p className="mt-2 text-body text-fg-muted">{body}</p>
    </div>
  )
}

/* --------------------------------------------------------------------- Media */

const SLIDES: Slide[] = [
  { title: 'Composition over configuration', body: 'Small, orthogonal primitives snap together into pages without bespoke glue.', from: '#f5c9a0', to: '#c9a3ff' },
  { title: 'Motion with restraint', body: 'A single tuned language — fade, slide, stagger — so movement reads as calm, never busy.', from: '#c9a3ff', to: '#a4d1ff' },
  { title: 'Accessible by default', body: 'Focus traps, ARIA state and reduced-motion fallbacks are baked into the base layer.', from: '#a4d1ff', to: '#f5c9a0' },
]

const GALLERY: GalleryItem[] = [
  { id: 'g1', cat: 'Product', title: 'Launch hero', from: '#f6d365', to: '#fda085', span: 'big' },
  { id: 'g2', cat: 'Editorial', title: 'Long-form', from: '#c9a3ff', to: '#a4d1ff' },
  { id: 'g3', cat: 'Product', title: 'Pricing panel', from: '#a4d1ff', to: '#d4f8e0' },
  { id: 'g4', cat: 'Brand', title: 'Identity', from: '#ff9a9e', to: '#fbc2eb', span: 'tall' },
  { id: 'g5', cat: 'Editorial', title: 'Feature grid', from: '#f5c9a0', to: '#c9a3ff' },
  { id: 'g6', cat: 'Brand', title: 'Color study', from: '#84fab0', to: '#8fd3f4', span: 'wide' },
  { id: 'g7', cat: 'Product', title: 'Dashboard', from: '#a6c0f3', to: '#c2e9fb' },
  { id: 'g8', cat: 'Editorial', title: 'Testimonials', from: '#fbc2eb', to: '#a6c1ee' },
]

export function MediaSection() {
  const reduced = !!useReducedMotion()
  return (
    <Section id="media">
      <Container size="xl">
        <SectionHeader
          eyebrow="Media"
          title="Showcase the work"
          lede="A drag-swipeable carousel and a FLIP-filtering gallery with a keyboard lightbox — both fully self-contained."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">Carousel</p>
            <Carousel slides={SLIDES} autoPlay={!reduced} />
          </div>
          <div>
            <p className="mb-3 text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">Gallery</p>
            <Gallery items={GALLERY} />
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-3 text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">Video player</p>
          <div className="mx-auto max-w-3xl">
            <VideoPlayer />
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* ------------------------------------------------------------------ Voices */

export function VoicesSection() {
  return (
    <Section id="voices" tone="raised">
      <Container size="xl">
        <SectionHeader
          eyebrow="Testimonials"
          title="What teams say once they stop fighting the toolkit"
          lede="A masonry wall of quotes — gradient avatars, a star rating that lights up one by one on scroll, and a whisper of tilt on hover."
        />
        <div className="mt-12">
          <TestimonialWall />
        </div>
      </Container>
    </Section>
  )
}

/* ---------------------------------------------------------------- Comms */

export function CommsSection() {
  const reduced = !!useReducedMotion()
  return (
    <Section id="comms">
      <Container size="xl">
        <SectionHeader
          eyebrow="Comms"
          title="Real-time feel, shareable output"
          lede="A live chat thread with spring-in bubbles, an animated typing indicator and auto-scroll — beside a QR panel that draws itself in and can be copied or downloaded."
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            variants={pickMotionVariant(fadeUp, reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="mb-3 text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">
              Chat thread
            </p>
            <Chat />
          </motion.div>

          <motion.div
            variants={pickMotionVariant(fadeUp, reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <QRCode value="https://kombai.com" label="Scan to visit" />
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}

/* ------------------------------------------------------------------- Elements */

const CARDS = [
  {
    eyebrow: 'Featured',
    title: 'Design tokens',
    body: 'Colours, radii, shadows and a fluid type scale, declared once as CSS variables.',
    tone: 'brand',
    from: '#f5c9a0',
    to: '#c9a3ff',
    status: 'Stable',
  },
  {
    eyebrow: 'Motion',
    title: 'Quiet variants',
    body: 'A small tuned set — fade, slide, stagger — reused everywhere for consistency.',
    tone: 'info',
    from: '#a4d1ff',
    to: '#84fab0',
    status: 'Stable',
  },
  {
    eyebrow: 'Access',
    title: 'Reduced motion',
    body: 'Every animation collapses to instant transitions under the OS preference.',
    tone: 'success',
    from: '#84fab0',
    to: '#f5c9a0',
    status: 'New',
  },
]

const SETTINGS: { key: string; label: string; hint: string; initial: boolean }[] = [
  { key: 'email', label: 'Email notifications', hint: 'Product updates and receipts.', initial: true },
  { key: 'weekly', label: 'Weekly recap', hint: 'Every Monday, one email.', initial: false },
  { key: 'mentions', label: 'Mentions & replies', hint: 'When someone @-mentions you.', initial: true },
]

export function ElementsSection() {
  const [toggles, setToggles] = React.useState<Record<string, boolean>>(
    () => SETTINGS.reduce<Record<string, boolean>>((m, s) => ({ ...m, [s.key]: s.initial }), {}),
  )
  const setToggle = (k: string) => (v: boolean) => setToggles((t) => ({ ...t, [k]: v }))

  return (
    <Section id="elements">
      <Container size="xl">
        <SectionHeader
          eyebrow="Elements"
          title="Small pieces, sharp edges"
          lede="Cards, badges, dividers and toggles — the atoms everything above composes from."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {CARDS.map((c) => (
            <Card
              key={c.title}
              eyebrow={c.eyebrow}
              title={c.title}
              headerRight={<Badge tone={c.tone as 'brand' | 'info' | 'success'} dot>{c.status}</Badge>}
              media={
                <div
                  className="h-full w-full"
                  style={{ backgroundImage: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                />
              }
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-caption text-fg-subtle">v2.4 · updated today</span>
                  <Button href="#get-started" variant="ghost" size="sm">
                    Learn more →
                  </Button>
                </div>
              }
            >
              {c.body}
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Toggles panel */}
          <div className="surface-card p-6">
            <p className="text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">Preferences</p>
            <div className="mt-4 flex flex-col gap-4">
              {SETTINGS.map((s, i) => (
                <React.Fragment key={s.key}>
                  {i > 0 ? <Divider variant="fade" /> : null}
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-[0.95rem] font-medium text-fg">{s.label}</p>
                      <p className="text-caption text-fg-subtle">{s.hint}</p>
                    </div>
                    <Toggle
                      checked={!!toggles[s.key]}
                      onChange={setToggle(s.key)}
                      label={s.label}
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Badge + divider panel */}
          <div className="surface-card p-6">
            <p className="text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">Badges & dividers</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone="brand" dot>New</Badge>
              <Badge tone="success">Stable</Badge>
              <Badge tone="warning">Beta</Badge>
              <Badge tone="danger">Deprecated</Badge>
              <Badge tone="info">Docs</Badge>
              <Badge tone="outline">Outline</Badge>
              <Badge tone="default" size="xs">
                xs
              </Badge>
              <Badge tone="default" size="md">
                md
              </Badge>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <Divider label="or" variant="fade" />
              <p className="text-sm text-fg-muted">
                A labelled divider keeps related sections visually separate without shouting.
              </p>
              <div className="flex h-8 items-center gap-4 text-sm text-fg-muted">
                <span>Inline</span>
                <Divider vertical />
                <span>content</span>
                <Divider vertical />
                <span>flows</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

type FormState = { email: string; password: string; name: string; role: string }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function FormSection() {
  const [step, setStep] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [form, setForm] = React.useState<FormState>({ email: '', password: '', name: '', role: '' })
  const [touched, setTouched] = React.useState<Record<keyof FormState, boolean>>({
    email: false,
    password: false,
    name: false,
    role: false,
  })

  const set = (k: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  const errors: Partial<Record<keyof FormState, string>> = {}
  if (!EMAIL_RE.test(form.email)) errors.email = 'Enter a valid email address'
  if (form.password.length < 8) errors.password = 'At least 8 characters'
  if (form.name.trim().length < 2) errors.name = 'Tell us your name'
  if (!form.role) errors.role = 'Pick a role'

  const stepValid = (i: number) =>
    i === 0 ? !errors.email && !errors.password : i === 1 ? !errors.name && !errors.role : true

  const filled = (['email', 'password', 'name', 'role'] as (keyof FormState)[]).filter(
    (k) => !errors[k],
  ).length
  const progress = Math.round((filled / 4) * 100)

  const steps: Step[] = [
    {
      title: 'Account',
      description: 'Email & password',
      content: (
        <div className="flex flex-col gap-4">
          <Field
            label="Work email"
            type="email"
            value={form.email}
            onChange={set('email')}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            state={touched.email && errors.email ? 'error' : touched.email && form.email ? 'success' : 'idle'}
            message={touched.email && errors.email ? errors.email : undefined}
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={set('password')}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            state={
              touched.password && errors.password
                ? 'error'
                : touched.password && form.password
                  ? 'success'
                  : 'idle'
            }
            message={touched.password && errors.password ? errors.password : undefined}
          />
        </div>
      ),
    },
    {
      title: 'Profile',
      description: 'Name & role',
      content: (
        <div className="flex flex-col gap-4">
          <Field
            label="Full name"
            value={form.name}
            onChange={set('name')}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            state={touched.name && errors.name ? 'error' : touched.name && form.name ? 'success' : 'idle'}
            message={touched.name && errors.name ? errors.name : undefined}
          />
          <Field
            label="Role (Design / Engineering / Product)"
            value={form.role}
            onChange={set('role')}
            onBlur={() => setTouched((t) => ({ ...t, role: true }))}
            state={
              touched.role && errors.role ? 'error' : touched.role && form.role ? 'success' : 'idle'
            }
            message={touched.role && errors.role ? errors.role : undefined}
          />
        </div>
      ),
    },
    {
      title: 'Review',
      description: 'Confirm & submit',
      content: (
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">Summary</p>
          <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-fg-muted">Email</dt>
            <dd className="text-fg">{form.email || '—'}</dd>
            <dt className="text-fg-muted">Name</dt>
            <dd className="text-fg">{form.name || '—'}</dd>
            <dt className="text-fg-muted">Role</dt>
            <dd className="text-fg">{form.role || '—'}</dd>
          </dl>
        </div>
      ),
    },
  ]

  const submit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setDone(true)
    }, 1400)
  }

  const reset = () => {
    setDone(false)
    setStep(0)
    setForm({ email: '', password: '', name: '', role: '' })
    setTouched({ email: false, password: false, name: false, role: false })
  }

  return (
    <Section id="form" tone="raised">
      <Container size="xl">
        <SectionHeader
          eyebrow="Forms"
          title="Validation that feels considered"
          lede="Floating labels, a center-out focus bar, an error shake, a drawn success check, and a stepper that remembers where you are."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="surface-card lg:col-span-3 p-6 sm:p-8">
            {done ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <ProgressRing value={100} size={72} stroke={7} formatValue={() => <Check className="h-6 w-6 text-success" />} />
                <h4 className="font-display text-h3 font-semibold text-fg">You’re all set</h4>
                <p className="max-w-[32ch] text-body text-fg-muted">
                  This demo validated, submitted and completed without ever leaving the component.
                </p>
                <Button variant="secondary" onClick={reset}>
                  Start over
                </Button>
              </div>
            ) : submitting ? (
              <div className="flex flex-col gap-4">
                <Skeleton lines={3} />
                <Skeleton className="h-10 w-40 rounded-lg" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-caption text-fg-subtle">
                    <span>Profile completeness</span>
                    <span>{progress}%</span>
                  </div>
                  <ProgressBar value={progress} label="Profile completeness" />
                </div>

                <Stepper steps={steps} current={step} onStepChange={(i) => i <= step && setStep(i)} />

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                    Back
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button onClick={() => stepValid(step) && setStep((s) => s + 1)} disabled={!stepValid(step)}>
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={submit} disabled={!stepValid(0) || !stepValid(1)}>
                      Submit
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          <aside className="lg:col-span-2">
            <div className="surface-card p-6">
              <p className="text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">Why it feels right</p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-fg-muted">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-fg" /> Labels float up only when focused or filled — no jitter.
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-fg" /> Errors shake once and announce via aria-live; success draws a check.
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-fg" /> You can’t advance past an invalid step; you can always go back.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  )
}

/* ------------------------------------------------------------------- Wizard */

const ROLES = ['Developer', 'Designer', 'Product', 'Founder'] as const
type Invite = { email: string; role: string }

const WIZ_META: Step[] = [
  { title: 'Create account', description: 'Email & password' },
  { title: 'Name your workspace', description: 'Where your team lives' },
  { title: 'Invite teammates', description: 'Optional — skip anytime' },
  { title: 'Review & finish', description: 'Confirm the details' },
]

export function WizardSection() {
  const reduced = !!useReducedMotion()
  const [current, setCurrent] = React.useState(0)
  const [done, setDone] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [workspace, setWorkspace] = React.useState('')
  const [invites, setInvites] = React.useState<Invite[]>([])
  const [draftEmail, setDraftEmail] = React.useState('')
  const [draftRole, setDraftRole] = React.useState<string>('Developer')
  const [submitting, setSubmitting] = React.useState(false)

  const emailOk = EMAIL_RE.test(email)
  const stepValid = (i: number) =>
    i === 0 ? emailOk && password.length >= 8 : i === 1 ? workspace.trim().length >= 2 : true

  const addInvite = () => {
    const e = draftEmail.trim()
    if (!EMAIL_RE.test(e)) return
    if (invites.some((v) => v.email.toLowerCase() === e.toLowerCase())) {
      setDraftEmail('')
      return
    }
    setInvites((list) => [...list, { email: e, role: draftRole }])
    setDraftEmail('')
  }
  const removeInvite = (em: string) => setInvites((l) => l.filter((v) => v.email !== em))

  const finish = () => {
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setDone(true)
    }, 1200)
  }
  const reset = () => {
    setDone(false)
    setCurrent(0)
    setEmail('')
    setPassword('')
    setWorkspace('')
    setInvites([])
  }

  const panels: React.ReactNode[] = [
    <div key="0" className="flex flex-col gap-4">
      <Field label="Work email" type="email" autoComplete="email" value={email} onChange={setEmail} state={email && !emailOk ? 'error' : email ? 'success' : 'idle'} message={email && !emailOk ? 'Enter a valid email address' : undefined} />
      <Field label="Password" type="password" autoComplete="new-password" value={password} onChange={setPassword} state={password.length > 0 && password.length < 8 ? 'error' : 'idle'} message={password.length > 0 && password.length < 8 ? 'At least 8 characters' : undefined} />
    </div>,
    <div key="1" className="flex flex-col gap-4">
      <Field label="Workspace name" value={workspace} onChange={setWorkspace} state={workspace.trim() ? 'success' : 'idle'} />
      <p className="text-caption text-fg-subtle">You can rename it later. This becomes your subdomain: kombai.app/{workspace.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'your-team'}.</p>
    </div>,
    <div key="2" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="Teammate email" type="email" value={draftEmail} onChange={setDraftEmail} />
        </div>
        <div className="sm:w-40">
          <p className="mb-1.5 text-caption text-fg-subtle">Role</p>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={draftRole === r}
                onClick={() => setDraftRole(r)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  draftRole === r ? 'bg-accent text-accent-contrast' : 'border border-border text-fg-muted hover:text-fg',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <Button type="button" variant="secondary" onClick={addInvite} disabled={!EMAIL_RE.test(draftEmail.trim())}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      {invites.length ? (
        <motion.ul layout className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {invites.map((v) => (
              <motion.li
                key={v.email}
                layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12, height: 0 }}
                transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                className="flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-surface px-3 py-2"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#f5c9a0] to-[#c9a3ff] text-xs font-bold text-white">
                  {v.email[0]?.toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-fg">{v.email}</span>
                <Badge tone="info">{v.role}</Badge>
                <button type="button" onClick={() => removeInvite(v.email)} aria-label={`Remove ${v.email}`} className="grid h-6 w-6 place-items-center rounded-md text-fg-subtle hover:bg-surface-raised hover:text-fg">
                  <X className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <p className="text-caption text-fg-subtle">No invites yet — that is fine, you can add them after setup.</p>
      )}
    </div>,
    <div key="3" className="rounded-xl border border-border bg-surface p-5">
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
        <dt className="text-fg-muted">Email</dt>
        <dd className="text-fg">{email || '—'}</dd>
        <dt className="text-fg-muted">Workspace</dt>
        <dd className="text-fg">{workspace || '—'}</dd>
        <dt className="text-fg-muted">Invites</dt>
        <dd className="text-fg">{invites.length ? `${invites.length} teammate${invites.length > 1 ? 's' : ''}` : 'None'}</dd>
      </dl>
    </div>,
  ]

  return (
    <Section id="wizard" tone="raised">
      <Container size="xl">
        <SectionHeader
          eyebrow="Onboarding"
          title="A multi-step wizard on the vertical stepper"
          lede="The same Stepper in its vertical orientation — a rail of states on the left, one animated panel on the right. Steps validate in place, invites add and collapse with FLIP, and you can jump back to anything you have already finished."
        />

        <div className="surface-card mt-12 grid gap-8 p-6 sm:p-8 lg:grid-cols-[240px_1fr]">
          <Stepper
            orientation="vertical"
            steps={WIZ_META}
            current={done ? WIZ_META.length : current}
            onStepChange={(i) => !done && i <= current && setCurrent(i)}
          />

          <div className="lg:border-l lg:border-border lg:pl-8">
            {done ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-6 text-center">
                <ProgressRing value={100} size={72} stroke={7} formatValue={() => <Check className="h-6 w-6 text-success" />} />
                <h4 className="font-display text-h3 font-semibold text-fg">Workspace ready</h4>
                <p className="max-w-[34ch] text-body text-fg-muted">
                  {workspace ? `“${workspace}”` : 'Your workspace'} is set up{invites.length ? ` with ${invites.length} invite${invites.length > 1 ? 's' : ''}` : ''}.
                </p>
                <Button variant="secondary" onClick={reset}>Run it again</Button>
              </div>
            ) : (
              <>
                <p className="text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  Step {current + 1} of {WIZ_META.length}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-fg">{WIZ_META[current].title}</h3>
                <div className="mt-5 min-h-[180px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                    >
                      {panels[current]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setCurrent((s) => Math.max(0, s - 1))} disabled={current === 0}>
                    Back
                  </Button>
                  {current < WIZ_META.length - 1 ? (
                    <Button onClick={() => stepValid(current) && setCurrent((s) => s + 1)} disabled={!stepValid(current)}>
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={finish} disabled={submitting}>
                      {submitting ? 'Finishing…' : 'Finish setup'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
