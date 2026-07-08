// utils/formatters.ts
// Funciones puras de formato. Sin efectos secundarios, fáciles de testear.

import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Formatea un número como moneda en pesos argentinos.
 * Ejemplo: 1500.50 → "$ 1.500,50"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formatea una fecha ISO como texto legible en español.
 * Ejemplo: "2025-03-15" → "15 de marzo, 2025"
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return format(date, "d 'de' MMMM, yyyy", { locale: es })
  } catch {
    return dateString
  }
}

/**
 * Formatea una fecha ISO de forma corta.
 * Ejemplo: "2025-03-15" → "15/03/2025"
 */
export const formatShortDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return format(date, 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
}

/**
 * Devuelve la fecha actual en formato YYYY-MM-DD para usar como valor
 * por defecto en el campo de fecha del formulario.
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString().split('T')[0]
}
