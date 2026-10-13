'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Minus, Sparkles, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeader, Eyebrow } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Accordion } from '@/components/ui/Accordion'
import { BackToTop } from '@/components/ui/BackToTop'
import { useAnimatedNumber } from '@/lib/hooks/useAnimatedNumber'
import { fadeUp, staggerContainer, pickMotionVariant } from '@/lib/motion/variants'
import { cn } from '@/lib/utils/cn'

type Plan = {
  id: string
  name: string
  tagline: string
  monthly: number
  annualMonthly: number
  cta: string
  featured?: boolean
  custom?: boolean
}

const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', tagline: 'For side projects and evaluation.', monthly: 0, annualMonthly: 0, cta: 'Start free' },
  { id: 'pro', name: 'Pro', tagline: 'For working product teams.', monthly: 24, annualMonthly: 19, cta: 'Choose Pro', featured: true },
  { id: 'studio', name: 'Studio', tagline: 'For agencies and studios.', monthly: 79, annualMonthly: 63, cta: 'Choose Studio' },
  { id: 'enterprise', name: 'Enterprise', tagline: 'For orgs with procurement.', monthly: 0, annualMonthly: 0, cta: 'Contact sales', custom: true },
]

type Cell = boolean | string
const MATRIX: { group: string; rows: { name: string; cells: [Cell, Cell, Cell, Cell] }[] }[] = [
  {
    group: 'Design system',
    rows: [
      { name: 'Composable primitives', cells: ['All core', 'All', 'All', 'All + custom'] },
      { name: 'Light & dark themes', cells: [true, true, true, true] },
      { name: 'Fluid type scale', cells: [true, true, true, true] },
      { name: 'Figma source file', cells: [false, true, true, true] },
    ],
  },
  {
    group: 'Motion',
    rows: [
      { name: 'Core motion variants', cells: [true, true, true, true] },
      { name: 'Advanced presets', cells: [false, true, true, true] },
      { name: 'Reduced-motion fallbacks', cells: [true, true, true, true] },
    ],
  },
  {
    group: 'Team & support',
    rows: [
      { name: 'Seats', cells: ['1', '10', 'Unlimited', 'Unlimited'] },
      { name: 'Community support', cells: [true, true, true, true] },
      { name: 'Priority support', cells: [false, true, true, true] },
      { name: 'Onboarding & SLA', cells: [false, false, true, true] },
    ],
  },
]

const FAQ = [
  { q: 'How does annual billing work?', a: 'Pick annual and we bill once for twelve months at roughly a 20% discount versus the monthly rate. Switch back anytime — the difference is prorated.' },
  { q: 'Can I change plans later?', a: 'Yes. Upgrades apply instantly and are prorated to the day; downgrades take effect at the start of your next cycle so you keep what you paid for.' },
  { q: 'Is there a free tier?', a: 'Starter is free forever with the core primitives, themes and motion language — no card required. Upgrade when the system starts shipping real product for you.' },
  { q: 'What counts as a seat?', a: 'A seat is one person editing or consuming the tokens in code or Figma. Viewers and read-only CI are always free.' },
]

