// components/dashboard/SummaryItem.tsx
// Tarjeta compacta para ingresos o gastos en el dashboard.

import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatCurrency } from '@/utils/formatters'
import type { TransactionType } from '@/types'

interface SummaryItemProps {
  label: string
  amount: number
  type: TransactionType
  className?: string
}

export const SummaryItem: React.FC<SummaryItemProps> = ({
  label,
  amount,
  type,
  className = '',
}) => {
  const isIncome = type === 'income'

  return (
    <View
      className={`bg-white rounded-xl p-4 border border-gray-100 ${className}`}
    >
      <View className="flex-row items-center gap-2 mb-3">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            isIncome ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Ionicons
            name={isIncome ? 'arrow-up' : 'arrow-down'}
            size={15}
            color={isIncome ? '#16A34A' : '#DC2626'}
          />
        </View>
        <Text className="text-gray-500 text-sm">{label}</Text>
      </View>
      <Text
        className={`text-lg font-bold ${
          isIncome ? 'text-green-600' : 'text-red-600'
        }`}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatCurrency(amount)}
      </Text>
    </View>
  )
}
