import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '@/components/ui/Tabs'

const tabs = [
  { value: 'one', label: 'First', content: <p>PANEL-ONE</p> },
  { value: 'two', label: 'Second', content: <p>PANEL-TWO</p> },
]

describe('Tabs', () => {
  it('selects the first tab by default and shows its panel', () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('PANEL-ONE')).toBeInTheDocument()
  })

  it('switches panel when another tab is clicked', async () => {
    render(<Tabs tabs={tabs} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Second' }))
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('PANEL-TWO')).toBeInTheDocument()
  })

  it('honors defaultValue', () => {
    render(<Tabs tabs={tabs} defaultValue="two" />)
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('PANEL-TWO')).toBeInTheDocument()
  })
})