function BillingToggle({ annual, onChange }: { annual: boolean; onChange: (v: boolean) => void }) {
  const reduced = !!useReducedMotion()
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-raised p-1">
      {(['monthly', 'annual'] as const).map((m) => {
        const on = (m === 'annual') === annual
        return (
          <button
            key={m}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(m === 'annual')}
            className={cn(
              'relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              on ? 'text-accent-contrast' : 'text-fg-muted hover:text-fg',
            )}
          >
            {on ? (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="flex items-center gap-1.5">
              {m === 'annual' ? 'Annual' : 'Monthly'}
              {m === 'annual' ? (
                <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-semibold', on ? 'bg-white/20 text-white' : 'bg-success/15 text-success')}>
                  −20%
                </span>
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function Price({ plan, annual }: { plan: Plan; annual: boolean }) {
  const target = annual ? plan.annualMonthly : plan.monthly
  const shown = useAnimatedNumber(target, { duration: 550 })
  if (plan.custom) {
    return <div className="font-display text-4xl font-bold tracking-tight text-fg">Custom</div>
  }
  return (
    <div className="flex items-end gap-1">
      <span className="font-display text-5xl font-bold tabular-nums tracking-tight text-fg">${Math.round(shown)}</span>
      <span className="mb-1.5 text-sm text-fg-subtle">/mo</span>
    </div>
  )
}

function PlanCard({ plan, annual, reduced }: { plan: Plan; annual: boolean; reduced: boolean }) {
  const inner = (
    <div
      className={cn(
        'flex h-full flex-col gap-6 rounded-2xl p-7',
        plan.featured ? 'bg-surface-raised' : 'border border-border bg-surface-raised',
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold text-fg">{plan.name}</h3>
        {plan.featured ? (
          <Badge tone="brand" size="md">
            <Sparkles className="h-3 w-3" /> Popular
          </Badge>
        ) : null}
      </div>

      <div>
        <Price plan={plan} annual={annual} />
        <p className="mt-1 text-caption text-fg-subtle">
          {plan.custom
            ? 'Volume pricing, invoiced'
            : plan.monthly === 0
              ? 'Free forever'
              : annual
                ? `Billed $${plan.annualMonthly * 12}/year`
                : 'Billed monthly'}
        </p>
      </div>

      <p className="text-sm text-fg-muted">{plan.tagline}</p>

      <Button
        variant={plan.featured ? 'primary' : 'secondary'}
        fullWidth
        href="/login"
      >
        {plan.cta}
      </Button>

      <ul className="mt-1 flex flex-col gap-2.5 text-sm">
        {MATRIX.flatMap((g) => g.rows)
          .slice(0, 5)
          .map((row) => {
            const idx = PLANS.findIndex((p) => p.id === plan.id)
            const cell = row.cells[idx]
            const on = cell !== false
            return (
              <li key={row.name} className={cn('flex items-center gap-2', on ? 'text-fg-muted' : 'text-fg-subtle line-through')}>
                {on ? <Check className="h-4 w-4 shrink-0 text-fg" strokeWidth={2.5} /> : <Minus className="h-4 w-4 shrink-0" />}
                {row.name}
              </li>
            )
          })}
      </ul>
    </div>
  )

  return (
    <motion.div
      variants={pickMotionVariant(fadeUp, reduced)}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={cn(
        'relative h-full rounded-2xl transition-shadow',
        plan.featured
          ? 'bg-gradient-to-b from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] p-[1.5px] shadow-elevation5 lg:-mt-4 lg:mb-[-1rem]'
          : 'hover:shadow-elevation4',
      )}
    >
      {plan.featured ? <div className="h-full rounded-[calc(1rem-1.5px)]">{inner}</div> : inner}
    </motion.div>
  )
}

function MatrixCell({ value }: { value: Cell }) {
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-fg-subtle" />
  if (value === true) return <Check className="mx-auto h-4 w-4 text-fg" strokeWidth={2.5} />
  return <span className="text-sm text-fg">{value}</span>
}

export default function PricingPage() {
  const reduced = !!useReducedMotion()
  const [annual, setAnnual] = React.useState(true)

  return (
    <div className="min-h-screen bg-surface text-fg">
      {/* header band */}
      <Section id="top" reveal={false}>
        <Container size="xl">
          <SectionHeader
            align="center"
            className="items-center mx-auto"
            eyebrow="Pricing"
            title={<span>Plans that scale with <span className="brand-gradient-text">how you build</span></span>}
            lede="Start free on the core system. Upgrade for advanced motion, Figma source and team support. Every number below is real — toggle the billing period and watch it move."
          />
          <div className="mt-8 flex justify-center">
            <BillingToggle annual={annual} onChange={setAnnual} />
          </div>
        </Container>
      </Section>

      {/* plan cards */}
      <Container size="xl">
        <motion.div
          variants={pickMotionVariant(staggerContainer(0.09), reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2, once: true }}
          className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} annual={annual} reduced={reduced} />
          ))}
        </motion.div>
      </Container>

      {/* comparison */}
      <Section id="compare" tone="raised" className="mt-16">
        <Container size="xl">
          <SectionHeader eyebrow="Compare" title="Everything, side by side" lede="The full breakdown across all four plans." />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-surface-raised py-4 pr-4 text-sm font-medium text-fg-subtle">Features</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className={cn('px-4 py-4 text-center font-display text-base font-semibold text-fg', p.featured && 'text-accent')}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((group) => (
                  <React.Fragment key={group.group}>
                    <tr>
                      <td colSpan={PLANS.length + 1} className="pb-1 pt-8 text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                        {group.group}
                      </td>
                    </tr>
                    {group.rows.map((row, ri) => (
                      <motion.tr
                        key={row.name}
                        variants={pickMotionVariant(fadeUp, reduced)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.6 }}
                        className="group"
                      >
                        <th scope="row" className="sticky left-0 z-10 border-t border-border bg-surface-raised py-3.5 pr-4 text-sm font-normal text-fg-muted group-hover:text-fg">
                          {row.name}
                        </th>
                        {row.cells.map((c, ci) => (
                          <td
                            key={ci}
                            className={cn('border-t border-border px-4 py-3.5 text-center', PLANS[ci]?.featured && 'bg-accent/[0.04]')}
                          >
                            <MatrixCell value={c} />
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <Container size="lg">
          <SectionHeader eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-8">
            <Accordion items={FAQ} />
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section id="get-started">
        <Container size="xl">
          <motion.div
            variants={pickMotionVariant(fadeUp, reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-raised to-surface px-8 py-14 text-center shadow-elevation4 sm:px-16"
          >
            <div className="relative">
              <Eyebrow className="justify-center">Get started</Eyebrow>
              <h2 className="mx-auto mt-6 max-w-[20ch] text-h1 font-display font-bold">Try it free, upgrade when it clicks</h2>
              <p className="mx-auto mt-4 max-w-[44ch] text-lead text-fg-muted">No card required to start. Cancel or switch plans whenever.</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button href="/login" size="lg">Start building <ArrowRight className="h-4 w-4" /></Button>
                <Button href="/#pricing" variant="secondary" size="lg">See it on the home page</Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      <BackToTop />
    </div>
  )
}
