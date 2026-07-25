// Configuración adicional que convierte un movimiento en una plantilla recurrente.

import React, { useState } from 'react'
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import type { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import type { RecurringFrequency } from '@/types'
import type { TransactionFormValues } from '@/schemas/transaction.schema'
import { formatShortDate } from '@/utils/formatters'

interface RecurringConfigProps {
  watch: UseFormWatch<TransactionFormValues>
  setValue: UseFormSetValue<TransactionFormValues>
  errors: FieldErrors<TransactionFormValues>
}

const frequencies: Array<{ value: RecurringFrequency; label: string }> = [
  { value: 'daily', label: 'Diaria' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
]

const weekdays = [
  { value: 0, label: 'Lun' },
  { value: 1, label: 'Mar' },
  { value: 2, label: 'Mié' },
  { value: 3, label: 'Jue' },
  { value: 4, label: 'Vie' },
  { value: 5, label: 'Sáb' },
  { value: 6, label: 'Dom' },
]

const toDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const toDateString = (date: Date): string => format(date, 'yyyy-MM-dd')

const getDayOfMonth = (value: string): number => toDate(value).getDate()

const getWeekday = (value: string): number => {
  const day = toDate(value).getDay()
  return day === 0 ? 6 : day - 1
}

export const RecurringConfig: React.FC<RecurringConfigProps> = ({
  watch,
  setValue,
  errors,
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)
  const isRecurring = watch('isRecurring')
  const frequency = watch('frequency')
  const executionDay = watch('executionDay')
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const setFrequency = (
    nextFrequency: RecurringFrequency,
    referenceDate = startDate || watch('date')
  ) => {
    setValue('frequency', nextFrequency, { shouldValidate: true })
    const nextExecutionDay = nextFrequency === 'daily'
      ? null
      : nextFrequency === 'weekly'
        ? getWeekday(referenceDate)
        : getDayOfMonth(referenceDate)
    setValue('executionDay', nextExecutionDay, { shouldValidate: true })
  }

  const toggleRecurring = (value: boolean) => {
    setValue('isRecurring', value, { shouldValidate: true })
    if (!value) return

    const date = watch('date')
    setValue('startDate', date, { shouldValidate: true })
    setFrequency(frequency || 'monthly', date)
  }

  const handleStartDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios')
    if (!selectedDate) return

    const value = toDateString(selectedDate)
    setValue('startDate', value, { shouldValidate: true })
    if (frequency === 'weekly') {
      setValue('executionDay', getWeekday(value), { shouldValidate: true })
    } else if (frequency !== 'daily') {
      setValue('executionDay', getDayOfMonth(value), { shouldValidate: true })
    }
  }

  const handleEndDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios')
    if (selectedDate) {
      setValue('endDate', toDateString(selectedDate), { shouldValidate: true })
    }
  }

  return (
    <View className="border border-indigo-100 bg-indigo-50 rounded-xl p-4 gap-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-gray-900 font-semibold">Hacer Recurrente</Text>
          <Text className="text-gray-500 text-xs mt-0.5">
            {isRecurring ? 'Se generará automáticamente.' : 'Registrar este movimiento una sola vez.'}
          </Text>
        </View>
        <View className="flex-row rounded-lg overflow-hidden border border-indigo-200">
          <TouchableOpacity
            onPress={() => toggleRecurring(false)}
            className={`px-3 py-2 ${!isRecurring ? 'bg-indigo-600' : 'bg-white'}`}
          >
            <Text className={`text-xs font-semibold ${!isRecurring ? 'text-white' : 'text-indigo-500'}`}>Una vez</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleRecurring(true)}
            className={`px-3 py-2 ${isRecurring ? 'bg-indigo-600' : 'bg-white'}`}
          >
            <Text className={`text-xs font-semibold ${isRecurring ? 'text-white' : 'text-indigo-600'}`}>Recurrente</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isRecurring && (
        <>
          <View>
            <Text className="text-gray-700 font-medium mb-2">Frecuencia</Text>
            <View className="flex-row flex-wrap gap-2">
              {frequencies.map((item) => {
                const selected = frequency === item.value
                return (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setFrequency(item.value)}
                    className={`px-3 py-2 rounded-lg border ${selected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-indigo-100'}`}
                  >
                    <Text className={`text-xs font-medium ${selected ? 'text-white' : 'text-gray-600'}`}>{item.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          {frequency === 'weekly' && (
            <View>
              <Text className="text-gray-700 font-medium mb-2">Día de Ejecución</Text>
              <View className="flex-row flex-wrap gap-2">
                {weekdays.map((day) => {
                  const selected = executionDay === day.value
                  return (
                    <TouchableOpacity
                      key={day.value}
                      onPress={() => setValue('executionDay', day.value, { shouldValidate: true })}
                      className={`px-3 py-2 rounded-lg border ${selected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-indigo-100'}`}
                    >
                      <Text className={`text-xs font-medium ${selected ? 'text-white' : 'text-gray-600'}`}>{day.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}

          {['biweekly', 'monthly', 'yearly'].includes(frequency) && (
            <View>
              <Text className="text-gray-700 font-medium mb-2">Día de Ejecución (1-31)</Text>
              <TextInput
                value={executionDay === null ? '' : String(executionDay)}
                onChangeText={(value) => {
                  const numberValue = Number(value)
                  setValue('executionDay', value === '' || Number.isNaN(numberValue) ? null : numberValue, {
                    shouldValidate: true,
                  })
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="Ej: 15"
                placeholderTextColor="#9CA3AF"
                className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${errors.executionDay ? 'border-red-400' : 'border-indigo-100'}`}
              />
            </View>
          )}

          {errors.executionDay && (
            <Text className="text-red-500 text-xs -mt-2">{errors.executionDay.message}</Text>
          )}

          <View>
            <Text className="text-gray-700 font-medium mb-2">Fecha de Inicio</Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className={`bg-white border rounded-xl px-4 py-3 ${errors.startDate ? 'border-red-400' : 'border-indigo-100'}`}
            >
              <Text className="text-gray-900">{formatShortDate(startDate)}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={toDate(startDate)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleStartDateChange}
              />
            )}
            {errors.startDate && <Text className="text-red-500 text-xs mt-1">{errors.startDate.message}</Text>}
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Fecha de Fin (opcional)</Text>
            {endDate === null ? (
              <TouchableOpacity
                onPress={() => {
                  setValue('endDate', startDate, { shouldValidate: true })
                  setShowEndPicker(true)
                }}
                className="bg-white border border-dashed border-indigo-200 rounded-xl px-4 py-3"
              >
                <Text className="text-indigo-600 font-medium">Agregar fecha de fin</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  className={`flex-1 bg-white border rounded-xl px-4 py-3 ${errors.endDate ? 'border-red-400' : 'border-indigo-100'}`}
                >
                  <Text className="text-gray-900">{formatShortDate(endDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setValue('endDate', null, { shouldValidate: true })}
                  className="bg-white border border-red-100 rounded-xl px-4 justify-center"
                >
                  <Text className="text-red-600 font-medium">Quitar</Text>
                </TouchableOpacity>
              </View>
            )}
            {showEndPicker && endDate !== null && (
              <DateTimePicker
                value={toDate(endDate)}
                mode="date"
                minimumDate={toDate(startDate)}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleEndDateChange}
              />
            )}
            {errors.endDate && <Text className="text-red-500 text-xs mt-1">{errors.endDate.message}</Text>}
          </View>
        </>
      )}
    </View>
  )
}
