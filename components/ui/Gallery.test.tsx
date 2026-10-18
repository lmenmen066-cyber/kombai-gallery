import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Gallery, type GalleryItem } from '@/components/ui/Gallery'

const items: GalleryItem[] = [
  { id: 'g1', cat: 'Product', title: 'Launch', from: '#ffffff', to: '#111111' },
  { id: 'g2', cat: 'Brand', title: 'Identity', from: '#eeeeee', to: '#222222' },
  { id: 'g3', cat: 'Product', title: 'Pricing', from: '#dddddd', to: '#333333' },
]

describe('Gallery', () => {
  it('renders All + per-category filter chips and every tile', () => {
    render(<Gallery items={items} />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Product' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Brand' })).toBeInTheDocument()
    for (const it of items) {
      expect(screen.getByRole('button', { name: new RegExp(it.title) })).toBeInTheDocument()
    }
  })

  it('filters tiles by category', async () => {
    render(<Gallery items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Brand' }))
    // only Brand's "Identity" remains
    await waitFor(() => expect(screen.queryByRole('button', { name: /Launch/ })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: /Identity/ })).toBeInTheDocument()
  })

  it('opens the lightbox on a tile and navigates / closes', async () => {
    render(<Gallery items={items} />)
    await userEvent.click(screen.getByRole('button', { name: /Launch/ }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName(/image 1 of 3/)

    await userEvent.click(within(dialog).getByLabelText('Next image'))
    expect(await within(dialog).findByText(/2 \/ 3|2 \/ 2/)).toBeInTheDocument()

    await userEvent.click(within(dialog).getByLabelText('Close'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes the lightbox with Escape', async () => {
    render(<Gallery items={items} />)
    await userEvent.click(screen.getByRole('button', { name: /Pricing/ }))
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
