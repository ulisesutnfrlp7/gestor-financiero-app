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

/**
 * Paleta de 20 colores para gráficos de torta.
 * Se asignan por índice (posición de la categoría en la lista),
 * no por ID, para que cualquier categoría nueva reciba un color único.
 */
export const CHART_COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6',
  '#A855F7', '#EC4899', '#14B8A6', '#F43F5E', '#8B5CF6',
  '#0EA5E9', '#84CC16', '#D946EF', '#10B981', '#F59E0B',
  '#6366F1', '#06B6D4', '#F472B6', '#34D399', '#FB923C',
]
