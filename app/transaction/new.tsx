// app/transaction/new.tsx
// Modal para crear un nuevo movimiento.
//
// La pantalla es un "thin layer" — solo delega al servicio y navega.
// No contiene lógica de negocio ni de formulario (esa responsabilidad
// es del componente TransactionForm).

import React from 'react'
import { View, Text, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useFinanceStore } from '@/store/useFinanceStore'
import { createTransaction } from '@/services/transactions.service'
import type { TransactionFormData } from '@/types'
import { isOnline } from '@/utils/network'

export default function NewTransactionScreen() {
  const userId = useFinanceStore((state) => state.userId)
  const error  = useFinanceStore((state) => state.error)

  const handleSubmit = async (data: TransactionFormData) => {
    if (!userId) return

    const online = await isOnline()
    if (!online) {
      Alert.alert('Sin conexión', 'Sin conexión a Internet. Verificá tu conexión.')
      return
    }

    await createTransaction(userId, data)
    Alert.alert('Éxito', 'Movimiento registrado exitosamente.')
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {error && (
        <View className="mx-5 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}
      <TransactionForm onSubmit={handleSubmit} />
    </SafeAreaView>
  )
}
