'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DollarSign, UserPlus, Percent, FolderCheck } from 'lucide-react'
import { Shell } from '@/components/dashboard/Shell'
import { StatCard } from '@/components/dashboard/StatCard'
import { AreaLineChart, BarChart, DonutChart } from '@/components/ui/Charts'
import { DataTable } from '@/components/dashboard/DataTable'
import { fadeUp, staggerContainer, pickMotionVariant } from '@/lib/motion/variants'
import { cn } from '@/lib/utils/cn'

const REVENUE = [12, 18, 15, 24, 22, 31, 28, 38, 35, 46, 52, 49]
const REVENUE_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const SIGNUPS = [
  { label: 'W1', value: 210 },
  { label: 'W2', value: 320 },
  { label: 'W3', value: 280 },
  { label: 'W4', value: 410 },
  { label: 'W5', value: 360 },
  { label: 'W6', value: 520 },
]
const SOURCES = [
  { label: 'Organic', value: 48, color: '#c9a3ff' },
  { label: 'Referral', value: 27, color: '#a4d1ff' },
  { label: 'Paid', value: 17, color: '#f5c9a0' },
  { label: 'Social', value: 8, color: '#84fab0' },
]

const RANGES = ['7D', '30D', '90D', 'YTD'] as const

function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('surface-card flex flex-col gap-4 p-5 sm:p-6', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[1.05rem] font-semibold text-fg">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-caption text-fg-subtle">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const reduced = !!useReducedMotion()

  return (
    <Shell title="Overview">
      <div className="flex flex-col gap-8">
        {/* header row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-fg">Good afternoon, Aria</h2>
            <p className="mt-1 text-sm text-fg-muted">Here is how the portfolio is trending this quarter.</p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-raised p-1">
            {RANGES.map((r, i) => (
              <button
                key={r}
                type="button"
                aria-pressed={i === 1}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  i === 1 ? 'bg-accent text-accent-contrast' : 'text-fg-muted hover:text-fg',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* KPI grid */}
        <motion.section
          variants={pickMotionVariant(staggerContainer(0.08), reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2, once: true }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard icon={DollarSign} label="Total revenue" value={128400} prefix="$" delta={12.5} />
          <StatCard icon={UserPlus} label="New users" value={8942} delta={4.1} />
          <StatCard icon={Percent} label="Conversion rate" value={3.6} decimals={1} suffix="%" delta={-0.8} />
          <StatCard icon={FolderCheck} label="Active projects" value={24} delta={2} />
        </motion.section>

        {/* charts */}
        <motion.section
          id="analytics"
          variants={pickMotionVariant(fadeUp, reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.15, once: true }}
          className="scroll-mt-24 grid gap-4 lg:grid-cols-3"
        >
          <Panel
            title="Revenue"
            subtitle="Monthly recurring, last 12 months"
            className="lg:col-span-2"
            action={
              <span className="rounded-full bg-success/15 px-2.5 py-1 text-caption font-medium text-success">
                +18.2% YoY
              </span>
            }
          >
            <AreaLineChart values={REVENUE} labels={REVENUE_LABELS} />
          </Panel>
          <Panel title="Traffic sources" subtitle="Share of sessions">
            <DonutChart segments={SOURCES} centerLabel="sessions" />
          </Panel>
        </motion.section>

        <motion.section
          variants={pickMotionVariant(fadeUp, reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2, once: true }}
          className="grid gap-4 lg:grid-cols-3"
        >
          <Panel title="Signups" subtitle="Weekly, last 6 weeks" className="lg:col-span-2">
            <BarChart data={SIGNUPS} />
          </Panel>
          <Panel title="Activity" subtitle="Latest events">
            <ul className="flex flex-col gap-4">
              {[
                { t: 'Aria shipped Design Tokens', s: '2 minutes ago', c: '#84fab0' },
                { t: 'Billing Revamp entered review', s: '1 hour ago', c: '#a4d1ff' },
                { t: 'New signup from referral', s: '3 hours ago', c: '#c9a3ff' },
                { t: 'Legacy CMS archived', s: 'Yesterday', c: '#f5c9a0' },
                { t: 'Search Relevance merged', s: '2 days ago', c: '#8fd3f4' },
              ].map((e) => (
                <li key={e.t} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: e.c }} />
                  <span>
                    <span className="block text-sm text-fg">{e.t}</span>
                    <span className="block text-caption text-fg-subtle">{e.s}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </motion.section>

        {/* table */}
        <motion.section
          id="projects"
          variants={pickMotionVariant(fadeUp, reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.15, once: true }}
          className="scroll-mt-24 flex flex-col gap-4"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight text-fg">Projects</h2>
            <span className="text-caption text-fg-subtle">Sort, filter and page through the active work.</span>
          </div>
          <DataTable />
        </motion.section>
      </div>
    </Shell>
  )
}
