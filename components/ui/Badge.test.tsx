import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge tone="success">Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies the solid semantic tone class', () => {
    const { rerender } = render(<Badge tone="success">S</Badge>)
    expect(screen.getByText('S')).toHaveClass('bg-success', 'text-white')
    rerender(<Badge tone="warning">W</Badge>)
    expect(screen.getByText('W')).toHaveClass('bg-warning')
  })

  it('shows a status dot when requested', () => {
    render(
      <Badge tone="info" dot>
        Live
      </Badge>,
    )
    // dot renders an extra aria-hidden span inside the badge
    expect(screen.getByText('Live').querySelector('[aria-hidden]')).toBeTruthy()
  })
})
