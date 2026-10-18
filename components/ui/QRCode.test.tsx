import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// jsdom has no canvas, so mock the qrcode lib's async toDataURL; we're testing
// the component's wiring (img render, copy, download), not QR encoding itself.
const FAKE_URL = 'data:image/png;base64,FAKE'
vi.mock('qrcode', () => ({
  default: { toDataURL: vi.fn(() => Promise.resolve('data:image/png;base64,FAKE')) },
}))

import { QRCode } from '@/components/ui/QRCode'

const writeText = vi.fn(() => Promise.resolve())

beforeEach(() => {
  writeText.mockClear()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
})

describe('QRCode', () => {
  it('renders the generated image once resolved', async () => {
    render(<QRCode value="https://example.com" label="Go" />)
    const img = await screen.findByRole('img', { name: 'QR code for Go' })
    expect(img).toHaveAttribute('src', FAKE_URL)
  })

  it('wires the download anchor to the data URL', async () => {
    render(<QRCode value="https://example.com" />)
    await screen.findByRole('img')
    const link = screen.getByRole('link', { name: 'Download QR image' })
    expect(link).toHaveAttribute('href', FAKE_URL)
    expect(link).toHaveAttribute('download', 'qr.png')
  })

  it('copies the link and reflects the Copied state', async () => {
    render(<QRCode value="https://example.com" />)
    await screen.findByRole('img')
    await userEvent.click(screen.getByRole('button', { name: 'Copy link' }))
    expect(writeText).toHaveBeenCalledWith('https://example.com')
    expect(await screen.findByText('Copied')).toBeInTheDocument()
  })

  it('shows the value text for scanning', async () => {
    render(<QRCode value="https://example.com" />)
    expect(screen.getByText('https://example.com')).toBeInTheDocument()
    expect(screen.getByText('Scan to open')).toBeInTheDocument()
  })
})
