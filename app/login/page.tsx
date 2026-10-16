'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/BrandIcons'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { Spinner } from '@/components/ui/Spinner'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { toast } from '@/lib/store/toast'
import { cn } from '@/lib/utils/cn'
import { fadeUp, staggerContainer, pickMotionVariant } from '@/lib/motion/variants'

type Mode = 'signin' | 'signup'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* --- brand glyphs (lucide ships no Google/Apple marks) --------------------- */
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden width="18" height="18" {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.7v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.7a11 11 0 0 0 0 9.88l3.14-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.7 7.06l3.14 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  )
}
function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden width="18" height="18" fill="currentColor" {...props}>
      <path d="M16.36 12.9c.02 2.5 2.19 3.33 2.22 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.4 2.03-2.53 2.05-1.11.02-1.47-.66-2.74-.66-1.27 0-1.67.64-2.71.68-1.09.04-1.9-1.1-2.6-2.11-1.42-2.06-2.5-5.82-1.04-8.36.72-1.26 2.02-2.06 3.43-2.08 1.07-.02 2.08.72 2.74.72.65 0 1.88-.89 3.17-.76.54.02 2.05.22 3.02 1.64-.08.05-1.8 1.05-1.78 3.13zM14.3 4.9c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.54.62-1 1.61-.88 2.56.93.07 1.87-.47 2.46-1.16z" />
    </svg>
  )
}

/* --- password strength ----------------------------------------------------- */
const STRENGTH = [
  { label: 'Too weak', color: '#e5484d' },
  { label: 'Weak', color: '#ff8c42' },
  { label: 'Fair', color: '#f5c518' },
  { label: 'Good', color: '#8bc34a' },
  { label: 'Strong', color: '#3ecf8e' },
]
function scorePassword(pw: string): number {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4)
}

