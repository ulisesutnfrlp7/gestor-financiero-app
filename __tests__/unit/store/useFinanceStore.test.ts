import { useFinanceStore, selectTotalIncome, selectTotalExpenses, selectBalance, selectAllCategories } from '../../../store/useFinanceStore'
import type { Transaction, CustomCategory } from '../../../types'

const mockTransactions: Transaction[] = [
  { id: '1', amount: 1000, description: 'Sueldo', category: 'trabajo', date: '2026-07-01', type: 'income', userId: 'u1', createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-01T00:00:00Z' },
  { id: '2', amount: 500, description: 'Comida', category: 'alimentacion', date: '2026-07-02', type: 'expense', userId: 'u1', createdAt: '2026-07-02T00:00:00Z', updatedAt: '2026-07-02T00:00:00Z' },
  { id: '3', amount: 200, description: 'Freelance', category: 'trabajo', date: '2026-07-03', type: 'income', userId: 'u1', createdAt: '2026-07-03T00:00:00Z', updatedAt: '2026-07-03T00:00:00Z' },
  { id: '4', amount: 300, description: 'Transporte', category: 'transporte', date: '2026-07-04', type: 'expense', userId: 'u1', createdAt: '2026-07-04T00:00:00Z', updatedAt: '2026-07-04T00:00:00Z' },
]

const mockCategories: CustomCategory[] = [
  { id: 'c1', label: 'Trabajo', type: 'income', color: '#3357FF', icon: 'briefcase', userId: 'u1', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'c2', label: 'Comida', type: 'expense', color: '#FF5733', icon: 'fast-food', userId: 'u1', createdAt: '2026-01-01T00:00:00Z' },
]

describe('useFinanceStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useFinanceStore.setState({
      transactions: [],
      categories: [],
      recurringTemplates: [],
      isLoading: false,
      error: null,
      userId: null,
    })
  })

  describe('setTransactions', () => {
    it('sets transactions array', () => {
      useFinanceStore.getState().setTransactions(mockTransactions)
      expect(useFinanceStore.getState().transactions).toEqual(mockTransactions)
    })

    it('replaces previous transactions', () => {
      useFinanceStore.getState().setTransactions(mockTransactions)
      useFinanceStore.getState().setTransactions([])
      expect(useFinanceStore.getState().transactions).toEqual([])
    })
  })

  describe('setCategories', () => {
    it('sets categories array', () => {
      useFinanceStore.getState().setCategories(mockCategories)
      expect(useFinanceStore.getState().categories).toEqual(mockCategories)
    })
  })

  describe('setLoading', () => {
    it('sets loading state', () => {
      useFinanceStore.getState().setLoading(true)
      expect(useFinanceStore.getState().isLoading).toBe(true)
      useFinanceStore.getState().setLoading(false)
      expect(useFinanceStore.getState().isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    it('sets error message', () => {
      useFinanceStore.getState().setError('Something went wrong')
      expect(useFinanceStore.getState().error).toBe('Something went wrong')
    })

    it('clears error with null', () => {
      useFinanceStore.getState().setError('Error')
      useFinanceStore.getState().setError(null)
      expect(useFinanceStore.getState().error).toBeNull()
    })
  })

  describe('setUserId', () => {
    it('sets userId', () => {
      useFinanceStore.getState().setUserId('user-123')
      expect(useFinanceStore.getState().userId).toBe('user-123')
    })

    it('clears userId with null', () => {
      useFinanceStore.getState().setUserId('user-123')
      useFinanceStore.getState().setUserId(null)
      expect(useFinanceStore.getState().userId).toBeNull()
    })
  })
})

describe('selectors', () => {
  describe('selectTotalIncome', () => {
    it('sums all income transactions', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, transactions: mockTransactions })
      const result = selectTotalIncome(useFinanceStore.getState())
      expect(result).toBe(1200) // 1000 + 200
    })

    it('returns 0 when no income transactions', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, transactions: [
        { id: '1', amount: 500, description: 'Gasto', category: 'x', date: '2026-07-01', type: 'expense', userId: 'u1', createdAt: '', updatedAt: '' },
      ]})
      const result = selectTotalIncome(useFinanceStore.getState())
      expect(result).toBe(0)
    })

    it('returns 0 for empty transactions', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, transactions: [] })
      const result = selectTotalIncome(useFinanceStore.getState())
      expect(result).toBe(0)
    })
  })

  describe('selectTotalExpenses', () => {
    it('sums all expense transactions', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, transactions: mockTransactions })
      const result = selectTotalExpenses(useFinanceStore.getState())
      expect(result).toBe(800) // 500 + 300
    })

    it('returns 0 when no expense transactions', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, transactions: [
        { id: '1', amount: 1000, description: 'Ingreso', category: 'x', date: '2026-07-01', type: 'income', userId: 'u1', createdAt: '', updatedAt: '' },
      ]})
      const result = selectTotalExpenses(useFinanceStore.getState())
      expect(result).toBe(0)
    })
  })

  describe('selectBalance', () => {
    it('calculates balance as income - expenses', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, transactions: mockTransactions })
      const result = selectBalance(useFinanceStore.getState())
      expect(result).toBe(400) // 1200 - 800
    })

    it('returns negative when expenses exceed income', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, transactions: [
        { id: '1', amount: 500, description: 'Ingreso', category: 'x', date: '2026-07-01', type: 'income', userId: 'u1', createdAt: '', updatedAt: '' },
        { id: '2', amount: 1000, description: 'Gasto grande', category: 'x', date: '2026-07-02', type: 'expense', userId: 'u1', createdAt: '', updatedAt: '' },
      ]})
      const result = selectBalance(useFinanceStore.getState())
      expect(result).toBe(-500)
    })

    it('returns 0 for no transactions', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, transactions: [] })
      const result = selectBalance(useFinanceStore.getState())
      expect(result).toBe(0)
    })
  })

  describe('selectAllCategories', () => {
    it('returns all categories', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, categories: mockCategories })
      const result = selectAllCategories(useFinanceStore.getState())
      expect(result).toEqual(mockCategories)
    })

    it('returns empty array when no categories', () => {
      const state = useFinanceStore.getState()
      useFinanceStore.setState({ ...state, categories: [] })
      const result = selectAllCategories(useFinanceStore.getState())
      expect(result).toEqual([])
    })
  })
})