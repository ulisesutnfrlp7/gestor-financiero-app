// store/useFinanceStore.ts
// Store central de Zustand.
//
// Decisión de diseño:
// - El store solo guarda estado sincrónico (transactions, loading, error, userId).
// - Las operaciones async (Firebase) viven en los servicios y se llaman desde las pantallas.
// - Los selectores (selectBalance, etc.) son funciones puras fuera del store para
//   evitar computaciones en el render y facilitar memoización con useCallback/useMemo.
//
// Patrón recomendado para Zustand: un hook por store, selectores externos.

import { create } from 'zustand'
import type { Transaction } from '@/types'

interface FinanceState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  userId: string | null

  // Acciones — nombre explícito de lo que hacen
  setTransactions: (transactions: Transaction[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setUserId: (userId: string | null) => void
}

export const useFinanceStore = create<FinanceState>()((set) => ({
  // Estado inicial
  transactions: [],
  isLoading: false,
  error: null,
  userId: null,

  // Setters inmutables
  setTransactions: (transactions) => set({ transactions }),
  setLoading:      (isLoading)    => set({ isLoading }),
  setError:        (error)        => set({ error }),
  setUserId:       (userId)       => set({ userId }),
}))

// ─── Selectores ───────────────────────────────────────────────────────────────
// Definidos FUERA del store para que React pueda memoizarlos con useCallback.
// Se pasan directamente a useFinanceStore: useFinanceStore(selectBalance)

export const selectTotalIncome = (state: FinanceState): number =>
  state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

export const selectTotalExpenses = (state: FinanceState): number =>
  state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

export const selectBalance = (state: FinanceState): number =>
  selectTotalIncome(state) - selectTotalExpenses(state)
