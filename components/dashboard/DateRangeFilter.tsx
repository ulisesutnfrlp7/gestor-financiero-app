// components/dashboard/DateRangeFilter.tsx
// Selector de rango de fechas para filtrar el Dashboard.
// Usa DateTimePicker nativo.
// Valida que la fecha "Hasta" no sea anterior a "Desde".

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { formatShortDate } from '@/utils/formatters'

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
  const [showDateFrom, setShowDateFrom] = useState(false)
  const [showDateTo, setShowDateTo] = useState(false)
  const [error, setError] = useState('')

  const handleDateFromChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowDateFrom(false)
    if (!date) return

    const newDateFrom = date.toISOString().split('T')[0]

    // Validar que "Desde" no sea posterior a "Hasta"
    if (dateTo && newDateFrom > dateTo) {
      setError('La fecha "Desde" no puede ser posterior a la fecha "Hasta"')
      return
    }

    setError('')
    onChange(newDateFrom, dateTo)
  }

  const handleDateToChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowDateTo(false)
    if (!date) return

    const newDateTo = date.toISOString().split('T')[0]

    // Validar que "Hasta" no sea anterior a "Desde"
    if (dateFrom && newDateTo < dateFrom) {
      setError('La fecha "Hasta" no puede ser anterior a la fecha "Desde"')
      return
    }

    setError('')
    onChange(dateFrom, newDateTo)
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
        <TouchableOpacity
          onPress={() => {
            setError('')
            setShowDateFrom(true)
          }}
          className={`flex-1 flex-row items-center gap-1.5 px-3 py-2.5 rounded-lg border ${
            dateFrom ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white'
          }`}
        >
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600">
            {dateFrom ? formatShortDate(dateFrom) : 'Desde'}
          </Text>
        </TouchableOpacity>

        {/* Hasta */}
        <TouchableOpacity
          onPress={() => {
            setError('')
            setShowDateTo(true)
          }}
          className={`flex-1 flex-row items-center gap-1.5 px-3 py-2.5 rounded-lg border ${
            error ? 'border-red-400 bg-white' : dateTo ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white'
          }`}
        >
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600">
            {dateTo ? formatShortDate(dateTo) : 'Hasta'}
          </Text>
        </TouchableOpacity>

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

      {/* DatePickers */}
      {showDateFrom && (
        <DateTimePicker
          value={dateFrom ? new Date(dateFrom + 'T00:00:00') : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateFromChange}
        />
      )}
      {showDateTo && (
        <DateTimePicker
          value={dateTo ? new Date(dateTo + 'T00:00:00') : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateToChange}
        />
      )}
    </View>
  )
}