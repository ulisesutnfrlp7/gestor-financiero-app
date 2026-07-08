// hooks/useTransactions.ts
// Custom hook que conecta el servicio de Firebase con el store de Zustand.
//
// ¿Por qué un hook y no llamar al servicio directo en el layout?
// - Encapsula la lógica de suscripción/desuscripción
// - Reutilizable si se necesita en múltiples pantallas
// - El cleanup del useEffect garantiza que el listener se cierra al desmontar

import { useEffect } from 'react'
import { useFinanceStore } from '@/store/useFinanceStore'
import { subscribeToTransactions } from '@/services/transactions.service'

export const useTransactions = (): void => {
  const userId       = useFinanceStore((state) => state.userId)
  const setTransactions = useFinanceStore((state) => state.setTransactions)
  const setLoading   = useFinanceStore((state) => state.setLoading)
  const setError     = useFinanceStore((state) => state.setError)

  useEffect(() => {
    // No suscribir si aún no hay usuario autenticado
    if (!userId) return

    setLoading(true)

    const unsubscribe = subscribeToTransactions(
      userId,
      (data) => {
        setTransactions(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    // Cleanup: cierra el WebSocket de Firestore al desmontar el componente
    return () => unsubscribe()
  }, [userId, setTransactions, setLoading, setError])
}
