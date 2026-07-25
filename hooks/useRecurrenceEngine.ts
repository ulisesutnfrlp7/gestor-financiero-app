// Ejecuta en el cliente las plantillas cuya fecha de ejecución ya llegó.

import { useEffect, useRef } from 'react'
import { Alert } from 'react-native'
import { executeDueRecurringTemplate } from '@/services/recurring.service'
import { useFinanceStore } from '@/store/useFinanceStore'
import { getCurrentDateISO } from '@/utils/formatters'

export const useRecurrenceEngine = (): void => {
  const userId = useFinanceStore((state) => state.userId)
  const templates = useFinanceStore((state) => state.recurringTemplates)
  const runningTemplateIds = useRef(new Set<string>())

  useEffect(() => {
    if (!userId || templates.length === 0) return

    const today = getCurrentDateISO()
    const dueTemplates = templates.filter((template) =>
      template.isActive &&
      template.nextExecutionDate <= today &&
      (template.endDate === null || template.endDate >= today)
    )
    if (dueTemplates.length === 0) return

    let cancelled = false

    const run = async () => {
      let generatedCount = 0

      for (const template of dueTemplates) {
        if (runningTemplateIds.current.has(template.id)) continue

        runningTemplateIds.current.add(template.id)
        try {
          if (await executeDueRecurringTemplate(template.id, userId, today)) {
            generatedCount += 1
          }
        } catch {
          // El listener seguirá intentando en una próxima actualización cuando
          // la conexión esté disponible; no interrumpimos las demás plantillas.
        } finally {
          runningTemplateIds.current.delete(template.id)
        }
      }

      if (!cancelled && generatedCount > 0) {
        Alert.alert(
          'Movimientos recurrentes',
          `${generatedCount} movimiento${generatedCount === 1 ? '' : 's'} generado${generatedCount === 1 ? '' : 's'} automáticamente.`
        )
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [templates, userId])
}
