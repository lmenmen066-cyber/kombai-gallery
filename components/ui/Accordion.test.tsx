import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from '@/components/ui/Accordion'

const items = [
  { q: 'Is it accessible?', a: 'Yes, keyboard-first.' },
  { q: 'Reduced motion?', a: 'Animations collapse.' },
]

const trigger = (q: string) => screen.getByRole('button', { name: new RegExp(q) })

describe('Accordion', () => {
  it('renders every trigger collapsed', () => {
    render(<Accordion items={items} />)
    expect(trigger('Is it accessible')).toHaveAttribute('aria-expanded', 'false')
    expect(trigger('Reduced motion')).toHaveAttribute('aria-expanded', 'false')
  })

  it('expands a panel on click', async () => {
    render(<Accordion items={items} />)
    await userEvent.click(trigger('Is it accessible'))
    expect(trigger('Is it accessible')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Yes, keyboard-first.')).toBeInTheDocument()
  })

  it('single mode closes the other panel when one opens', async () => {
    render(<Accordion items={items} type="single" />)
    await userEvent.click(trigger('Is it accessible'))
    await userEvent.click(trigger('Reduced motion'))
    expect(trigger('Reduced motion')).toHaveAttribute('aria-expanded', 'true')
    expect(trigger('Is it accessible')).toHaveAttribute('aria-expanded', 'false')
  })

  it('multiple mode keeps several panels open', async () => {
    render(<Accordion items={items} type="multiple" />)
    await userEvent.click(trigger('Is it accessible'))
    await userEvent.click(trigger('Reduced motion'))
    expect(trigger('Is it accessible')).toHaveAttribute('aria-expanded', 'true')
    expect(trigger('Reduced motion')).toHaveAttribute('aria-expanded', 'true')
  })
})
