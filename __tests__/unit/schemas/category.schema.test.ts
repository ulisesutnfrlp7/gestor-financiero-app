import { categorySchema, validateCategoryUniqueness } from '../../../schemas/category.schema'
import type { CustomCategory } from '../../../types'

const validCategory = {
  label: 'Comida',
  type: 'expense' as const,
  color: '#FF5733',
}

describe('categorySchema', () => {
  describe('label', () => {
    it('rejects empty label', () => {
      const result = categorySchema.safeParse({ ...validCategory, label: '' })
      expect(result.success).toBe(false)
    })

    it('rejects label longer than 30 characters', () => {
      const result = categorySchema.safeParse({
        ...validCategory,
        label: 'a'.repeat(31),
      })
      expect(result.success).toBe(false)
    })

    it('accepts label of exactly 30 characters', () => {
      const result = categorySchema.safeParse({
        ...validCategory,
        label: 'a'.repeat(30),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('type', () => {
    it('rejects invalid type', () => {
      const result = categorySchema.safeParse({ ...validCategory, type: 'saving' })
      expect(result.success).toBe(false)
    })

    it('accepts income type', () => {
      const result = categorySchema.safeParse({ ...validCategory, type: 'income' })
      expect(result.success).toBe(true)
    })

    it('accepts expense type', () => {
      const result = categorySchema.safeParse({ ...validCategory, type: 'expense' })
      expect(result.success).toBe(true)
    })
  })

  describe('color', () => {
    it('rejects empty color', () => {
      const result = categorySchema.safeParse({ ...validCategory, color: '' })
      expect(result.success).toBe(false)
    })
  })

  it('accepts a valid category', () => {
    const result = categorySchema.safeParse(validCategory)
    expect(result.success).toBe(true)
  })
})

describe('validateCategoryUniqueness', () => {
  const existingCategories: CustomCategory[] = [
    { id: '1', label: 'Comida', type: 'expense', color: '#FF5733', icon: 'fast-food', userId: 'u1', createdAt: '2026-01-01T00:00:00Z' },
    { id: '2', label: 'Transporte', type: 'expense', color: '#33FF57', icon: 'car', userId: 'u1', createdAt: '2026-01-01T00:00:00Z' },
    { id: '3', label: 'Sueldo', type: 'income', color: '#3357FF', icon: 'cash', userId: 'u1', createdAt: '2026-01-01T00:00:00Z' },
  ]

  it('returns success when label and color are unique within type', () => {
    const result = validateCategoryUniqueness(
      { label: 'Salud', type: 'expense', color: '#F3F3F3' },
      existingCategories
    )
    expect(result).toEqual({ success: true })
  })

  it('returns error when label already exists in same type', () => {
    const result = validateCategoryUniqueness(
      { label: 'Comida', type: 'expense', color: '#F3F3F3' },
      existingCategories
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Comida')
    }
  })

  it('is case-insensitive for duplicate label check', () => {
    const result = validateCategoryUniqueness(
      { label: 'comida', type: 'expense', color: '#F3F3F3' },
      existingCategories
    )
    expect(result.success).toBe(false)
  })

  it('allows same label in different type', () => {
    const result = validateCategoryUniqueness(
      { label: 'Comida', type: 'income', color: '#F3F3F3' },
      existingCategories
    )
    expect(result).toEqual({ success: true })
  })

  it('returns error when color already exists in same type', () => {
    const result = validateCategoryUniqueness(
      { label: 'Salud', type: 'expense', color: '#FF5733' },
      existingCategories
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Comida')
    }
  })

  it('allows same color in different type', () => {
    const result = validateCategoryUniqueness(
      { label: 'Salud', type: 'income', color: '#FF5733' },
      existingCategories
    )
    expect(result).toEqual({ success: true })
  })

  it('excludes editing category from duplicate check', () => {
    const result = validateCategoryUniqueness(
      { label: 'Comida', type: 'expense', color: '#FF5733' },
      existingCategories,
      '1' // editing the same category
    )
    expect(result).toEqual({ success: true })
  })
})