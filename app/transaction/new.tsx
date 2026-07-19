// app/transaction/new.tsx
// Modal para crear un nuevo movimiento.
//
// La pantalla es un "thin layer" — solo delega al servicio y navega.
// No contiene lógica de negocio ni de formulario (esa responsabilidad
// es del componente TransactionForm).

import React from 'react'
import { Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useFinanceStore } from '@/store/useFinanceStore'
import { createTransaction } from '@/services/transactions.service'
import type { TransactionFormData } from '@/types'

export default function NewTransactionScreen() {
  const userId = useFinanceStore((state) => state.userId)

  const handleSubmit = async (data: TransactionFormData) => {
    if (!userId) return
    await createTransaction(userId, data)
    Alert.alert('Éxito', 'Movimiento registrado exitosamente.')
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <TransactionForm onSubmit={handleSubmit} />
    </SafeAreaView>
  )
}
