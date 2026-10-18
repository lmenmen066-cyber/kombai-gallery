import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Carousel, type Slide } from '@/components/ui/Carousel'

const slides: Slide[] = [
  { title: 'Alpha', body: 'first body', from: '#fff000', to: '#000fff' },
  { title: 'Beta', body: 'second body', from: '#ff0000', to: '#00ff00' },
]

// autoPlay=false keeps the test deterministic (no setInterval / timers).
const renderCarousel = () => render(<Carousel slides={slides} autoPlay={false} />)

describe('Carousel', () => {
  it('shows the first slide and one dot per slide', () => {
    renderCarousel()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    const group = screen.getByRole('group', { name: '1 of 2' })
    expect(group).toBeInTheDocument()
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(2)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('advances to the next slide via the Next control', async () => {
    renderCarousel()
    await userEvent.click(screen.getByLabelText('Next slide'))
    expect(await screen.findByText('Beta')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to Beta')).toHaveAttribute('aria-selected', 'true')
  })

  it('jumps to a slide via its dot', async () => {
    renderCarousel()
    await userEvent.click(screen.getByLabelText('Go to Beta'))
    expect(await screen.findByText('Beta')).toBeInTheDocument()
  })

  it('does not wrap past the first slide when clicking Previous', () => {
    renderCarousel()
    // clamp + modulo keeps the first slide at 0 (no negative wrap)
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: '1 of 2' })).toBeInTheDocument()
  })

  it('disables the autoplay toggle when autoPlay is off', () => {
    renderCarousel()
    expect(screen.getByLabelText(/autoplay/i)).toBeDisabled()
  })
})
