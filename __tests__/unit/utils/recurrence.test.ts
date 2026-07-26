import { calculateNextExecutionDate } from '../../../utils/recurrence'
import type { RecurringTemplate } from '../../../types'

const baseTemplate: RecurringTemplate = {
  id: '1',
  amount: 1000,
  description: 'Test',
  category: 'general',
  type: 'expense',
  userId: 'u1',
  frequency: 'monthly',
  executionDay: 15,
  startDate: '2026-01-01',
  endDate: null,
  isActive: true,
  lastGeneratedDate: null,
  nextExecutionDate: '2026-01-15',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('calculateNextExecutionDate', () => {
  describe('daily', () => {
    it('adds 1 day to current date', () => {
      const result = calculateNextExecutionDate('2026-07-01', {
        ...baseTemplate,
        frequency: 'daily',
        executionDay: null,
      })
      expect(result).toBe('2026-07-02')
    })

    it('rolls over month correctly', () => {
      const result = calculateNextExecutionDate('2026-01-31', {
        ...baseTemplate,
        frequency: 'daily',
        executionDay: null,
      })
      expect(result).toBe('2026-02-01')
    })
  })

  describe('weekly', () => {
    it('adds 7 days to current date', () => {
      const result = calculateNextExecutionDate('2026-07-01', {
        ...baseTemplate,
        frequency: 'weekly',
        executionDay: 3,
      })
      expect(result).toBe('2026-07-08')
    })
  })

  describe('biweekly', () => {
    it('adds 14 days to current date', () => {
      const result = calculateNextExecutionDate('2026-07-01', {
        ...baseTemplate,
        frequency: 'biweekly',
        executionDay: 1,
      })
      expect(result).toBe('2026-07-15')
    })
  })

  describe('monthly', () => {
    it('sets next month on the configured execution day', () => {
      const result = calculateNextExecutionDate('2026-07-15', {
        ...baseTemplate,
        frequency: 'monthly',
        executionDay: 15,
      })
      expect(result).toBe('2026-08-15')
    })

    it('clamps to last day of month when execution day exceeds month length', () => {
      const result = calculateNextExecutionDate('2026-01-31', {
        ...baseTemplate,
        frequency: 'monthly',
        executionDay: 31,
      })
      // Feb 2026 has 28 days
      expect(result).toBe('2026-02-28')
    })

    it('uses current date day when executionDay is null', () => {
      const result = calculateNextExecutionDate('2026-07-20', {
        ...baseTemplate,
        frequency: 'monthly',
        executionDay: null,
      })
      expect(result).toBe('2026-08-20')
    })
  })

  describe('yearly', () => {
    it('sets next year on the configured execution day', () => {
      const result = calculateNextExecutionDate('2026-06-15', {
        ...baseTemplate,
        frequency: 'yearly',
        executionDay: 15,
      })
      expect(result).toBe('2027-06-15')
    })

    it('preserves same month for yearly frequency', () => {
      // yearly suma 1 año al mismo mes (enero → enero, ambos tienen 31 días)
      const result = calculateNextExecutionDate('2024-01-31', {
        ...baseTemplate,
        frequency: 'yearly',
        executionDay: 31,
      })
      expect(result).toBe('2025-01-31')
    })
  })

  describe('error handling', () => {
    it('throws error for invalid date string', () => {
      expect(() =>
        calculateNextExecutionDate('not-a-date', baseTemplate)
      ).toThrow('Fecha de ejecución inválida')
    })
  })
})