'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import QRCodeLib from 'qrcode'
import { Copy, Download, Check, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * QR code panel.
 *
 * - Generates a PNG data URL with the `qrcode` package (browser build) so there
 *   is no runtime dependency on a canvas element of our own.
 * - Reveals it with a single-node diagonal `clip-path` wipe rather than
 *   animating every module — cheap, GPU-friendly, and reads as "cells filling
 *   in". Collapses to an instant reveal under `prefers-reduced-motion`.
 * - Copy-to-clipboard (with graceful fallback when the async Clipboard API is
 *   unavailable) and a native download link.
 */
export function QRCode({
  value = 'https://kombai.com',
  size = 200,
  className,
  label,
}: {
  value?: string
  size?: number
  className?: string
  label?: string
}) {
  const reduced = !!useReducedMotion()
  const [dataUrl, setDataUrl] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    let alive = true
    setError(null)
    QRCodeLib.toDataURL(value, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: size * 2,
      color: { dark: '#141414ff', light: '#00000000' },
    })
      .then((url) => {
        if (alive) setDataUrl(url)
      })
      .catch((e: unknown) => {
        if (alive) setError(e instanceof Error ? e.message : 'Could not render QR code')
      })
    return () => {
      alive = false
    }
  }, [value, size])

  const copy = React.useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        // Fallback for non-secure contexts where the async API is missing.
        const ta = document.createElement('textarea')
        ta.value = value
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — nothing else to try */
    }
  }, [value])

  return (
    <div
      className={cn(
        'flex w-full max-w-xs flex-col items-center gap-5 rounded-2xl border border-border bg-surface-raised p-6 shadow-elevation3',
        className,
      )}
    >
      <div
        className="relative grid place-items-center overflow-hidden rounded-xl border border-border bg-white p-3"
        style={{ width: size + 24, height: size + 24 }}
      >
        {error ? (
          <span className="px-3 text-center text-caption text-danger">{error}</span>
        ) : dataUrl ? (
          <motion.img
            src={dataUrl}
            alt={`QR code for ${label ?? value}`}
            width={size}
            height={size}
            draggable={false}
            className="rounded-md"
            initial={reduced ? false : { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
            animate={{ clipPath: 'polygon(0 0, 200% 0, 100% 100%, -100% 100%)' }}
            transition={reduced ? { duration: 0 } : { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          />
        ) : (
          <div
            aria-hidden
            className="shimmer rounded-md bg-border/60"
            style={{ width: size, height: size }}
          />
        )}
      </div>

      <div className="w-full text-center">
        <p className="text-[0.95rem] font-medium text-fg">{label ?? 'Scan to open'}</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 truncate text-caption text-fg-subtle">
          <Link2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{value}</span>
        </p>
      </div>

      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={copy}
          aria-label="Copy link"
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-medium text-fg transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-success" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy link
            </>
          )}
        </button>
        <a
          href={dataUrl ?? undefined}
          download="qr.png"
          aria-label="Download QR image"
          className={cn(
            'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-contrast shadow-elevation2 transition-shadow hover:shadow-elevation4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30',
            !dataUrl && 'pointer-events-none opacity-40',
          )}
        >
          <Download className="h-4 w-4" /> Download
        </a>
      </div>
    </div>
  )
}
