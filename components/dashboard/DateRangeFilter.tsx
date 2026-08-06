// components/dashboard/DateRangeFilter.tsx
// Selector de rango de fechas para filtrar el Dashboard.
// Usa DateField (cross-platform: picker nativo en RN, <input type="date"> en web).
// Valida que la fecha "Hasta" no sea anterior a "Desde".

import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { DateField } from '@/components/ui/DateField'

interface DateRangeFilterProps {
  dateFrom: string
  dateTo: string
  onChange: (dateFrom: string, dateTo: string) => void
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateFrom,
  dateTo,
  onChange,
}) => {
  const [error, setError] = useState('')

  const handleDateFromChange = (value: string) => {
    if (dateTo && value > dateTo) {
      setError('La fecha "Desde" no puede ser posterior a la fecha "Hasta"')
      return
    }
    setError('')
    onChange(value, dateTo)
  }

  const handleDateToChange = (value: string) => {
    if (dateFrom && value < dateFrom) {
      setError('La fecha "Hasta" no puede ser anterior a la fecha "Desde"')
      return
    }
    setError('')
    onChange(dateFrom, value)
  }

  const clearFilter = () => {
    setError('')
    onChange('', '')
  }

  const hasFilter = dateFrom !== '' || dateTo !== ''

  return (
    <View className="px-5 mt-3">
      <View className="flex-row gap-2">
        {/* Desde */}
        <View className="flex-1">
          <DateField
            value={dateFrom}
            onChange={handleDateFromChange}
            className="h-11 justify-center px-3 py-2.5 rounded-lg border border-indigo-500 bg-white"
            textClassName="text-sm text-gray-600"
            placeholder="Seleccionar fecha"
          />
        </View>

        {/* Hasta */}
        <View className="flex-1">
          <DateField
            value={dateTo}
            onChange={handleDateToChange}
            className="h-11 justify-center px-3 py-2.5 rounded-lg border border-indigo-500 bg-white"
            textClassName="text-sm text-gray-600"
            placeholder="Seleccionar fecha"
          />
        </View>

        {/* Limpiar */}
        {hasFilter && (
          <TouchableOpacity
            onPress={clearFilter}
            className="px-3 py-2.5 rounded-lg bg-gray-100 items-center justify-center"
          >
            <Ionicons name="close-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Mensaje de error */}
      {error && (
        <View className="mt-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <Text className="text-red-600 text-xs text-center">{error}</Text>
        </View>
      )}
    </View>
  )
}