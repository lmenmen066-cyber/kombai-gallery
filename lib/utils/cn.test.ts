import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils/cn'

describe('cn', () => {
  it('joins conditional classes', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c')
  })

  it('lets later Tailwind classes override earlier ones (tailwind-merge)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('does not merge across unrelated properties', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  it('returns empty string for no classes', () => {
    expect(cn()).toBe('')
  })
})
