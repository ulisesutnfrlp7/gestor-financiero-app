// Sincroniza las plantillas recurrentes de Firestore con el store local.

import { useEffect } from 'react'
import { subscribeToRecurringTemplates } from '@/services/recurring.service'
import { useFinanceStore } from '@/store/useFinanceStore'

export const useRecurringTemplates = (): void => {
  const userId = useFinanceStore((state) => state.userId)
  const setRecurringTemplates = useFinanceStore((state) => state.setRecurringTemplates)
  const setError = useFinanceStore((state) => state.setError)

  useEffect(() => {
    if (!userId) {
      setRecurringTemplates([])
      return
    }

    setRecurringTemplates([])
    const unsubscribe = subscribeToRecurringTemplates(
      userId,
      setRecurringTemplates,
      (error) => {
        console.error('Error al cargar plantillas recurrentes:', error.message)
        setError(error.message)
      }
    )

    return unsubscribe
  }, [userId, setError, setRecurringTemplates])
}
