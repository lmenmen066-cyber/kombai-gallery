import { create } from 'zustand'

export type MotionSetting = 'auto' | 'reduce' | 'full'

type PrefsStore = {
  motion: MotionSetting
  cursor: boolean
  paletteOpen: boolean
  setMotion: (m: MotionSetting) => void
  setCursor: (v: boolean) => void
  toggleCursor: () => void
  openPalette: () => void
  closePalette: () => void
  togglePalette: () => void
  /** Bulk-apply values read back from localStorage (client only). */
  hydrate: (p: { motion?: MotionSetting; cursor?: boolean }) => void
}

/**
 * Lightweight global UI preferences, shared by the motion provider, the custom
 * cursor and the command palette. Deliberately NOT persisted inside the store —
 * a client effect hydrates/saves it so the server render stays deterministic.
 */
export const usePrefs = create<PrefsStore>((set) => ({
  motion: 'auto',
  cursor: true,
  paletteOpen: false,
  setMotion: (motion) => set({ motion }),
  setCursor: (cursor) => set({ cursor }),
  toggleCursor: () => set((s) => ({ cursor: !s.cursor })),
  openPalette: () => set({ paletteOpen: true }),
  closePalette: () => set({ paletteOpen: false }),
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
  hydrate: ({ motion, cursor }) =>
    set((s) => ({ motion: motion ?? s.motion, cursor: cursor ?? s.cursor })),
}))

/** Map our tri-state onto Framer Motion's `MotionConfig.reducedMotion`. */
export function motionToReducedMotion(m: MotionSetting): 'user' | 'always' | 'never' {
  if (m === 'reduce') return 'always'
  if (m === 'full') return 'never'
  return 'user'
}
