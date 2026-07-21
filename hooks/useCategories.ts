// hooks/useCategories.ts
// Custom hook que conecta el servicio de categorías con el store de Zustand.
// Similar a useTransactions.ts pero para categorías.

import { useEffect } from 'react'
import { useFinanceStore } from '@/store/useFinanceStore'
import { subscribeToCategories } from '@/services/categories.service'

const NETWORK_TIMEOUT_MS = 15_000

export const useCategories = (): void => {
  const userId        = useFinanceStore((state) => state.userId)
  const setCategories = useFinanceStore((state) => state.setCategories)
  const setLoading    = useFinanceStore((state) => state.setLoading)
  const setError      = useFinanceStore((state) => state.setError)

  useEffect(() => {
    if (!userId) {
      setCategories([])
      return
    }

    setLoading(true)

    // Timeout: si no responde en N segundos, mostramos error de conexión
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError('Sin conexión a Internet. Verificá tu conexión.')
    }, NETWORK_TIMEOUT_MS)

    const unsubscribe = subscribeToCategories(
      userId,
      (data) => {
        clearTimeout(timeoutId)
        setCategories(data)
        setLoading(false)
        setError(null)
      },
      () => {
        clearTimeout(timeoutId)
        setLoading(false)
        // No mostramos error para categorías (no crítico), pero sacamos el loading
      }
    )

    return () => {
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [userId, setCategories, setLoading, setError])
}