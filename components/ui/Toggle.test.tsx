import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from '@/components/ui/Toggle'

describe('Toggle', () => {
  it('exposes role=switch reflecting aria-checked', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Notify" />)
    const sw = screen.getByRole('switch', { name: 'Notify' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with the flipped value when clicked', async () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} label="Notify" />)
    await userEvent.click(screen.getByRole('switch', { name: 'Notify' }))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does not fire when disabled', async () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} disabled label="Notify" />)
    await userEvent.click(screen.getByRole('switch', { name: 'Notify' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
