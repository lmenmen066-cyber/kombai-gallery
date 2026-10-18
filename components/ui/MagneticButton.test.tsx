import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MagneticButton } from '@/components/ui/MagneticButton'

describe('MagneticButton', () => {
  it('renders a button with its label and fires onClick', async () => {
    const onClick = vi.fn()
    render(
      <MagneticButton onClick={onClick} variant="secondary">
        Save
      </MagneticButton>,
    )
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toBeInTheDocument()
    await userEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a link when href is provided', () => {
    render(
      <MagneticButton href="/docs" variant="link">
        Docs
      </MagneticButton>,
    )
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveAttribute('href', '/docs')
  })

  it('can be disabled', () => {
    render(
      <MagneticButton disabled onClick={() => {}}>
        Noop
      </MagneticButton>,
    )
    expect(screen.getByRole('button', { name: 'Noop' })).toBeDisabled()
  })
})
