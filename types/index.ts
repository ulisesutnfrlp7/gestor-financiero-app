// types/index.ts
// Definiciones de tipos centrales de la aplicación.
// Usando 'type' para tipos simples e 'interface' para objetos con estructura.

export type TransactionType = 'income' | 'expense'

export type RecurringFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly'

/**
 * Representa un movimiento financiero almacenado en Firestore.
 * Las fechas se guardan como strings ISO 8601 para evitar problemas
 * de serialización con el store de Zustand.
 */
export interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  date: string        // YYYY-MM-DD
  type: TransactionType
  userId: string
  createdAt: string   // ISO 8601
  updatedAt: string   // ISO 8601
  /** Indica que el movimiento fue generado desde una plantilla recurrente. */
  isRecurring?: boolean
}

/**
 * Datos que el usuario envía desde el formulario.
 * El 'amount' ya viene parseado a número antes de llamar al servicio.
 */
export interface TransactionFormData {
  amount: number
  description: string
  category: string
  date: string
  type: TransactionType
}

/** Plantilla que define un movimiento a generar periódicamente. */
export interface RecurringTemplate {
  id: string
  amount: number
  description: string
  category: string
  type: TransactionType
  userId: string
  frequency: RecurringFrequency
  /** null para diaria; 0-6 (lunes-domingo) para semanal; 1-31 para las demás. */
  executionDay: number | null
  startDate: string
  endDate: string | null
  isActive: boolean
  lastGeneratedDate: string | null
  nextExecutionDate: string
  createdAt: string
  updatedAt: string
}

/** Datos editables de una plantilla recurrente desde el formulario. */
export interface RecurringFormData {
  amount: number
  description: string
  category: string
  type: TransactionType
  frequency: RecurringFrequency
  executionDay: number | null
  startDate: string
  endDate: string | null
}

export interface DashboardSummary {
  balance: number
  totalIncome: number
  totalExpenses: number
  transactionCount: number
}

/**
 * Categoría personalizada creada por el usuario.
 * Se almacena en una subcolección /users/{userId}/categories/.
 */
export interface CustomCategory {
  id: string
  label: string
  type: TransactionType
  color: string
  icon: string
  userId: string
  createdAt: string
}
