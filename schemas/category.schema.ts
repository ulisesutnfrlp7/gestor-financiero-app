// schemas/category.schema.ts
// Esquema de validación para categorías personalizadas con Zod.
// Centraliza las reglas: nombre obligatorio, longitud máxima, tipo válido.

import { z } from 'zod'
import type { CustomCategory } from '@/types'

export const categorySchema = z.object({
  label: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(30, 'Máximo 30 caracteres'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Seleccioná un tipo válido' }),
  }),
  color: z
    .string()
    .min(1, 'Seleccioná un color'),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

/**
 * Valida los datos de una categoría incluyendo reglas de negocio:
 * - Nombre único dentro del mismo tipo
 * - Color único dentro del mismo tipo
 *
 * @param data - Datos validados por Zod
 * @param existingCategories - Todas las categorías del usuario
 * @param editingId - ID de la categoría que se está editando (opcional, para excluirse de la validación)
 * @returns { success: true } | { success: false, error: string }
 */
export const validateCategoryUniqueness = (
  data: CategoryFormValues,
  existingCategories: CustomCategory[],
  editingId?: string | null
): { success: true } | { success: false; error: string } => {
  const sameType = existingCategories.filter(
    (c) => c.type === data.type && c.id !== editingId
  )

  const duplicateLabel = sameType.find(
    (c) => c.label.toLowerCase() === data.label.toLowerCase()
  )
  if (duplicateLabel) {
    return {
      success: false,
      error: `Ya existe una categoría de ${data.type === 'income' ? 'ingreso' : 'gasto'} con el nombre "${duplicateLabel.label}"`,
    }
  }

  const duplicateColor = sameType.find((c) => c.color === data.color)
  if (duplicateColor) {
    return {
      success: false,
      error: `La categoría "${duplicateColor.label}" ya usa este color`,
    }
  }

  return { success: true }
}