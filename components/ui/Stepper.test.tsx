import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Stepper, type Step } from '@/components/ui/Stepper'

const steps: Step[] = [
  { title: 'Account' },
  { title: 'Profile' },
  { title: 'Review' },
]

describe('Stepper', () => {
  it('shows every step title and the numeric markers', () => {
    render(<Stepper steps={steps} current={1} />)
    for (const s of steps) expect(screen.getByText(s.title)).toBeInTheDocument()
    // current step (index 1) shows "2"; a later step is disabled
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeDisabled()
  })

  it('marks the active step with aria-current="step"', () => {
    render(<Stepper steps={steps} current={0} />)
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'step')
  })

  it('calls onStepChange when jumping back to a completed step', async () => {
    const onStepChange = vi.fn()
    render(<Stepper steps={steps} current={2} onStepChange={onStepChange} />)
    // step index 0 is completed (renders a check, not a number), so target it by
    // position; completed steps are clickable (only future steps are disabled).
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(onStepChange).toHaveBeenCalledWith(0)
  })

  it('renders the vertical variant without error', () => {
    render(<Stepper steps={steps} current={1} orientation="vertical" />)
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
  })
})
