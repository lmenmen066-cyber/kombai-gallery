'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Progressive ("LQIP") image — the classic blur-up.
 *
 * A tiny, heavily-blurred placeholder paints immediately (so there is never an
 * empty gap), then the real image fades in over it as soon as it finishes
 * decoding. The placeholder only unmounts after `onLoad`, so a slow or failing
 * source degrades to the placeholder instead of a broken icon.
 *
 * Fully reduced-motion friendly: the cross-fade collapses to an instant swap by
 * the global `prefers-reduced-motion` override, and the layout never shifts
 * (aspect ratio is reserved up front).
 */
export function BlurImage({
  src,
  alt,
  blurDataURL,
  aspect = '4 / 3',
  priority = false,
  className,
  imgClassName,
  rounded = 'rounded-xl',
}: {
  src: string
  alt: string
  blurDataURL?: string
  aspect?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  rounded?: string
}) {
  const [loaded, setLoaded] = React.useState(false)
  const [errored, setErrored] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  // If the (cached) image already finished before hydration, reflect it.
  React.useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <div
      className={cn('relative overflow-hidden bg-surface-raised', rounded, className)}
      style={{ aspectRatio: aspect }}
    >
      {/* low-quality placeholder */}
      {blurDataURL ? (
        <img
          alt=""
          aria-hidden
          src={blurDataURL}
          className={cn(
            'pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700',
            loaded ? 'opacity-0' : 'opacity-100',
          )}
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            'shimmer pointer-events-none absolute inset-0 bg-border/60 transition-opacity duration-500',
            loaded ? 'opacity-0' : 'opacity-100',
          )}
          style={{
            backgroundImage:
              'linear-gradient(90deg, hsl(var(--border)/0.35) 25%, hsl(var(--border)/0.65) 37%, hsl(var(--border)/0.35) 63%)',
            backgroundSize: '400% 100%',
          }}
        />
      )}

      {/* the real image, faded in once decoded */}
      {!errored ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setErrored(true)
            setLoaded(false)
          }}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-quiet',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      ) : null}
    </div>
  )
}
