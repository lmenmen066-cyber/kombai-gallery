import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Star, Heart } from 'lucide-react'
import { Toolbar } from '@/components/ui/Toolbar'

const items = [
  { id: 'a', label: 'Alpha', icon: Star },
  { id: 'b', label: 'Beta', icon: Heart },
]

describe('Toolbar', () => {
  it('renders a labelled toolbar with one button per item', () => {
    render(<Toolbar items={items} activeId="a" onSelect={() => {}} ariaLabel="Tools" />)
    expect(screen.getByRole('toolbar', { name: 'Tools' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Beta' })).toBeInTheDocument()
  })

  it('marks the active item with aria-pressed', () => {
    render(<Toolbar items={items} activeId="b" onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'Beta' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports selection via onSelect', async () => {
    const onSelect = vi.fn()
    render(<Toolbar items={items} activeId="a" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Beta' }))
    expect(onSelect).toHaveBeenCalledWith('b')
  })
})
