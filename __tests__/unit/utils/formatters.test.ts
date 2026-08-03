import {
  formatCurrency,
  formatDate,
  formatShortDate,
  formatDateRangeSubtitle,
  getCurrentDateISO,
} from '../../../utils/formatters'

describe('formatCurrency', () => {
  it('formats integer amount with two decimals', () => {
    const result = formatCurrency(1500)
    expect(result).toContain('1.500')
    expect(result).toContain('00')
  })

  it('formats decimal amount correctly', () => {
    const result = formatCurrency(1500.5)
    expect(result).toContain('1.500')
    expect(result).toContain('50')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('formats negative amount', () => {
    const result = formatCurrency(-500)
    expect(result).toContain('-')
    expect(result).toContain('500')
  })

  it('formats large numbers', () => {
    const result = formatCurrency(1000000)
    expect(result).toContain('1.000.000')
  })
})

describe('formatDate', () => {
  it('formats a valid date string in spanish', () => {
    const result = formatDate('2026-03-15')
    expect(result).toContain('marzo')
    expect(result).toContain('15')
    expect(result).toContain('2026')
  })

  it('returns the original string for invalid date', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('invalid-date')
  })

  it('handles edge case dates', () => {
    const result = formatDate('2026-02-29') // non-leap year
    expect(result).toBe('2026-02-29') // returns original if invalid
  })
})

describe('formatShortDate', () => {
  it('formats a valid date to DD/MM/YYYY', () => {
    const result = formatShortDate('2026-03-15')
    expect(result).toBe('15/03/2026')
  })

  it('returns the original string for invalid date', () => {
    const result = formatShortDate('not-a-date')
    expect(result).toBe('not-a-date')
  })
})

describe('getCurrentDateISO', () => {
  it('returns date in YYYY-MM-DD format', () => {
    const result = getCurrentDateISO()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('formatDateRangeSubtitle', () => {
  it('returns default subtitle when both dates are empty', () => {
    expect(formatDateRangeSubtitle('', '')).toBe('Resumen General')
  })

  it('formats full range as dd/MM/yyyy', () => {
    expect(formatDateRangeSubtitle('2026-08-01', '2026-08-03'))
      .toBe('Del 01/08/2026 al 03/08/2026')
  })

  it('supports partial ranges', () => {
    expect(formatDateRangeSubtitle('2026-08-01', ''))
      .toBe('Del 01/08/2026 al —')
    expect(formatDateRangeSubtitle('', '2026-08-03'))
      .toBe('Del — al 03/08/2026')
  })
})