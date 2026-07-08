// types/index.ts
// Definiciones de tipos centrales de la aplicación.
// Usando 'type' para tipos simples e 'interface' para objetos con estructura.

export type TransactionType = 'income' | 'expense'

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

export interface DashboardSummary {
  balance: number
  totalIncome: number
  totalExpenses: number
  transactionCount: number
}
