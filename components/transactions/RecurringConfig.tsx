// Configuración adicional que convierte un movimiento en una plantilla recurrente.

import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { format } from 'date-fns'
import type { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import type { RecurringFrequency } from '@/types'
import type { TransactionFormValues } from '@/schemas/transaction.schema'
import { DateField } from '@/components/ui/DateField'

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
  if (!year || !month || !day) return new Date()
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

  const handleStartDateChange = (value: string) => {
    setValue('startDate', value, { shouldValidate: true })
    if (frequency === 'weekly') {
      setValue('executionDay', getWeekday(value), { shouldValidate: true })
    } else if (frequency !== 'daily') {
      setValue('executionDay', getDayOfMonth(value), { shouldValidate: true })
    }
  }

  const handleEndDateChange = (value: string) => {
    setValue('endDate', value, { shouldValidate: true })
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
            <DateField
              value={startDate}
              onChange={handleStartDateChange}
              error={Boolean(errors.startDate)}
            />
            {errors.startDate && <Text className="text-red-500 text-xs mt-1">{errors.startDate.message}</Text>}
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Fecha de Fin (opcional)</Text>
            {endDate === null ? (
              <TouchableOpacity
                onPress={() => {
                  setValue('endDate', startDate, { shouldValidate: true })
                }}
                className="bg-white border border-dashed border-indigo-200 rounded-xl px-4 py-3"
              >
                <Text className="text-indigo-600 font-medium">Agregar fecha de fin</Text>
              </TouchableOpacity>
            ) : (
              <>
                <DateField
                  value={endDate}
                  onChange={handleEndDateChange}
                  minimumDate={startDate}
                  error={Boolean(errors.endDate)}
                />
                <TouchableOpacity
                  onPress={() => setValue('endDate', null, { shouldValidate: true })}
                  className="mt-2 self-start"
                >
                  <Text className="text-red-600 font-medium text-sm">Quitar fecha de fin</Text>
                </TouchableOpacity>
              </>
            )}
            {errors.endDate && <Text className="text-red-500 text-xs mt-1">{errors.endDate.message}</Text>}
          </View>
        </>
      )}
    </View>
  )
}