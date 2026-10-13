import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type ToastItem = {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  /** ms until auto-dismiss; 0 keeps it until manually dismissed. */
  duration: number
}

type ToastInput = {
  variant?: ToastVariant
  title: string
  description?: string
  duration?: number
}

type ToastStore = {
  toasts: ToastItem[]
  push: (t: ToastInput) => string
  dismiss: (id: string) => void
  clear: () => void
}

const DEFAULT_DURATION = 4600
let seq = 0
const nextId = () => `t${Date.now().toString(36)}${(seq++).toString(36)}`

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  push: ({ variant = 'info', title, description, duration = DEFAULT_DURATION }) => {
    const id = nextId()
    // Cap the visible stack so bursts collapse gracefully rather than overflow.
    set((s) => ({ toasts: [...s.toasts, { id, variant, title, description, duration }].slice(-4) }))
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}))

/** Imperative helper usable from anywhere (outside React) — e.g. form handlers. */
export const toast = {
  show: (input: ToastInput) => useToast.getState().push(input),
  success: (title: string, description?: string) =>
    useToast.getState().push({ variant: 'success', title, description }),
  error: (title: string, description?: string) =>
    useToast.getState().push({ variant: 'error', title, description }),
  warning: (title: string, description?: string) =>
    useToast.getState().push({ variant: 'warning', title, description }),
  info: (title: string, description?: string) =>
    useToast.getState().push({ variant: 'info', title, description }),
  dismiss: (id: string) => useToast.getState().dismiss(id),
}
