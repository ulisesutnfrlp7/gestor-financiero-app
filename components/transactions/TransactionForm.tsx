// components/transactions/TransactionForm.tsx
// Formulario compartido para crear y editar movimientos.
//
// Decisiones de implementación:
// - React Hook Form con zodResolver: validación en el submit, no en cada keystroke
// - Al cambiar el 'tipo' (ingreso/gasto), se resetea la categoría porque
//   las categorías son distintas por tipo
// - 'amount' se trata como string en el form y se convierte a número en onSubmit
// - La fecha usa un DatePicker nativo (@react-native-community/datetimepicker)

import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  transactionSchema,
  type TransactionFormValues,
} from '@/schemas/transaction.schema'
import type { Transaction, TransactionFormData, TransactionType } from '@/types'
import { useFinanceStore, selectAllCategories } from '@/store/useFinanceStore'
import { Button } from '@/components/ui/Button'
import { getCurrentDateISO, formatShortDate } from '@/utils/formatters'

interface TransactionFormProps {
  initialData?: Transaction
  onSubmit: (data: TransactionFormData) => Promise<void>
  onCancel?: () => void
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount:      initialData?.amount ? String(initialData.amount) : '',
      description: initialData?.description ?? '',
      category:    initialData?.category ?? '',
      date:        initialData?.date
        ? initialData.date.split('T')[0]
        : getCurrentDateISO(),
      type:        initialData?.type ?? 'expense',
    },
  })

  const selectedType = watch('type')
  const allCategories = useFinanceStore(selectAllCategories)
  const categories = useMemo(
    () => allCategories.filter((c) => c.type === selectedType),
    [allCategories, selectedType]
  )

  const handleTypeChange = (type: TransactionType) => {
    setValue('type', type, { shouldValidate: false })
    setValue('category', '', { shouldValidate: false })
  }

  const onFormSubmit = async (data: TransactionFormValues) => {
    await onSubmit({
      amount:      parseFloat(data.amount),
      description: data.description,
      category:    data.category,
      date:        data.date,
      type:        data.type,
    })
  }

  const hasChanges = () => {
    const amount = watch('amount')
    const description = watch('description')
    const category = watch('category')
    return amount !== '' || description !== '' || category !== ''
  }

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert(
        '¿Estás seguro?',
        'Perderás el progreso del movimiento.',
        [
          { text: 'Seguir editando', style: 'cancel' },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: () => onCancel?.(),
          },
        ]
      )
    } else {
      onCancel?.()
    }
  }

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0]
      setValue('date', formatted, { shouldValidate: true })
    }
  }

  const openDatePicker = () => {
    setShowDatePicker(true)
  }

  // Convertir string YYYY-MM-DD a Date para el picker
  const dateValue = (() => {
    const d = watch('date')
    if (!d) return new Date()
    const parts = d.split('-')
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  })()

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="px-5 pt-6 gap-5">

        {/* ── Tipo: Ingreso / Gasto ── */}
        <View>
          <Text className="text-gray-700 font-medium mb-2">Tipo</Text>
          <View className="flex-row gap-3">
            {(['expense', 'income'] as TransactionType[]).map((type) => {
              const isSelected = selectedType === type
              const activeClass = type === 'income'
                ? 'bg-green-600 border-green-600'
                : 'bg-red-600 border-red-600'
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleTypeChange(type)}
                  className={`flex-1 py-3 rounded-xl items-center border ${
                    isSelected ? activeClass : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`font-semibold text-base ${
                      isSelected ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {type === 'income' ? 'Ingreso' : 'Gasto'}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* ── Monto ── */}
        <View>
          <Text className="text-gray-700 font-medium mb-2">Monto ($)</Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`bg-white border rounded-xl px-4 py-3 text-gray-900 text-lg ${
                  errors.amount ? 'border-red-400' : 'border-gray-200'
                }`}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.amount && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.amount.message}
            </Text>
          )}
        </View>

        {/* ── Descripción ── */}
        <View>
          <Text className="text-gray-700 font-medium mb-2">Descripción</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${
                  errors.description ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="Ej: Almuerzo en restaurante"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                maxLength={100}
              />
            )}
          />
          {errors.description && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </Text>
          )}
        </View>

        {/* ── Fecha (DatePicker nativo) ── */}
        <View>
          <Text className="text-gray-700 font-medium mb-2">Fecha</Text>
          <TouchableOpacity
            onPress={openDatePicker}
            className={`bg-white border rounded-xl px-4 py-3.5 ${
              errors.date ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <Text className="text-gray-900 text-base">
              {formatShortDate(watch('date'))}
            </Text>
          </TouchableOpacity>
          {errors.date && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.date.message}
            </Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={dateValue}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* ── Categoría ── */}
        <View>
          <Text className="text-gray-700 font-medium mb-3">Categoría</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { value, onChange } }) => (
              <View className="flex-row flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = value === cat.id
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => onChange(cat.id)}
                      className={`px-3 py-2 rounded-lg border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          />
          {errors.category && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </Text>
          )}
        </View>

        {/* ── Botones ── */}
        <View className="gap-3 mt-2">
          <Button
            title={initialData ? 'Guardar Cambios' : 'Registrar Movimiento'}
            onPress={handleSubmit(onFormSubmit)}
            loading={isSubmitting}
          />
          {onCancel && (
            <Button
              title="Cancelar"
              onPress={handleCancel}
              variant="danger"
              disabled={isSubmitting}
            />
          )}
        </View>

      </View>
    </ScrollView>
  )
}