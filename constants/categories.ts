// constants/categories.ts
// Categorías fijas del MVP.
// Al ser constantes (no vienen de la DB), se definen acá para tipado estático
// y para poder referenciarlas en la UI sin queries adicionales.

import { TransactionType } from '@/types'

export interface Category {
  id: string
  label: string
  type: TransactionType
  icon: string // nombre del ícono de @expo/vector-icons (Ionicons)
}

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary',    label: 'Sueldo',    type: 'income', icon: 'briefcase-outline' },
  { id: 'freelance', label: 'Freelance', type: 'income', icon: 'laptop-outline' },
  { id: 'sale',      label: 'Venta',     type: 'income', icon: 'pricetag-outline' },
]

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food',          label: 'Comida',          type: 'expense', icon: 'restaurant-outline' },
  { id: 'transport',     label: 'Transporte',      type: 'expense', icon: 'car-outline' },
  { id: 'health',        label: 'Salud',           type: 'expense', icon: 'medkit-outline' },
  { id: 'education',     label: 'Educación',       type: 'expense', icon: 'school-outline' },
  { id: 'services',      label: 'Servicios',       type: 'expense', icon: 'flash-outline' },
  { id: 'entertainment', label: 'Entretenimiento', type: 'expense', icon: 'game-controller-outline' },
  { id: 'others',        label: 'Otros',           type: 'expense', icon: 'ellipsis-horizontal-outline' },
]

export const ALL_CATEGORIES: Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
]

export const getCategoriesByType = (type: TransactionType): Category[] =>
  type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

export const getCategoryById = (id: string): Category | undefined =>
  ALL_CATEGORIES.find((cat) => cat.id === id)
