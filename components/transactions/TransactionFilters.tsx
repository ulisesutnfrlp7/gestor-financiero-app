// components/transactions/TransactionFilters.tsx
// Barra de filtros para el historial de movimientos.
// Filtra por tipo (ingreso/gasto), categoría y rango de fechas.

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import type { TransactionType } from '@/types'
import { getCategoriesByType } from '@/constants/categories'
import { formatShortDate } from '@/utils/formatters'

export interface Filters {
  type: TransactionType | 'all'
  category: string
  dateFrom: string
  dateTo: string
}

interface TransactionFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
}) => {
  const [showDateFrom, setShowDateFrom] = useState(false)
  const [showDateTo, setShowDateTo] = useState(false)
  const categories = getCategoriesByType(filters.type === 'all' ? 'expense' : filters.type)

  const setFilter = (partial: Partial<Filters>) => {
    onChange({ ...filters, ...partial })
  }

  const handleDateFromChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowDateFrom(false)
    if (date) setFilter({ dateFrom: date.toISOString().split('T')[0] })
  }

  const handleDateToChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowDateTo(false)
    if (date) setFilter({ dateTo: date.toISOString().split('T')[0] })
  }

  const clearFilters = () => {
    onChange({ type: 'all', category: '', dateFrom: '', dateTo: '' })
  }

  const hasActiveFilters = filters.type !== 'all' || filters.category || filters.dateFrom || filters.dateTo

  return (
    <View className="px-5 pb-3">
      {/* Tipo */}
      <View className="flex-row gap-2 mb-6 mt-3">
        {(['all', 'expense', 'income'] as const).map((type) => {
          const isSelected = filters.type === type
          const label = type === 'all' ? 'Todos' : type === 'income' ? 'Ingresos' : 'Gastos'
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter({ type, category: '' })}
              className={`px-3 py-1.5 rounded-full border ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Fechas */}
      <View className="flex-row gap-2 mb-3">
        <TouchableOpacity
          onPress={() => setShowDateFrom(true)}
          className={`flex-1 flex-row items-center gap-1 px-3 py-2 rounded-lg border ${
            filters.dateFrom ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white'
          }`}
        >
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600">
            {filters.dateFrom ? formatShortDate(filters.dateFrom) : 'Desde'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowDateTo(true)}
          className={`flex-1 flex-row items-center gap-1 px-3 py-2 rounded-lg border ${
            filters.dateTo ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white'
          }`}
        >
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600">
            {filters.dateTo ? formatShortDate(filters.dateTo) : 'Hasta'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 mt-3">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setFilter({ category: '' })}
            className={`px-3 py-1.5 rounded-full border ${
              !filters.category
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                !filters.category ? 'text-white' : 'text-gray-600'
              }`}
            >
              Todas
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setFilter({ category: cat.id })}
                className={`px-3 py-1.5 rounded-full border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    isSelected ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>

      {/* Botón limpiar filtros */}
      {hasActiveFilters && (
        <TouchableOpacity onPress={clearFilters} className="mt-2 self-start">
          <Text className="text-indigo-600 text-xs font-medium">Limpiar filtros</Text>
        </TouchableOpacity>
      )}

      {/* DatePickers ocultos */}
      {showDateFrom && (
        <DateTimePicker
          value={filters.dateFrom ? new Date(filters.dateFrom + 'T00:00:00') : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateFromChange}
        />
      )}
      {showDateTo && (
        <DateTimePicker
          value={filters.dateTo ? new Date(filters.dateTo + 'T00:00:00') : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateToChange}
        />
      )}
    </View>
  )
}