function StrengthMeter({ value }: { value: string }) {
  const reduced = !!useReducedMotion()
  const score = scorePassword(value)
  return (
    <div className="mt-2">
      <div className="flex items-center gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={score} aria-label="Password strength">
        {STRENGTH.map((_, i) => (
          <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/70">
            <motion.span
              className="block h-full w-full origin-left rounded-full"
              style={{ backgroundColor: STRENGTH[score].color }}
              initial={false}
              animate={{ scaleX: value && i < score ? 1 : 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            />
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-caption" style={{ color: value ? STRENGTH[score].color : 'hsl(var(--fg-subtle))' }}>
        {value ? STRENGTH[score].label : 'Use 8+ characters with mixed case, a number and a symbol'}
      </p>
    </div>
  )
}

/* --- social buttons -------------------------------------------------------- */
function SocialButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface-raised text-sm font-medium text-fg transition-colors hover:border-fg/40 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/25"
    >
      <motion.span
        aria-hidden
        className="inline-flex transition-transform"
        whileHover={{ scale: 1.12, rotate: -6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        {children}
      </motion.span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

/* --- decorative brand panel ------------------------------------------------ */
function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-surface-inverse p-12 text-fg-inverse lg:flex lg:flex-col">
      <div aria-hidden className="absolute inset-0 hairline-grid opacity-[0.15]" />
      <div
        aria-hidden
        className="absolute -left-24 top-1/3 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle at center, #c9a3ff88, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-10 right-0 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(circle at center, #a4d1ff88, transparent 70%)' }}
      />
      <Link href="/" className="relative flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#f5c9a0] via-[#c9a3ff] to-[#a4d1ff] font-bold text-white shadow-elevation2">
          K
        </span>
        <span className="font-display text-xl font-semibold tracking-tight">Kombai</span>
      </Link>

      <div className="relative mt-auto">
        <blockquote className="max-w-md font-display text-2xl font-medium leading-snug">
          “The calmest way to ship an interface — every component, motion and token already agrees.”
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#f5c9a0] to-[#c9a3ff] text-sm font-bold text-white">
            MR
          </span>
          <div>
            <p className="text-sm font-medium">Marcus Vale</p>
            <p className="text-caption opacity-70">CTO, Sable Labs</p>
          </div>
        </div>
      </div>

      <ul className="relative mt-12 grid grid-cols-2 gap-3 text-sm">
        {['Accessible by default', 'Reduced-motion aware', 'Light & dark themes', 'Fluid type scale'].map((f) => (
          <li key={f} className="flex items-center gap-2 opacity-80">
            <Check className="h-4 w-4 text-[#a4d1ff]" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function LoginPage() {
  const reduced = !!useReducedMotion()
  const [mode, setMode] = React.useState<Mode>('signin')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPw, setShowPw] = React.useState(false)
  const [remember, setRemember] = React.useState(true)
  const [touched, setTouched] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const emailErr = touched && !EMAIL_RE.test(email) ? 'Enter a valid email address' : undefined
  const pwErr =
    touched && password.length < 8
      ? 'At least 8 characters'
      : mode === 'signup' && touched && scorePassword(password) < 2
        ? 'Choose a stronger password'
        : undefined
  const nameErr = mode === 'signup' && touched && name.trim().length < 2 ? 'Tell us your name' : undefined

  const swap = (m: Mode) => {
    setMode(m)
    setTouched(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const ok = EMAIL_RE.test(email) && password.length >= 8 && scorePassword(password) >= (mode === 'signup' ? 2 : 1) && (mode === 'signin' || name.trim().length >= 2)
    if (!ok) {
      toast.error('Please fix the highlighted fields', 'Check your email, password and name, then try again.')
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (mode === 'signup') toast.success('Account created', `Welcome aboard, ${name.trim().split(' ')[0]}. Check your inbox to verify.`)
      else toast.success('Signed in', `Good to see you again — ${email}.`)
      setPassword('')
    }, 1300)
  }

  const social = (provider: string) => () =>
    toast.info(`${provider} sign-in`, `Wire ${provider.toLowerCase()} OAuth here — this demo shows the interaction.`)

  const title = mode === 'signin' ? 'Welcome back' : 'Create your account'
  const sub = mode === 'signin' ? 'Sign in to continue to your workspace.' : 'A few details and you are in.'

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel />

      <div className="relative flex flex-col bg-surface px-6 py-8 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" /> Back to gallery
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            variants={pickMotionVariant(staggerContainer(0.06), reduced)}
            initial="hidden"
            animate="visible"
            className="w-full max-w-sm"
          >
            <motion.div variants={pickMotionVariant(fadeUp, reduced)}>
              <div className="mb-6 grid w-full grid-cols-2 gap-1 rounded-lg border border-border bg-surface-raised p-1">
                {(['signin', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={mode === m}
                    onClick={() => swap(m)}
                    className={cn(
                      'relative rounded-md py-2 text-sm font-medium transition-colors',
                      mode === m ? 'text-accent-contrast' : 'text-fg-muted hover:text-fg',
                    )}
                  >
                    {mode === m ? (
                      <motion.span
                        layoutId="auth-tab"
                        className="absolute inset-0 -z-10 rounded-md bg-accent"
                        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    {m === 'signin' ? 'Sign in' : 'Sign up'}
                  </button>
                ))}
              </div>

              <h1 className="font-display text-2xl font-bold tracking-tight text-fg">{title}</h1>
              <p className="mt-1 text-sm text-fg-muted">{sub}</p>
            </motion.div>

            <motion.div variants={pickMotionVariant(fadeUp, reduced)} className="mt-6 flex items-center gap-2">
              <SocialButton onClick={social('Google')} label="Google">
                <GoogleIcon />
              </SocialButton>
              <SocialButton onClick={social('GitHub')} label="GitHub">
                <GitHubIcon className="h-[18px] w-[18px]" />
              </SocialButton>
              <SocialButton onClick={social('Apple')} label="Apple">
                <AppleIcon />
              </SocialButton>
            </motion.div>

            <motion.div variants={pickMotionVariant(fadeUp, reduced)} className="my-6">
              <Divider label="or continue with email" />
            </motion.div>

            <motion.form variants={pickMotionVariant(fadeUp, reduced)} onSubmit={submit} className="flex flex-col gap-4" noValidate>
              {mode === 'signup' ? (
                <Field
                  label="Full name"
                  autoComplete="name"
                  value={name}
                  onChange={setName}
                  onBlur={() => setTouched(true)}
                  state={nameErr ? 'error' : name.trim().length >= 2 ? 'success' : 'idle'}
                  message={nameErr}
                />
              ) : null}

              <Field
                label="Work email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={setEmail}
                onBlur={() => setTouched(true)}
                state={emailErr ? 'error' : EMAIL_RE.test(email) ? 'success' : 'idle'}
                message={emailErr}
              />

              <div>
                <div className="relative">
                  <Field
                    label="Password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={setPassword}
                    onBlur={() => setTouched(true)}
                    state={pwErr ? 'error' : 'idle'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-fg-subtle transition-colors hover:text-fg"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === 'signup' ? <StrengthMeter value={password} /> : null}
                {mode === 'signin' ? (
                  <p aria-live="polite" className="mt-1 px-1 text-caption text-danger">
                    {pwErr ?? ''}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer select-none items-center gap-2 text-fg-muted">
                  <span
                    role="checkbox"
                    aria-checked={remember}
                    tabIndex={0}
                    onClick={() => setRemember((r) => !r)}
                    onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), setRemember((r) => !r))}
                    className={cn(
                      'grid h-5 w-5 place-items-center rounded-md border transition-colors',
                      remember ? 'border-accent bg-accent text-accent-contrast' : 'border-border bg-surface-raised',
                    )}
                  >
                    <motion.span
                      initial={false}
                      animate={{ scale: remember ? 1 : 0, opacity: remember ? 1 : 0 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </motion.span>
                  </span>
                  Remember me
                </label>
                {mode === 'signin' ? (
                  <button type="button" onClick={() => toast.info('Password reset', 'A reset link would be emailed here.')} className="font-medium text-fg underline-offset-4 hover:underline">
                    Forgot password?
                  </button>
                ) : null}
              </div>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size={16} label="Please wait" /> {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
                  </>
                ) : mode === 'signup' ? (
                  'Create account'
                ) : (
                  'Sign in'
                )}
              </Button>
            </motion.form>

            <motion.p variants={pickMotionVariant(fadeUp, reduced)} className="mt-6 text-center text-sm text-fg-muted">
              {mode === 'signin' ? 'New to Kombai? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => swap(mode === 'signin' ? 'signup' : 'signin')}
                className="font-semibold text-fg underline-offset-4 hover:underline"
              >
                {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
              </button>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
