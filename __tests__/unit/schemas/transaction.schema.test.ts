import { transactionSchema } from '../../../schemas/transaction.schema'

const validTransaction = {
  amount: '1500.50',
  description: 'Compra en supermercado',
  category: 'alimentacion',
  date: '2026-07-26',
  type: 'expense' as const,
  isRecurring: false,
  frequency: 'monthly' as const,
  executionDay: null,
  startDate: '2026-07-26',
  endDate: null,
}

describe('transactionSchema', () => {
  describe('amount', () => {
    it('rejects empty amount', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('amount')
      }
    })

    it('rejects amount equal to 0', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: '0' })
      expect(result.success).toBe(false)
    })

    it('rejects negative amount', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: '-100' })
      expect(result.success).toBe(false)
    })

    it('rejects non-numeric amount', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: 'abc' })
      expect(result.success).toBe(false)
    })

    it('rejects amount exceeding maximum', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: '1000000000' })
      expect(result.success).toBe(false)
    })

    it('accepts valid amount with decimals', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: '999.99' })
      expect(result.success).toBe(true)
    })

    it('accepts amount at maximum boundary', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: '999999999' })
      expect(result.success).toBe(true)
    })
  })

  describe('description', () => {
    it('rejects empty description', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, description: '' })
      expect(result.success).toBe(false)
    })

    it('rejects description longer than 100 characters', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        description: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })

    it('accepts description of exactly 100 characters', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        description: 'a'.repeat(100),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('date', () => {
    it('rejects empty date', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, date: '' })
      expect(result.success).toBe(false)
    })

    it('rejects invalid date format (DD-MM-YYYY)', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, date: '26-07-2026' })
      expect(result.success).toBe(false)
    })

    it('accepts valid date format YYYY-MM-DD', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, date: '2026-01-01' })
      expect(result.success).toBe(true)
    })
  })

  describe('type', () => {
    it('rejects invalid type', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, type: 'saving' })
      expect(result.success).toBe(false)
    })

    it('accepts income type', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, type: 'income' })
      expect(result.success).toBe(true)
    })

    it('accepts expense type', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, type: 'expense' })
      expect(result.success).toBe(true)
    })
  })

  describe('category', () => {
    it('rejects empty category', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, category: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('superRefine - recurring validation', () => {
    it('allows executionDay=null when frequency is daily', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'daily',
        executionDay: null,
        endDate: null,
      })
      expect(result.success).toBe(true)
    })

    it('rejects executionDay!=null when frequency is daily', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'daily',
        executionDay: 5,
        endDate: null,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('executionDay')
      }
    })

    it('rejects executionDay=null when frequency is weekly', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'weekly',
        executionDay: null,
        endDate: null,
      })
      expect(result.success).toBe(false)
    })

    it('rejects executionDay outside 0-6 for weekly', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'weekly',
        executionDay: 7,
        endDate: null,
      })
      expect(result.success).toBe(false)
    })

    it('accepts executionDay=3 for weekly', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'weekly',
        executionDay: 3,
        endDate: null,
      })
      expect(result.success).toBe(true)
    })

    it('rejects executionDay=null for monthly', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'monthly',
        executionDay: null,
        endDate: null,
      })
      expect(result.success).toBe(false)
    })

    it('rejects executionDay=0 for monthly', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'monthly',
        executionDay: 0,
        endDate: null,
      })
      expect(result.success).toBe(false)
    })

    it('accepts executionDay=15 for monthly', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'monthly',
        executionDay: 15,
        endDate: null,
      })
      expect(result.success).toBe(true)
    })

    it('accepts executionDay=1 for yearly', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'yearly',
        executionDay: 1,
        endDate: null,
      })
      expect(result.success).toBe(true)
    })

    it('rejects executionDay=32 for yearly', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'yearly',
        executionDay: 32,
        endDate: null,
      })
      expect(result.success).toBe(false)
    })

    it('rejects endDate before startDate', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'monthly',
        executionDay: 15,
        startDate: '2026-12-01',
        endDate: '2026-11-01',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('endDate')
      }
    })

    it('accepts endDate after startDate', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: true,
        frequency: 'monthly',
        executionDay: 15,
        startDate: '2026-01-01',
        endDate: '2026-12-01',
      })
      expect(result.success).toBe(true)
    })

    it('skips recurring validation when isRecurring=false', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        isRecurring: false,
        frequency: 'daily',
        executionDay: null,
        endDate: null,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('startDate', () => {
    it('rejects empty startDate', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, startDate: '' })
      expect(result.success).toBe(false)
    })
  })
})