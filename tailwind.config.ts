import type { Config } from 'tailwindcss'

/**
 * Kombai-gallery design tokens.
 *
 * Colours / shadows / gradients are exposed as CSS custom properties (see
 * `app/globals.css`) so the same Tailwind utility names work in light and dark
 * mode (`class="dark"` on `<html>`). The palette is a quiet, editorial,
 * typography-led scheme matching Kombai Gallery's own chrome — off-white
 * surface, near-black foreground, small-to-moderate radius, generous spacing.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          raised: 'hsl(var(--surface-raised) / <alpha-value>)',
          inverse: 'hsl(var(--surface-inverse) / <alpha-value>)',
        },
        fg: {
          DEFAULT: 'hsl(var(--fg) / <alpha-value>)',
          muted: 'hsl(var(--fg-muted) / <alpha-value>)',
          subtle: 'hsl(var(--fg-subtle) / <alpha-value>)',
          inverse: 'hsl(var(--fg-inverse) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'hsl(var(--border) / <alpha-value>)',
          strong: 'hsl(var(--border-strong) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          contrast: 'hsl(var(--accent-contrast) / <alpha-value>)',
        },
        state: {
          success: 'hsl(var(--success) / <alpha-value>)',
          warning: 'hsl(var(--warning) / <alpha-value>)',
          danger: 'hsl(var(--danger) / <alpha-value>)',
          info: 'hsl(var(--info) / <alpha-value>)',
        },
      },
      backgroundImage: {
        brand: 'var(--gradient-brand)',
        'brand-soft': 'var(--gradient-brand-soft)',
        radial: 'var(--gradient-radial)',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-space-grotesk)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid scale using clamp() so a single class covers mobile→desktop.
        caption: ['clamp(0.75rem, 0.72rem + 0.15vw, 0.82rem)', { lineHeight: '1.4' }],
        body: ['clamp(0.95rem, 0.9rem + 0.22vw, 1.05rem)', { lineHeight: '1.65' }],
        lead: ['clamp(1.1rem, 1rem + 0.5vw, 1.35rem)', { lineHeight: '1.55' }],
        h3: ['clamp(1.2rem, 1.1rem + 0.7vw, 1.55rem)', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.6rem, 1.35rem + 1.4vw, 2.3rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.2rem, 1.75rem + 2.4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        display: ['clamp(2.75rem, 1.9rem + 4.5vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
      },
      spacing: {
        // 4px grid; add a few semantic section paddings on top of the default scale.
        section: 'clamp(4rem, 4vw + 4rem, 8rem)',
        gutter: 'clamp(1.25rem, 1rem + 1vw, 2rem)',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        // Layered elevation, quiet (editorial) — soft, low-contrast.
        elevation1: '0 1px 2px hsl(var(--shadow-tint) / 0.04), 0 1px 1px hsl(var(--shadow-tint) / 0.03)',
        elevation2: '0 2px 4px hsl(var(--shadow-tint) / 0.05), 0 1px 2px hsl(var(--shadow-tint) / 0.04)',
        elevation3: '0 6px 16px -6px hsl(var(--shadow-tint) / 0.10), 0 2px 4px hsl(var(--shadow-tint) / 0.05)',
        elevation4: '0 16px 32px -12px hsl(var(--shadow-tint) / 0.14), 0 4px 8px hsl(var(--shadow-tint) / 0.06)',
        elevation5: '0 24px 60px -20px hsl(var(--shadow-tint) / 0.22), 0 8px 16px hsl(var(--shadow-tint) / 0.08)',
        ring: '0 0 0 2px hsl(var(--accent) / 0.35)',
      },
      transitionTimingFunction: {
        quiet: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        springy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        caretBlink: {
          '0%,50%': { opacity: '1' },
          '51%,100%': { opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        marquee: 'marquee 30s linear infinite',
        caret: 'caretBlink 1s steps(1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
