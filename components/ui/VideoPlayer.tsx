'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const DEFAULT_SRC =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

function fmt(t: number): string {
  if (!isFinite(t) || t < 0) t = 0
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Custom HTML5 video player.
 *
 * Real media wiring — play/pause, buffered + played ranges, scrub, volume,
 * mute, and fullscreen all drive the underlying <video>. The control bar
 * auto-hides a couple seconds after the pointer goes still (and while playing),
 * reappearing on move/focus. A big pulse-ring play button sits over the poster
 * until first playback. Every decorative animation collapses under
 * `prefers-reduced-motion`.
 *
 * `src` defaults to a public sample clip; pass your own to use locally.
 */
export function VideoPlayer({
  src = DEFAULT_SRC,
  poster,
  className,
}: {
  src?: string
  poster?: string
  className?: string
}) {
  const reduced = !!useReducedMotion()
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const [playing, setPlaying] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  const [muted, setMuted] = React.useState(false)
  const [volume, setVolume] = React.useState(1)
  const [time, setTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [buffered, setBuffered] = React.useState(0)
  const [fs, setFs] = React.useState(false)
  const [uiVisible, setUiVisible] = React.useState(true)
  const hideTimer = React.useRef<number | null>(null)

  const revealUi = React.useCallback(() => {
    setUiVisible(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setUiVisible(false)
    }, 2600)
  }, [])

  React.useEffect(() => () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
  }, [])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
    } else {
      v.pause()
    }
  }

  const onLoaded = () => setDuration(videoRef.current?.duration ?? 0)

  const onTime = () => {
    const v = videoRef.current
    if (!v) return
    setTime(v.currentTime)
    if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1))
  }

  const seek = (t: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = t
    setTime(t)
  }

  const changeVolume = (val: number) => {
    const v = videoRef.current
    if (!v) return
    v.volume = val
    v.muted = val === 0
    setVolume(val)
    setMuted(val === 0)
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    const next = !muted
    v.muted = next
    setMuted(next)
  }

  const toggleFs = () => {
    const el = wrapRef.current
    if (!el) return
    if (!fs && document.fullscreenElement !== el) {
      void el.requestFullscreen?.()
    } else {
      void document.exitFullscreen?.()
    }
  }

  React.useEffect(() => {
    const onFsChange = () => setFs(document.fullscreenElement === wrapRef.current)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const pct = duration ? (time / duration) * 100 : 0
  const bufPct = duration ? (buffered / duration) * 100 : 0

  return (
    <div
      ref={wrapRef}
      onMouseMove={revealUi}
      onMouseLeave={() => playing && setUiVisible(false)}
      onFocus={revealUi}
      className={cn(
        'group relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-elevation4',
        className,
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true)
          setStarted(true)
          revealUi()
        }}
        onPause={() => {
          setPlaying(false)
          setUiVisible(true)
        }}
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTime}
        onEnded={() => {
          setPlaying(false)
          setUiVisible(true)
        }}
      />

      {/* poster overlay + big play until first play */}
      {!started ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#1b1b22] via-[#241f33] to-[#12202e]">
          <button
            type="button"
            onClick={toggle}
            aria-label="Play video"
            className="relative grid h-20 w-20 place-items-center rounded-full bg-white/95 text-black shadow-elevation5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {!reduced ? (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-white/60"
                animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            ) : null}
            <Play className="ml-1 h-8 w-8" fill="currentColor" />
          </button>
        </div>
      ) : null}

      {/* control bar */}
      <motion.div
        initial={false}
        animate={{ opacity: uiVisible || !playing ? 1 : 0, y: uiVisible || !playing ? 0 : 12 }}
        transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 0.61, 0.36, 1] }}
        className={cn(
          'absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-8 text-white sm:px-4',
          !uiVisible && playing && 'pointer-events-none',
        )}
      >
        {/* seek */}
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-x-0 h-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full bg-white/35" style={{ width: `${bufPct}%` }} />
          </div>
          <div
            className="pointer-events-none absolute left-0 h-1 rounded-full bg-white"
            style={{ width: `${pct}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
            className={cn(
              'seek relative h-1 w-full cursor-pointer appearance-none bg-transparent outline-none',
              '[&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-125',
              '[&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white',
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {playing ? <Pause className="h-[18px] w-[18px]" /> : <Play className="ml-0.5 h-[18px] w-[18px]" />}
          </button>

          <div className="group/vol flex items-center gap-1">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {muted || volume === 0 ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="vol h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 opacity-0 outline-none transition-all duration-200 group-hover/vol:w-16 group-hover/vol:opacity-100 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white focus-visible:w-16 focus-visible:opacity-100"
            />
          </div>

          <span className="ml-1 select-none text-xs tabular-nums text-white/80">
            {fmt(time)} / {fmt(duration)}
          </span>

          <button
            type="button"
            onClick={toggleFs}
            aria-label={fs ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="ml-auto grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {fs ? <Minimize className="h-[18px] w-[18px]" /> : <Maximize className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
