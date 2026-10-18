import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chat } from '@/components/ui/Chat'

describe('Chat', () => {
  it('renders the seed message and a disabled Send until text is typed', () => {
    render(<Chat />)
    expect(screen.getByText('Hi — ask me anything about the design system.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
  })

  it('enables Send once the input has content', async () => {
    render(<Chat />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Message' }), 'hi')
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled()
  })

  it('submits the message into the thread and clears the input', async () => {
    render(<Chat />)
    const input = screen.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'hello there')
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    // the user's own message appears immediately; input resets.
    expect(await screen.findByText('hello there')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })
})
