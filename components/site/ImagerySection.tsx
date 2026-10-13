'use client'

import * as React from 'react'
import { RotateCcw } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { BlurImage } from '@/components/ui/BlurImage'

type Palette = {
  id: string
  title: string
  caption: string
  sky: [string, string]
  sun: string
  far: string
  near: string
  water: [string, string]
}

const PALETTES: Palette[] = [
  { id: 'dusk', title: 'Dusk ridge', caption: 'Warm horizon, 60° sun', sky: ['#f5c9a0', '#b57edc'], sun: '#fff2d6', far: '#7a5b93', near: '#3a2b52', water: ['#5b4470', '#2a1f3d'] },
  { id: 'dawn', title: 'Blue hour', caption: 'Cool alpine mist', sky: ['#a4d1ff', '#c9a3ff'], sun: '#eaf4ff', far: '#6f8fd6', near: '#2f3f6b', water: ['#3d5a86', '#22304f'] },
  { id: 'night', title: 'Teal night', caption: 'Low light, long exposure', sky: ['#12343b', '#0b1f27'], sun: '#bff3e0', far: '#1f4f4a', near: '#0d2a2c', water: ['#143c3f', '#08191d'] },
]

// Original, deterministic SVG artwork — no external assets, no random seed
// (so SSR and client markup are identical).
function full(p: Palette): string {
  const sky = `sky-${p.id}`
  const wat = `wat-${p.id}`
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' preserveAspectRatio='xMidYMid slice'>
<defs>
<linearGradient id='${sky}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${p.sky[0]}'/><stop offset='1' stop-color='${p.sky[1]}'/></linearGradient>
<linearGradient id='${wat}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${p.water[0]}'/><stop offset='1' stop-color='${p.water[1]}'/></linearGradient>
<radialGradient id='sun-${p.id}' cx='0.5' cy='0.5' r='0.5'><stop offset='0' stop-color='${p.sun}'/><stop offset='1' stop-color='${p.sun}' stop-opacity='0'/></radialGradient>
</defs>
<rect width='800' height='600' fill='url(#${sky})'/>
<circle cx='560' cy='170' r='120' fill='url(#sun-${p.id})'/>
<circle cx='560' cy='170' r='34' fill='${p.sun}'/>
<circle cx='120' cy='90' r='2.5' fill='#ffffff' opacity='.8'/><circle cx='220' cy='140' r='1.8' fill='#ffffff' opacity='.7'/><circle cx='340' cy='70' r='2.2' fill='#ffffff' opacity='.6'/><circle cx='700' cy='90' r='2' fill='#ffffff' opacity='.7'/>
<path d='M0 360 L150 250 L280 340 L400 230 L520 340 L640 250 L800 350 L800 600 L0 600 Z' fill='${p.far}' opacity='.85'/>
<path d='M0 420 L160 330 L320 420 L470 320 L640 430 L800 360 L800 600 L0 600 Z' fill='${p.near}'/>
<rect y='450' width='800' height='150' fill='url(#${wat})'/>
<path d='M540 460 q20 12 40 0 t40 0' stroke='${p.sun}' stroke-opacity='.25' stroke-width='3' fill='none'/>
<path d='M520 500 q25 14 50 0 t50 0' stroke='${p.sun}' stroke-opacity='.18' stroke-width='3' fill='none'/>
<ellipse cx='400' cy='452' rx='230' ry='8' fill='#ffffff' opacity='.06'/>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ''))}`
}

function thumb(p: Palette): string {
  // ~16x12 coarse colour blocks — the "LQIP" that blurs up into the full art.
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12'>
<rect width='16' height='7' fill='${p.sky[0]}'/><rect y='7' width='16' height='5' fill='${p.water[1]}'/>
<rect y='5' width='16' height='3' fill='${p.far}'/><rect y='6' width='16' height='2' fill='${p.near}'/>
<circle cx='11' cy='3' r='1.6' fill='${p.sun}'/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ''))}`
}

export function ImagerySection() {
  const [run, setRun] = React.useState(0)
  return (
    <Section id="imagery">
      <Container size="xl">
        <SectionHeader
          eyebrow="Imagery"
          title="Progressive images that never jump the layout"
          lede="A tiny blurred placeholder paints instantly, then the real render fades in as it decodes. The frame holds its aspect ratio throughout, so nothing reflows — and it degrades gracefully if a source fails."
        />
        <div className="mt-8 flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setRun((r) => r + 1)}>
            <RotateCcw className="h-4 w-4" /> Replay fade
          </Button>
          <span className="text-caption text-fg-subtle">Re-mounts the cards so you can watch the blur-up again.</span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PALETTES.map((p) => (
            <figure key={p.id} className="flex flex-col gap-3">
              <BlurImage
                key={`${p.id}-${run}`}
                src={full(p)}
                blurDataURL={thumb(p)}
                alt={`${p.title} landscape illustration`}
                aspect="4 / 3"
                rounded="rounded-2xl"
                className="border border-border shadow-elevation2"
              />
              <figcaption className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-fg">{p.title}</span>
                <Badge tone="outline">LQIP</Badge>
              </figcaption>
              <p className="text-caption text-fg-subtle">{p.caption}</p>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  )
}
