// Gestión de las plantillas que generan movimientos de forma automática.

import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, type Href } from 'expo-router'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  deleteRecurringTemplate,
  fetchRecurringTemplates,
  updateRecurringTemplate,
} from '@/services/recurring.service'
import { useFinanceStore } from '@/store/useFinanceStore'
import type { RecurringFrequency, RecurringTemplate } from '@/types'
import { formatCurrency, formatShortDate } from '@/utils/formatters'
import { isOnline } from '@/utils/network'

const frequencyLabels: Record<RecurringFrequency, string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  yearly: 'Anual',
}

export default function RecurringScreen() {
  const templates = useFinanceStore((state) => state.recurringTemplates)
  const userId = useFinanceStore((state) => state.userId)
  const isLoading = useFinanceStore((state) => state.isLoading)
  const error = useFinanceStore((state) => state.error)
  const setRecurringTemplates = useFinanceStore((state) => state.setRecurringTemplates)
  const [refreshing, setRefreshing] = useState(false)

  const ensureOnline = async (): Promise<boolean> => {
    const online = await isOnline()
    if (!online) {
      Alert.alert('Sin conexión', 'Sin conexión a Internet. Verificá tu conexión.')
      return false
    }
    return true
  }

  const handleRefresh = useCallback(async () => {
    if (!userId) return
    setRefreshing(true)
    try {
      setRecurringTemplates(await fetchRecurringTemplates(userId))
    } catch {
      // El listener en tiempo real seguirá intentando actualizar la lista.
    } finally {
      setRefreshing(false)
    }
  }, [setRecurringTemplates, userId])

  const handleToggle = async (template: RecurringTemplate) => {
    if (!await ensureOnline()) return
    try {
      await updateRecurringTemplate(template.id, { isActive: !template.isActive })
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la plantilla.')
    }
  }

  const handleDelete = (template: RecurringTemplate) => {
    Alert.alert(
      'Eliminar Recurrente',
      `¿Eliminar la plantilla "${template.description}"? Los movimientos ya generados se conservarán.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (!await ensureOnline()) return
            try {
              await deleteRecurringTemplate(template.id)
            } catch {
              Alert.alert('Error', 'No se pudo eliminar la plantilla.')
            }
          },
        },
      ]
    )
  }

  const renderItem = ({ item }: { item: RecurringTemplate }) => (
    <View className="bg-white mx-5 mb-3 border border-gray-200 rounded-xl px-4 py-4">
      <View className="flex-row items-start">
        <View className="w-9 h-9 rounded-full bg-indigo-100 items-center justify-center mr-3">
          <Ionicons name="repeat" size={18} color="#4F46E5" />
        </View>
        <View className="flex-1 mr-2">
          <View className="flex-row items-center gap-2">
            <Text className="flex-1 text-gray-900 font-semibold" numberOfLines={1}>{item.description}</Text>
            <View className={`rounded-full px-2 py-1 ${item.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-semibold ${item.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                {item.isActive ? 'ACTIVO' : 'PAUSADO'}
              </Text>
            </View>
          </View>
          <Text className={`text-sm font-semibold mt-1 ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            {frequencyLabels[item.frequency]} · Próxima: {formatShortDate(item.nextExecutionDate)}
          </Text>
        </View>
      </View>

      <View className="flex-row mt-4 gap-2">
        <TouchableOpacity
          onPress={() => void handleToggle(item)}
          className="flex-1 border border-indigo-100 rounded-lg py-2.5 items-center"
        >
          <Text className="text-indigo-600 text-xs font-semibold">{item.isActive ? 'Pausar' : 'Reanudar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/recurring/${item.id}` as Href)}
          className="flex-1 border border-indigo-100 rounded-lg py-2.5 items-center"
        >
          <Text className="text-indigo-600 text-xs font-semibold">Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          className="w-10 border border-red-100 rounded-lg items-center justify-center"
          accessibilityLabel="Eliminar recurrente"
        >
          <Ionicons name="trash-outline" size={17} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-6 pb-4">
        <Text className="text-2xl font-bold text-gray-900">Movimientos Recurrentes</Text>
        <Text className="text-gray-500 text-sm mt-1">Administrá tus movimientos programados</Text>
      </View>

      {error && (
        <View className="mx-5 mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}

      {isLoading && templates.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={templates.length === 0 ? { flexGrow: 1 } : { paddingBottom: 100 }}
          ListEmptyComponent={
            <EmptyState
              icon="repeat-outline"
              title="Sin movimientos recurrentes"
              subtitle="Creá uno desde el botón + del historial."
            />
          }
        />
      )}

      <TouchableOpacity
        onPress={() => router.push('/transaction/new')}
        className="absolute bottom-8 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center"
        style={{ elevation: 6, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
        accessibilityLabel="Agregar movimiento recurrente"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
