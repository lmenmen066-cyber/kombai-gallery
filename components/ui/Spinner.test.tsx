import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from '@/components/ui/Spinner'

describe('Spinner', () => {
  it('is announced as a status region when given a label', () => {
    render(<Spinner label="Loading projects" />)
    expect(screen.getByRole('status', { name: 'Loading projects' })).toBeInTheDocument()
  })

  it('is hidden from assistive tech without a label (decorative)', () => {
    render(<Spinner />)
    expect(screen.queryByRole('status')).toBeNull()
  })
})
