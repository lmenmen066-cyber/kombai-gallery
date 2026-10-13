'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Github, Twitter, Linkedin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { fadeUp, pickMotionVariant } from '@/lib/motion/variants'

const COLS: { title: string; links: string[] }[] = [
  { title: 'Product', links: ['Features', 'Showcase', 'Pricing', 'Changelog', 'Roadmap'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Docs', 'Components', 'Motion', 'Accessibility'] },
]

export function Footer() {
  const reduced = !!useReducedMotion()
  return (
    <footer className="border-t border-border bg-surface-raised">
      <Container size="xl" className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* brand + subscribe */}
          <div className="lg:col-span-5">
            <Link href="#top" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] text-sm font-bold text-white">
                K
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">Kombai</span>
            </Link>
            <p className="mt-4 max-w-[36ch] text-body text-fg-muted">
              A calm, editorial design system — build interfaces that read like they were set by a
              typographer, not a template.
            </p>

            <form
              className="mt-6 flex max-w-sm gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Subscribe to updates"
            >
              <input
                type="email"
                required
                placeholder="you@studio.com"
                className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-[0.95rem] text-fg outline-none transition-colors placeholder:text-fg-subtle focus-visible:border-fg/40"
              />
              <Button type="submit" size="md">
                Subscribe
              </Button>
            </form>
          </div>

          {/* link columns */}
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {COLS.map((col, ci) => (
              <motion.div
                key={col.title}
                variants={pickMotionVariant(fadeUp, reduced)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: reduced ? 0 : ci * 0.06 }}
              >
                <h3 className="text-caption font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="group inline-flex items-center gap-1 text-[0.95rem] text-fg-muted transition-colors hover:text-fg"
                      >
                        <span className="transition-transform duration-200 ease-quiet group-hover:translate-x-0.5">
                          {l}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-caption text-fg-subtle">© {new Date().getFullYear()} Kombai Gallery. All rights reserved.</p>
          <div className="flex items-center gap-4 text-fg-muted">
            {[
              { icon: Github, label: 'GitHub' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Linkedin, label: 'LinkedIn' },
            ].map(({ icon: Icon, label }) => (
              <Link
                key={label}
                href="#"
                aria-label={label}
                className="transition-colors hover:text-fg hover:-translate-y-0.5"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
