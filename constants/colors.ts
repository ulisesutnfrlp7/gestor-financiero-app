// constants/colors.ts
// Paleta de colores centralizada.
// Mantenerla acá (no inline) permite cambiar el tema en un solo lugar.
// Se usa 'as const' para que TypeScript infiera los tipos literales.

export const Colors = {
  primary:        '#4F46E5', // indigo-600 — acción principal
  primaryLight:   '#EEF2FF', // indigo-50  — fondos sutiles

  income:         '#16A34A', // green-600  — ingresos
  incomeLight:    '#F0FDF4', // green-50

  expense:        '#DC2626', // red-600    — gastos
  expenseLight:   '#FEF2F2', // red-50

  background:     '#F9FAFB', // gray-50    — fondo de pantallas
  surface:        '#FFFFFF', // blanco     — tarjetas / modales

  textPrimary:    '#111827', // gray-900
  textSecondary:  '#6B7280', // gray-500
  textMuted:      '#9CA3AF', // gray-400

  border:         '#E5E7EB', // gray-200
  divider:        '#F3F4F6', // gray-100
} as const

export type ColorKey = keyof typeof Colors
