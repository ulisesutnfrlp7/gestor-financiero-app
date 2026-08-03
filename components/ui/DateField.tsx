// components/ui/DateField.tsx
// Campo de fecha cross-platform.
//
// - Nativo (iOS/Android): usa @react-native-community/datetimepicker (selector nativo)
// - Web: usa <input type="date"> nativo del navegador (que no soporta el picker RN)
//
// Ambos devuelven la fecha en formato YYYY-MM-DD a través de onChange.

import React from 'react'
import { Platform, TouchableOpacity, Text } from 'react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { formatShortDate } from '@/utils/formatters'

interface DateFieldProps {
  value: string
  onChange: (value: string) => void
  /** Placeholder en estado vacío (nativo y web) */
  placeholder?: string
  /** Fecha mínima permitida (YYYY-MM-DD) — opcional */
  minimumDate?: string
  /** Clases para el botón del picker nativo (no aplica en web) */
  className?: string
  /** Clases para el validador de texto del picker nativo (no aplica en web) */
  textClassName?: string
  /** Muestra un indicador de error (aplica en web) */
  error?: boolean
}

const IS_WEB = Platform.OS === 'web'

const toDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return new Date()
  return new Date(year, month - 1, day)
}

const toDateString = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`

export const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  minimumDate,
  className,
  textClassName,
  error,
}) => {
  const [showPicker, setShowPicker] = React.useState(false)

  // ─── Web: input nativo del navegador ──────────────────────────────────────
  if (IS_WEB) {
    return (
      <input
        type="date"
        value={value}
        placeholder={placeholder}
        min={minimumDate}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 text-base ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
      />
    )
  }

  // ─── Nativo: date picker de la comunidad ──────────────────────────────────
  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios')
    if (selectedDate) {
      onChange(toDateString(selectedDate))
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className={
          className ??
          `bg-white border rounded-xl px-4 py-3.5 ${
            error ? 'border-red-400' : 'border-gray-200'
          }`
        }
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={
            textClassName ??
            `text-gray-900 text-base ${error ? 'text-red-400' : ''}`
          }
        >
          {value ? formatShortDate(value) : placeholder}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={toDate(value)}
          mode="date"
          minimumDate={minimumDate ? toDate(minimumDate) : undefined}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </>
  )
}