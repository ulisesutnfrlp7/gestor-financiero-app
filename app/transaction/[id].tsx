// app/transaction/[id].tsx
// Modal para editar o eliminar un movimiento existente.
//
// useLocalSearchParams() extrae el parámetro dinámico [id] de la URL.
// El movimiento se busca en el store local (ya cargado) en lugar de hacer
// una query adicional a Firestore — principio de "single source of truth".

import React from 'react'
import { Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useFinanceStore } from '@/store/useFinanceStore'
import {
  updateTransaction,
  deleteTransaction,
} from '@/services/transactions.service'
import type { TransactionFormData } from '@/types'

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  // Buscar el movimiento directamente en el store sin nueva query a Firestore
  const transaction = useFinanceStore((state) =>
    state.transactions.find((t) => t.id === id)
  )

  const handleSubmit = async (data: TransactionFormData) => {
    if (!id) return
    await updateTransaction(id, data)
    Alert.alert('Éxito', 'Movimiento editado exitosamente.')
    router.back()
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Movimiento',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (!id) return
            await deleteTransaction(id)
            Alert.alert('Éxito', 'Movimiento eliminado exitosamente.')
            router.back()
          },
        },
      ]
    )
  }

  // El movimiento podría no encontrarse si el store aún está cargando
  if (!transaction) return null

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <TransactionForm
        initialData={transaction}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  )
}
