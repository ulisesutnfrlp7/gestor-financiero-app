// Cálculos puros para las fechas de las plantillas recurrentes.

import {
  addDays,
  addMonths,
  addYears,
  format,
  isValid,
  lastDayOfMonth,
  parseISO,
  setDate,
} from 'date-fns'
import type { RecurringTemplate } from '@/types'

const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd')

/**
 * Devuelve la siguiente fecha de ejecución a partir de una ejecución ya realizada.
 * Para periodicidades mensual y anual preserva el día configurado y lo limita al
 * último día disponible del mes de destino (por ejemplo, 31 -> 30/28/29).
 */
export const calculateNextExecutionDate = (
  currentDate: string,
  template: RecurringTemplate
): string => {
  const current = parseISO(currentDate)
  if (!isValid(current)) {
    throw new Error(`Fecha de ejecución inválida: ${currentDate}`)
  }

  switch (template.frequency) {
    case 'daily':
      return formatDate(addDays(current, 1))
    case 'weekly':
      return formatDate(addDays(current, 7))
    case 'biweekly':
      return formatDate(addDays(current, 14))
    case 'monthly': {
      const nextMonth = addMonths(current, 1)
      const desiredDay = template.executionDay ?? current.getDate()
      const day = Math.min(desiredDay, lastDayOfMonth(nextMonth).getDate())
      return formatDate(setDate(nextMonth, day))
    }
    case 'yearly': {
      const nextYear = addYears(current, 1)
      const desiredDay = template.executionDay ?? current.getDate()
      const day = Math.min(desiredDay, lastDayOfMonth(nextYear).getDate())
      return formatDate(setDate(nextYear, day))
    }
  }
}
