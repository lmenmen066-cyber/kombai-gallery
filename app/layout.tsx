import type { Metadata, Viewport } from 'next'
import { Syne, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { PrefsProvider } from '@/components/providers/PrefsProvider'
import { Toaster } from '@/components/ui/Toast'
import { Cursor } from '@/components/ui/Cursor'
import { CommandPalette } from '@/components/ui/CommandPalette'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600'],
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
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
