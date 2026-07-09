// components/transactions/TransactionList.tsx
// Lista virtualizada de movimientos.
//
// Se usa FlatList en lugar de ScrollView + map porque FlatList solo renderiza
// los ítems visibles en pantalla (virtualización), lo cual es fundamental
// cuando la lista crece. Con ScrollView se renderizan TODOS los elementos.

import React, { useCallback } from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'
import type { Transaction } from '@/types'
import { TransactionItem } from './TransactionItem'
import { EmptyState } from '@/components/ui/EmptyState'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
  onItemPress: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  refreshing?: boolean
  onRefresh?: () => void
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  onItemPress,
  onEdit,
  onDelete,
  refreshing = false,
  onRefresh,
}) => {
  // useCallback evita que renderItem se recree en cada render del padre
  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem
        transaction={item}
        onPress={() => onItemPress(item.id)}
        onEdit={onEdit ? () => onEdit(item.id) : undefined}
        onDelete={onDelete ? () => onDelete(item.id) : undefined}
      />
    ),
    [onItemPress, onEdit, onDelete]
  )

  const keyExtractor = useCallback((item: Transaction) => item.id, [])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    )
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={transactions.length === 0 ? { flex: 1 } : undefined}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        <EmptyState
          icon="receipt-outline"
          title="Sin movimientos"
          subtitle={'Registrá tu primer movimiento\ntocando el botón +'}
        />
      }
    />
  )
}