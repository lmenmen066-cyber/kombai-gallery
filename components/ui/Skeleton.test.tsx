import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from '@/components/ui/Skeleton'

describe('Skeleton', () => {
  it('renders one shimmer block by default', () => {
    const { container } = render(<Skeleton className="h-4 w-10" />)
    const el = container.querySelector('.shimmer')
    expect(el).toBeTruthy()
    expect(el!.classList.contains('h-4')).toBe(true)
  })

  it('renders N lines when lines is set (last one shorter)', () => {
    const { container } = render(<Skeleton lines={3} />)
    const bars = container.querySelectorAll('.shimmer')
    expect(bars).toHaveLength(3)
    expect(bars[2].classList.contains('w-2/3')).toBe(true)
  })

  it('renders a circular shape as a rounded-full, aria-hidden element', () => {
    const { container } = render(<Skeleton shape="circle" className="h-8 w-8" />)
    const el = container.querySelector('span.rounded-full')
    expect(el).toBeTruthy()
    expect(el).toHaveAttribute('aria-hidden')
  })
})
