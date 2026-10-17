import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Divider } from '@/components/ui/Divider'

describe('Divider', () => {
  it('renders a plain horizontal rule', () => {
    const { container } = render(<Divider />)
    expect(container.querySelector('hr')).toBeTruthy()
  })

  it('shows a centered label', () => {
    render(<Divider label="or" />)
    expect(screen.getByText('or')).toBeInTheDocument()
  })

  it('renders a vertical separator with the right orientation', () => {
    render(<Divider vertical />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-orientation', 'vertical')
  })
})
