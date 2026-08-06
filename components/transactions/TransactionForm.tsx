// components/transactions/TransactionForm.tsx
// Formulario compartido para crear y editar movimientos.
//
// Decisiones de implementación:
// - React Hook Form con zodResolver: validación en el submit, no en cada keystroke
// - Al cambiar el 'tipo' (ingreso/gasto), se resetea la categoría porque
//   las categorías son distintas por tipo
// - 'amount' se trata como string en el form y se convierte a número en onSubmit
// - La fecha usa DateField (cross-platform): picker nativo en RN, <input type="date"> en web
// - El comprobante (foto) usa ImagePicker en nativo y <input type="file"> en web

import React, { useState, useMemo, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  transactionSchema,
  type TransactionFormValues,
} from '@/schemas/transaction.schema'
import type {
  RecurringFormData,
  RecurringTemplate,
  Transaction,
  TransactionFormData,
  TransactionType,
} from '@/types'
import { useFinanceStore, selectAllCategories } from '@/store/useFinanceStore'
import { Button } from '@/components/ui/Button'
import { DateField } from '@/components/ui/DateField'
import { ReceiptViewer } from '@/components/ui/ReceiptViewer'
import { getCurrentDateISO } from '@/utils/formatters'
import { RecurringConfig } from './RecurringConfig'
import { Ionicons } from '@expo/vector-icons'
import { showConfirm, showDialog, showMessage } from '@/utils/dialog'

const IS_WEB = Platform.OS === 'web'

interface TransactionFormProps {
  initialData?: Transaction
  recurringTemplate?: RecurringTemplate
  onSubmit: (data: TransactionFormData & { recurring?: RecurringFormData }) => Promise<void>
  onCancel?: () => void
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  recurringTemplate,
  onSubmit,
  onCancel,
}) => {
  const defaultDate = initialData?.date
    ? initialData.date.split('T')[0]
    : recurringTemplate?.startDate ?? getCurrentDateISO()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount:       initialData?.amount
        ? String(initialData.amount)
        : recurringTemplate?.amount ? String(recurringTemplate.amount) : '',
      description:  initialData?.description ?? recurringTemplate?.description ?? '',
      category:     initialData?.category ?? recurringTemplate?.category ?? '',
      date:         defaultDate,
      type:         initialData?.type ?? recurringTemplate?.type ?? 'expense',
      isRecurring:  Boolean(recurringTemplate),
      frequency:    recurringTemplate?.frequency ?? 'monthly',
      executionDay: recurringTemplate?.executionDay ?? null,
      startDate:    recurringTemplate?.startDate ?? defaultDate,
      endDate:      recurringTemplate?.endDate ?? null,
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
    if (recurringTemplate && !data.isRecurring) {
      showMessage(
        'Movimiento Recurrente',
        'No podés hacer que un movimiento recurrente vuelva a ser de una vez. Creá el movimiento de manera natural a través del formulario de creación.'
      )
    }

    const transactionData: TransactionFormData = {
      amount:      parseFloat(data.amount),
      description: data.description,
      category:    data.category,
      date:        data.date,
      type:        data.type,
      receiptUri,
    }

    await onSubmit(data.isRecurring
      ? {
          ...transactionData,
          recurring: {
            amount: transactionData.amount,
            description: transactionData.description,
            category: transactionData.category,
            type: transactionData.type,
            frequency: data.frequency,
            executionDay: data.executionDay,
            startDate: data.startDate,
            endDate: data.endDate,
          },
        }
      : transactionData)
  }

  const hasChanges = () => {
    const amount = watch('amount')
    const description = watch('description')
    const category = watch('category')
    return amount !== '' || description !== '' || category !== ''
  }

  const handleCancel = () => {
    if (hasChanges()) {
      showConfirm(
        '¿Estás seguro?',
        'Perderás el progreso del movimiento.',
        () => onCancel?.(),
        'Salir',
        'Seguir editando',
        true
      )
    } else {
      onCancel?.()
    }
  }

  // ─── Comprobante (foto) ─────────────────────────────────────────────────
  const [receiptUri, setReceiptUri] = useState<string | null>(
    initialData?.receiptUrl ?? null
  )
  const [isReceiptFullscreen, setIsReceiptFullscreen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Web: <input type="file"> → leer como data URI
  const handleWebFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setReceiptUri(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const pickReceiptFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      showMessage('Permiso requerido', 'Necesitamos acceso a la cámara para tomar la foto.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri)
    }
  }

  const pickReceiptFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      showMessage('Permiso requerido', 'Necesitamos acceso a la galería para seleccionar la foto.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri)
    }
  }

  const handlePickReceipt = () => {
    if (IS_WEB) {
      fileInputRef.current?.click()
      return
    }
    showDialog('Comprobante', 'Seleccioná una opción', [
      { text: '📷 Cámara', onPress: pickReceiptFromCamera },
      { text: '🖼️ Galería', onPress: pickReceiptFromGallery },
      { text: '    Cancelar', style: 'cancel' },
    ])
  }

  const handleRemoveReceipt = () => {
    setReceiptUri(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
                  errors.amount ? 'border-red-400' : 'border-indigo-500'
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
                  errors.description ? 'border-red-400' : 'border-indigo-500'
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

        {/* ── Fecha (DateField cross-platform) ── */}
        <View>
          <Text className="text-gray-700 font-medium mb-2">Fecha</Text>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DateField
                value={value}
                onChange={onChange}
                error={Boolean(errors.date)}
              />
            )}
          />
          {errors.date && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.date.message}
            </Text>
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

        {/* ── Comprobante (foto) ── */}
        <View>
          <Text className="text-gray-700 font-medium mb-2">Comprobante</Text>
          {receiptUri ? (
            <View className="relative">
              <TouchableOpacity
                onPress={() => setIsReceiptFullscreen(true)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: receiptUri }}
                  className="w-full h-72 rounded-xl"
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemoveReceipt}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handlePickReceipt}
              className="bg-white border border-dashed border-gray-300 rounded-xl py-8 items-center justify-center"
            >
              <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-gray-500 text-sm mt-2 px-4 text-center"
              >
                Agregar Comprobante
              </Text>
            </TouchableOpacity>
          )}

          {/* Input file oculto para web */}
          {IS_WEB && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleWebFile(e.target.files?.[0])}
            />
          )}
        </View>

        {!initialData && (
          <RecurringConfig watch={watch} setValue={setValue} errors={errors} />
        )}

        {/* ── Botones ── */}
        <View className="gap-3 mt-2">
          <Button
            title={initialData
              ? 'Guardar Cambios'
              : recurringTemplate ? 'Guardar Plantilla' : 'Registrar Movimiento'}
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

      {/* Visor de comprobante a pantalla completa */}
      {receiptUri && (
        <ReceiptViewer
          visible={isReceiptFullscreen}
          uri={receiptUri}
          onClose={() => setIsReceiptFullscreen(false)}
        />
      )}
    </ScrollView>
  )
}
