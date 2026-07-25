// Edición de una plantilla recurrente reutilizando el formulario de movimientos.

import React from 'react'
import { Alert, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { updateRecurringTemplate } from '@/services/recurring.service'
import { useFinanceStore } from '@/store/useFinanceStore'
import type { RecurringFormData, TransactionFormData } from '@/types'
import { isOnline } from '@/utils/network'

export default function EditRecurringScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const error = useFinanceStore((state) => state.error)
  const template = useFinanceStore((state) =>
    state.recurringTemplates.find((item) => item.id === id)
  )

  const handleSubmit = async (
    data: TransactionFormData & { recurring?: RecurringFormData }
  ) => {
    if (!id || !data.recurring) return

    const online = await isOnline()
    if (!online) {
      Alert.alert('Sin conexión', 'Sin conexión a Internet. Verificá tu conexión.')
      return
    }

    await updateRecurringTemplate(id, data.recurring)
    Alert.alert('Éxito', 'Plantilla recurrente actualizada exitosamente.')
    router.back()
  }

  if (!template) return null

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {error && (
        <View className="mx-5 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}
      <TransactionForm
        recurringTemplate={template}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  )
}
