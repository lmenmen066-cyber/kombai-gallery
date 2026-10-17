import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders a titled dialog with its content when open', () => {
    render(
      <Modal open onOpenChange={() => {}} title="Hello" description="Body text">
        <p>MODAL-BODY</p>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Hello' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('MODAL-BODY')).toBeInTheDocument()
    expect(screen.getByText('Body text')).toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="Gone">
        <p>NOPE</p>
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('NOPE')).not.toBeInTheDocument()
  })

  it('fires onOpenChange when the close button is used', async () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange} title="Close me">
        <p>x</p>
      </Modal>,
    )
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
