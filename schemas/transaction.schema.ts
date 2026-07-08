// schemas/transaction.schema.ts
// Zod genera los tipos TypeScript a partir del schema (z.infer<>).
// Esto elimina la duplicación: el schema ES la fuente de verdad del tipo.
//
// Decisión de diseño: 'amount' se valida como string en el formulario
// y se parsea a número en el submit handler. Esto es más predecible
// con TextInput de React Native que z.coerce.number().

import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, 'El monto es requerido')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'El monto debe ser un número mayor a 0'
    )
    .refine(
      (val) => Number(val) <= 999_999_999,
      'El monto es demasiado grande'
    ),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(100, 'Máximo 100 caracteres'),
  category: z.string().min(1, 'Seleccioná una categoría'),
  date: z
    .string()
    .min(1, 'La fecha es requerida')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Tipo de movimiento inválido' }),
  }),
})

// El tipo se infiere directamente del schema — nunca lo escribas a mano
export type TransactionFormValues = z.infer<typeof transactionSchema>
