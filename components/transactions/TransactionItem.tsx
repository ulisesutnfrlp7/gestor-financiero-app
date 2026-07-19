// components/transactions/TransactionItem.tsx
// Fila de un movimiento en la lista del historial.
// Usa React.memo para evitar re-renders cuando otros items cambian.

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { Transaction } from '@/types'
import { formatCurrency, formatShortDate } from '@/utils/formatters'
import { useFinanceStore, selectAllCategories } from '@/store/useFinanceStore'

interface TransactionItemProps {
  transaction: Transaction
  onPress: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const TransactionItemComponent: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  onEdit,
  onDelete,
}) => {
  const isIncome = transaction.type === 'income'
  const allCategories = useFinanceStore(selectAllCategories)
  const category = allCategories.find((c) => c.id === transaction.category)

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white px-4 py-3.5 border-b border-gray-50 active:bg-gray-50"
    >
      {/* Ícono de tipo */}
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 flex-shrink-0 ${
          isIncome ? 'bg-green-100' : 'bg-red-100'
        }`}
      >
        <Ionicons
          name={isIncome ? 'arrow-up' : 'arrow-down'}
          size={18}
          color={isIncome ? '#16A34A' : '#DC2626'}
        />
      </View>

      {/* Descripción y categoría */}
      <View className="flex-1 mr-3 min-w-0">
        <Text
          className="text-gray-900 font-medium text-sm"
          numberOfLines={1}
        >
          {transaction.description}
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
          {category?.label ?? transaction.category}
          {' · '}
          {formatShortDate(transaction.date)}
        </Text>
      </View>

      {/* Monto y acciones */}
      <View className="flex-row items-center flex-shrink-0 gap-2">
        <Text
          className={`font-semibold text-sm ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            className="w-8 h-8 rounded-full items-center justify-center bg-indigo-50"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil-outline" size={16} color="#4F46E5" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            className="w-8 h-8 rounded-full items-center justify-center bg-red-50"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

export const TransactionItem = React.memo(TransactionItemComponent)