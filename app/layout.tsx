import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { PrefsProvider } from '@/components/providers/PrefsProvider'
import { Toaster } from '@/components/ui/Toast'
import { Cursor } from '@/components/ui/Cursor'
import { CommandPalette } from '@/components/ui/CommandPalette'
import './globals.css'

// Self-hosted (vendored under SIL OFL — see app/fonts/*-OFL.txt). next/font/google
// fetches fonts at build time, which intermittently fails under Turbopack in CI;
// local fonts make the build network-independent and deterministic.
const syne = localFont({
  variable: '--font-syne',
  display: 'swap',
  src: [
    { path: './fonts/syne-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/syne-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/syne-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './fonts/syne-latin-800-normal.woff2', weight: '800', style: 'normal' },
  ],
})
const spaceGrotesk = localFont({
  variable: '--font-space-grotesk',
  display: 'swap',
  src: './fonts/space-grotesk-latin-wght-normal.woff2',
  weight: '400 600',
})
const jetbrains = localFont({
  variable: '--font-jetbrains',
  display: 'swap',
  src: './fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '400 500',
})

export const metadata: Metadata = {
  title: 'Kombai Gallery — a quiet, editorial design system',
  description:
    'A Next.js 14 + Tailwind + Framer Motion design system inspired by the Kombai Gallery: light-first, typography-led, restrained motion, accessible.',
  keywords: ['design system', 'next.js', 'tailwind', 'framer motion', 'kombai'],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#101114' },
  ],
}

// Runs before hydration to set the initial theme class and prevent a flash.
const themeInitScript = `(function(){try{var k='kg.theme';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=s==='dark'||((!s||s==='system')&&m);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrains.variable} font-sans antialiased`}>
        <ThemeProvider>
          <PrefsProvider>
            {children}
            <Toaster />
            <Cursor />
            <CommandPalette />
          </PrefsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
