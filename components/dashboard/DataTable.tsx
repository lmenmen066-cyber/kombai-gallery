'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/Badge'

type Status = 'Active' | 'Review' | 'Paused' | 'Archived'
type Row = {
  id: number
  name: string
  owner: string
  status: Status
  budget: number
  updated: string // ISO date
}

const ROWS: Row[] = [
  { id: 1, name: 'Aurora Rebrand', owner: 'Aria Fontaine', status: 'Active', budget: 42000, updated: '2026-03-14' },
  { id: 2, name: 'Mobile Checkout', owner: 'Devon Park', status: 'Review', budget: 18500, updated: '2026-03-11' },
  { id: 3, name: 'Data Pipeline v3', owner: 'Priya Nair', status: 'Active', budget: 64000, updated: '2026-03-09' },
  { id: 4, name: 'Marketing Site', owner: 'Mireia Sol', status: 'Paused', budget: 12000, updated: '2026-02-28' },
  { id: 5, name: 'Design Tokens', owner: 'Tobias Reyner', status: 'Active', budget: 9000, updated: '2026-03-13' },
  { id: 6, name: 'Legacy CMS', owner: 'Hana Ozturk', status: 'Archived', budget: 30000, updated: '2026-01-20' },
  { id: 7, name: 'Billing Revamp', owner: 'Marcus Vale', status: 'Review', budget: 27500, updated: '2026-03-06' },
  { id: 8, name: 'Search Relevance', owner: 'Priya Nair', status: 'Active', budget: 22000, updated: '2026-03-12' },
  { id: 9, name: 'Onboarding Flow', owner: 'Devon Park', status: 'Paused', budget: 15000, updated: '2026-02-18' },
  { id: 10, name: 'Analytics SDK', owner: 'Aria Fontaine', status: 'Active', budget: 38000, updated: '2026-03-10' },
  { id: 11, name: 'Support Portal', owner: 'Hana Ozturk', status: 'Review', budget: 11000, updated: '2026-03-02' },
  { id: 12, name: 'Warehouse Sync', owner: 'Tobias Reyner', status: 'Archived', budget: 48000, updated: '2026-01-05' },
]

const STATUS_TONE: Record<Status, 'success' | 'info' | 'warning' | 'default'> = {
  Active: 'success',
  Review: 'info',
  Paused: 'warning',
  Archived: 'default',
}

type SortKey = 'name' | 'owner' | 'status' | 'budget' | 'updated'
type Dir = 'asc' | 'desc'
const PAGE = 5
const money = (n: number) => `$${n.toLocaleString()}`

export function DataTable({ className }: { className?: string }) {
  const [q, setQ] = React.useState('')
  const [status, setStatus] = React.useState<'All' | Status>('All')
  const [sort, setSort] = React.useState<{ key: SortKey; dir: Dir }>({ key: 'updated', dir: 'desc' })
  const [page, setPage] = React.useState(0)

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase()
    return ROWS.filter((r) => {
      const matchQ =
        !needle || r.name.toLowerCase().includes(needle) || r.owner.toLowerCase().includes(needle)
      const matchS = status === 'All' || r.status === status
      return matchQ && matchS
    })
  }, [q, status])

  const sorted = React.useMemo(() => {
    const arr = [...filtered]
    const { key, dir } = sort
    const mul = dir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul
      return String(av).localeCompare(String(bv)) * mul
    })
    return arr
  }, [filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE))
  const clamped = Math.min(page, pageCount - 1)
  const rows = sorted.slice(clamped * PAGE, clamped * PAGE + PAGE)

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  // reset to first page whenever the result set shrinks
  React.useEffect(() => {
    setPage(0)
  }, [q, status])

  const cols: { key: SortKey; label: string; numeric?: boolean }[] = [
    { key: 'name', label: 'Project' },
    { key: 'owner', label: 'Owner' },
    { key: 'status', label: 'Status' },
    { key: 'budget', label: 'Budget', numeric: true },
    { key: 'updated', label: 'Updated' },
  ]

  return (
    <div className={cn('surface-card flex flex-col gap-4 p-4 sm:p-6', className)}>
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects or owners…"
            aria-label="Search"
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-fg/30"
          />
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Filter by status">
          {(['All', 'Active', 'Review', 'Paused', 'Archived'] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                status === s ? 'bg-accent text-accent-contrast' : 'text-fg-muted hover:bg-surface-raised',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {cols.map((c) => {
                const active = sort.key === c.key
                return (
                  <th key={c.key} scope="col" className={cn('py-2.5 pr-4 font-medium text-fg-subtle', c.numeric && 'text-right')}>
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cn(
                        'inline-flex items-center gap-1.5 transition-colors hover:text-fg',
                        active && 'text-fg',
                        c.numeric && 'flex-row-reverse',
                      )}
                      aria-label={`Sort by ${c.label}`}
                    >
                      {c.label}
                      {active ? (
                        sort.dir === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout" initial={false}>
              {rows.map((r) => (
                <motion.tr
                  key={r.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-raised"
                >
                  <td className="py-3 pr-4 font-medium text-fg">{r.name}</td>
                  <td className="py-3 pr-4 text-fg-muted">{r.owner}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={STATUS_TONE[r.status]} dot>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-fg">{money(r.budget)}</td>
                  <td className="py-3 text-fg-muted">{new Date(r.updated).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="py-10 text-center text-fg-subtle">
                  No projects match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-caption text-fg-subtle">
          {sorted.length === 0
            ? '0 results'
            : `${clamped * PAGE + 1}–${Math.min(clamped * PAGE + PAGE, sorted.length)} of ${sorted.length}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={clamped === 0}
            aria-label="Previous page"
            className="grid h-8 w-8 place-items-center rounded-lg border border-border text-fg transition-colors hover:bg-surface-raised disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              aria-current={i === clamped}
              className={cn(
                'h-8 min-w-8 rounded-lg px-2 text-sm tabular-nums transition-colors',
                i === clamped ? 'bg-accent text-accent-contrast' : 'text-fg-muted hover:bg-surface-raised',
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={clamped >= pageCount - 1}
            aria-label="Next page"
            className="grid h-8 w-8 place-items-center rounded-lg border border-border text-fg transition-colors hover:bg-surface-raised disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
