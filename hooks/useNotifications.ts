// hooks/useNotifications.ts
// Hook para manejar el estado del recordatorio diario en la UI.

import { useState, useEffect, useCallback } from 'react'
import {
  configureNotifications,
  isReminderActive,
  toggleReminder,
} from '@/services/notifications.service'

export const useNotifications = () => {
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    configureNotifications()
    ;(async () => {
      const active = await isReminderActive()
      setReminderEnabled(active)
      setLoading(false)
    })()
  }, [])

  const toggle = useCallback(async (enabled: boolean): Promise<boolean> => {
    setLoading(true)
    const success = await toggleReminder(enabled)
    if (success) {
      setReminderEnabled(enabled)
    }
    setLoading(false)
    return success
  }, [])

  return { reminderEnabled, loading, toggle }
}