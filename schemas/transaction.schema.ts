// Zod genera los tipos TypeScript a partir del schema.
// El monto se maneja como string en el formulario y se convierte al enviar.

import { z } from 'zod'

const dateSchema = z
  .string()
  .min(1, 'La fecha es requerida')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')

export const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, 'El monto es requerido')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      'El monto debe ser un número mayor a 0'
    )
    .refine(
      (value) => Number(value) <= 999_999_999,
      'El monto es demasiado grande'
    ),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(100, 'Máximo 100 caracteres'),
  category: z.string().min(1, 'Seleccioná una categoría'),
  date: dateSchema,
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Tipo de movimiento inválido' }),
  }),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly']).default('monthly'),
  executionDay: z.number().int().nullable().default(null),
  startDate: dateSchema,
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .nullable()
    .default(null),
}).superRefine((data, context) => {
  if (!data.isRecurring) return

  if (data.frequency === 'daily' && data.executionDay !== null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['executionDay'],
      message: 'La frecuencia diaria no requiere día de ejecución',
    })
  }

  if (data.frequency === 'weekly' && (
    data.executionDay === null || data.executionDay < 0 || data.executionDay > 6
  )) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['executionDay'],
      message: 'Seleccioná un día de la semana',
    })
  }

  if (['biweekly', 'monthly', 'yearly'].includes(data.frequency) && (
    data.executionDay === null || data.executionDay < 1 || data.executionDay > 31
  )) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['executionDay'],
      message: 'Ingresá un día entre 1 y 31',
    })
  }

  if (data.endDate !== null && data.endDate < data.startDate) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDate'],
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    })
  }
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
