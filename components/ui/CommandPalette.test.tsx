import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Shared spies must exist before the vi.mock factories run -> vi.hoisted.
const mocks = vi.hoisted(() => ({ push: vi.fn(), setTheme: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
  usePathname: () => '/',
}))
vi.mock('@/components/providers/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'system', resolved: 'light', setTheme: mocks.setTheme, toggle: vi.fn() }),
}))

import { CommandPalette } from '@/components/ui/CommandPalette'
import { usePrefs } from '@/lib/store/prefs'

const openPalette = () => usePrefs.setState({ paletteOpen: true })

beforeEach(() => {
  mocks.push.mockClear()
  mocks.setTheme.mockClear()
  usePrefs.setState({ paletteOpen: false, motion: 'auto', cursor: true })
})
afterEach(() => usePrefs.setState({ paletteOpen: false }))

describe('CommandPalette', () => {
  it('renders nothing while closed', () => {
    render(<CommandPalette />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens and lists commands', () => {
    openPalette()
    render(<CommandPalette />)
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('combobox')).toBeInTheDocument()
    expect(within(dialog).getByRole('option', { name: /Dashboard/ })).toBeInTheDocument()
  })

  it('filters the list by the query', async () => {
    openPalette()
    render(<CommandPalette />)
    await userEvent.type(screen.getByRole('combobox'), 'dark')
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('option', { name: /Dark mode/ })).toBeInTheDocument()
    expect(within(dialog).queryByRole('option', { name: /Dashboard/ })).not.toBeInTheDocument()
  })

  it('routes to a page on selection', async () => {
    openPalette()
    render(<CommandPalette />)
    await userEvent.click(screen.getByRole('option', { name: /Dashboard/ }))
    expect(mocks.push).toHaveBeenCalledWith('/dashboard')
    expect(usePrefs.getState().paletteOpen).toBe(false) // closes on run
  })

  it('applies a theme command', async () => {
    openPalette()
    render(<CommandPalette />)
    await userEvent.type(screen.getByRole('combobox'), 'light mode')
    await userEvent.click(screen.getByRole('option', { name: /Light mode/ }))
    expect(mocks.setTheme).toHaveBeenCalledWith('light')
  })

  it('supports keyboard navigation (ArrowDown + Enter)', async () => {
    openPalette()
    render(<CommandPalette />)
    const input = screen.getByRole('combobox')
    input.focus()
    await userEvent.keyboard('{ArrowDown}{Enter}') // first is Home, down -> Dashboard
    expect(mocks.push).toHaveBeenCalledWith('/dashboard')
  })

  it('shows an empty state for a non-matching query', async () => {
    openPalette()
    render(<CommandPalette />)
    await userEvent.type(screen.getByRole('combobox'), 'zzzznotacommand')
    expect(screen.getByText(/No commands match/)).toBeInTheDocument()
  })
})
