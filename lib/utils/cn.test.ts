import { describe, it, expect } from 'vitest'
import { cn, clamp, round, formatNumber, isBrowser } from '@/lib/utils/cn'

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

  it('keeps a color and a custom font-size (they are different groups)', () => {
    expect(cn('text-white', 'text-caption')).toBe('text-white text-caption')
  })

  it('lets two font-sizes override each other', () => {
    expect(cn('text-body', 'text-caption')).toBe('text-caption')
  })

  it('returns empty string for no classes', () => {
    expect(cn()).toBe('')
  })
})

describe('clamp', () => {
  it('bounds a value to [min, max]', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(42, 0, 10)).toBe(10)
  })
})

describe('round', () => {
  it('rounds to precision decimals', () => {
    expect(round(3.14159, 2)).toBe(3.14)
    expect(round(3.6)).toBe(4)
  })
})

describe('formatNumber', () => {
  it('adds separators, prefix, suffix and fixed decimals', () => {
    expect(formatNumber(1234.5, { decimals: 1, prefix: '$', suffix: '/mo' })).toBe('$1,234.5/mo')
    expect(formatNumber(2000)).toBe('2,000')
  })
})

describe('isBrowser', () => {
  it('is true under jsdom', () => {
    expect(isBrowser).toBe(true)
  })
})
