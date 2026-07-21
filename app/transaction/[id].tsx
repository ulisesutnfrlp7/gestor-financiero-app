// app/transaction/[id].tsx
// Modal para editar o eliminar un movimiento existente.
//
// useLocalSearchParams() extrae el parámetro dinámico [id] de la URL.
// El movimiento se busca en el store local (ya cargado) en lugar de hacer
// una query adicional a Firestore — principio de "single source of truth".

import React from 'react'
import { View, Text, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useFinanceStore } from '@/store/useFinanceStore'
import { updateTransaction } from '@/services/transactions.service'
import type { TransactionFormData } from '@/types'
import { isOnline } from '@/utils/network'

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const error = useFinanceStore((state) => state.error)

  // Buscar el movimiento directamente en el store sin nueva query a Firestore
  const transaction = useFinanceStore((state) =>
    state.transactions.find((t) => t.id === id)
  )

  const handleSubmit = async (data: TransactionFormData) => {
    if (!id) return

    const online = await isOnline()
    if (!online) {
      Alert.alert('Sin conexión', 'Sin conexión a Internet. Verificá tu conexión.')
      return
    }

    await updateTransaction(id, data)
    Alert.alert('Éxito', 'Movimiento editado exitosamente.')
    router.back()
  }

  // El movimiento podría no encontrarse si el store aún está cargando
  if (!transaction) return null

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {error && (
        <View className="mx-5 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}
      <TransactionForm
        initialData={transaction}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  )
}
