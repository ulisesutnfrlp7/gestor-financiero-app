// components/dashboard/CategoryChart.tsx
// Gráfico de pastel genérico que muestra la distribución por categoría
// para un tipo de movimiento (income o expense).

import React, { useMemo } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import type { Transaction, TransactionType } from '@/types'
import { useFinanceStore, selectAllCategories } from '@/store/useFinanceStore'

interface ChartDataItem {
  name: string
  amount: number
  color: string
  legendFontColor: string
  legendFontSize: number
}

interface CategoryChartProps {
  transactions: Transaction[]
  type: TransactionType
}

export const CategoryChart: React.FC<CategoryChartProps> = ({
  transactions,
  type,
}) => {
  const screenWidth = Dimensions.get('window').width
  const isExpense = type === 'expense'
  const title = isExpense ? 'Gastos por Categoría' : 'Ingresos por Categoría'
  const totalColor = isExpense ? 'text-red-600' : 'text-green-600'
  const allCategories = useFinanceStore(selectAllCategories)

  const chartData: ChartDataItem[] = useMemo(() => {
    const filtered = transactions.filter((t) => t.type === type)
    if (filtered.length === 0) return []

    const grouped: Record<string, number> = {}
    filtered.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount
    })

    // Obtener las categorías ordenadas para asignar colores consistentes
    const categoryIds = Object.keys(grouped).sort()

    return categoryIds
      .map((categoryId) => {
        const category = allCategories.find((c) => c.id === categoryId)
        return {
          name: category?.label ?? categoryId,
          amount: grouped[categoryId],
          color: category?.color ?? '#9CA3AF',
          legendFontColor: '#6B7280',
          legendFontSize: 12,
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [transactions, type, allCategories])

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.amount, 0),
    [chartData]
  )

  if (chartData.length === 0) return null

  const chartWidth = screenWidth - 40
  const chartHeight = chartWidth * 0.65

  return (
    <View className="mx-5 mt-3 bg-white rounded-xl p-4 border border-gray-100">
      <Text className="text-gray-900 font-semibold text-base mb-3">
        {title}
      </Text>

      <View className="items-center">
        <PieChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute={false}
        />
      </View>

      <View className="mt-2 flex-row items-center justify-center gap-1">
        <Text className="text-gray-500 text-sm">Total:</Text>
        <Text className={`font-semibold text-sm ${totalColor}`}>
          {Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
          }).format(total)}
        </Text>
      </View>
    </View>
  )
}