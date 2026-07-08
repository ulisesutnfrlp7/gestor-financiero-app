// components/transactions/TransactionItem.tsx
// Fila de un movimiento en la lista del historial.
// Usa React.memo para evitar re-renders cuando otros items cambian.

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { Transaction } from '@/types'
import { formatCurrency, formatShortDate } from '@/utils/formatters'
import { getCategoryById } from '@/constants/categories'

interface TransactionItemProps {
  transaction: Transaction
  onPress: () => void
}

const TransactionItemComponent: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const isIncome = transaction.type === 'income'
  const category = getCategoryById(transaction.category)

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

      {/* Monto */}
      <Text
        className={`font-semibold text-sm flex-shrink-0 ${
          isIncome ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  )
}

export const TransactionItem = React.memo(TransactionItemComponent)
