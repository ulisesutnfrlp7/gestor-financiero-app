// components/dashboard/BalanceCard.tsx
// Tarjeta principal del dashboard. Muestra el balance neto (ingresos - gastos).
// El color del monto cambia si el balance es negativo como señal visual clara.

import React from 'react'
import { View, Text } from 'react-native'
import { formatCurrency } from '@/utils/formatters'

interface BalanceCardProps {
  balance: number
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const isNegative = balance < 0

  return (
    <View className="bg-indigo-600 rounded-2xl p-6">
      <Text className="text-indigo-200 text-sm font-medium tracking-wide uppercase">
        Balance actual
      </Text>
      <Text
        className={`text-4xl font-bold mt-3 ${
          isNegative ? 'text-red-300' : 'text-white'
        }`}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatCurrency(balance)}
      </Text>
      {isNegative && (
        <Text className="text-red-300 text-xs mt-2">
          ⚠ Tu balance es negativo
        </Text>
      )}
    </View>
  )
}
