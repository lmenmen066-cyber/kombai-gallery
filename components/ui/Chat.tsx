'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Send, Bot } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ChatMessage = { id: string; from: 'user' | 'bot'; text: string; at: string }

const REPLIES: string[] = [
  'Got it — I can help with that. Want me to draft a short summary first?',
  'Understood. Which section of the system would you like to see next?',
  'Great question. In this design system every bubble is a motion.div with a spring entrance.',
  'Sure. Try typing again and I will follow along.',
]

/**
 * Chat thread with:
 *   - left/right bubbles, spring entrance (or plain fade under reduced-motion)
 *   - animated three-dot typing indicator
 *   - auto-scroll to the newest message
 *   - a working send form (canned bot reply after a short typing delay)
 *
 * State is internal; consumers can lift it by seeding `initial` and using the
 * `onMessagesChange` callback.
 */
export function Chat({
  initial,
  className,
  botName = 'Kombai',
}: {
  initial?: ChatMessage[]
  className?: string
  botName?: string
}) {
  const reduced = !!useReducedMotion()
  const [messages, setMessages] = React.useState<ChatMessage[]>(
    initial ?? [
      { id: 'm0', from: 'bot', text: 'Hi — ask me anything about the design system.', at: new Date().toISOString() },
    ],
  )
  const [input, setInput] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const scroller = React.useRef<HTMLDivElement>(null)

  // auto-scroll on new content
  React.useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [messages, typing, reduced])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const uid = `u${Date.now()}`
    setMessages((m) => [
      ...m,
      { id: uid, from: 'user', text, at: new Date().toISOString() },
    ])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)]
      setMessages((m) => [...m, { id: `b${Date.now()}`, from: 'bot', text: reply, at: new Date().toISOString() }])
      setTyping(false)
    }, 900)
  }

  return (
    <div className={cn('flex h-[440px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-elevation3', className)}>
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] text-white">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-fg">{botName}</p>
            <p className="text-caption text-fg-subtle">Always online</p>
          </div>
        </div>
        <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-caption font-medium text-success">
          Live
        </span>
      </div>

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {messages.map((m) => (
          <Bubble key={m.id} msg={m} reduced={reduced} />
        ))}
        <AnimatePresence>
          {typing ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="flex items-end gap-2"
            >
              <BotAvatar />
              <div className="rounded-2xl rounded-bl-md bg-surface px-3 py-2 shadow-elevation1">
                <TypingDots reduced={reduced} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-border bg-surface p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          aria-label="Message"
          className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface-raised px-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-fg/30"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send"
          className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-contrast shadow-elevation2 transition-opacity hover:shadow-elevation4 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

function Bubble({ msg, reduced }: { msg: ChatMessage; reduced: boolean }) {
  const mine = msg.from === 'user'
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      className={cn('flex items-end gap-2', mine ? 'justify-end' : 'justify-start')}
    >
      {!mine && <BotAvatar />}
      <div
        className={cn(
          'max-w-[72%] rounded-2xl px-3.5 py-2 text-sm leading-snug shadow-elevation1',
          mine
            ? 'rounded-br-md bg-accent text-accent-contrast'
            : 'rounded-bl-md bg-surface text-fg',
        )}
      >
        {msg.text}
        <div className={cn('mt-1 text-[10px]', mine ? 'text-white/60' : 'text-fg-subtle')}>
          {new Date(msg.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}

function BotAvatar() {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] text-white">
      <Bot className="h-3.5 w-3.5" />
    </span>
  )
}

function TypingDots({ reduced }: { reduced: boolean }) {
  return (
    <span aria-hidden className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-fg-subtle"
          animate={reduced ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}
