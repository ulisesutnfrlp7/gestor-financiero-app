// hooks/useCategories.ts
// Custom hook que conecta el servicio de categorías con el store de Zustand.
// Similar a useTransactions.ts pero para categorías.

import { useEffect } from 'react'
import { useFinanceStore } from '@/store/useFinanceStore'
import { subscribeToCategories } from '@/services/categories.service'

export const useCategories = (): void => {
  const userId        = useFinanceStore((state) => state.userId)
  const setCategories = useFinanceStore((state) => state.setCategories)

  useEffect(() => {
    if (!userId) {
      setCategories([])
      return
    }

    const unsubscribe = subscribeToCategories(
      userId,
      (data) => setCategories(data),
      () => {
        // Silently fail — las categorías no son críticas para la funcionalidad
      }
    )

    return () => unsubscribe()
  }, [userId, setCategories])
}