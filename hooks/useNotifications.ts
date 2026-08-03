// hooks/useNotifications.ts
// Hook para manejar el estado del recordatorio diario en la UI.
// En web no aplica (expo-notifications no soporta web), por lo que
// el servicio nativo se carga de forma dinámica solo en nativo.

import { useState, useEffect, useCallback } from 'react'
import { Platform } from 'react-native'

const IS_WEB = Platform.OS === 'web'

/**
 * Carga el servicio de notificaciones solo en nativo.
 * En web devuelve funciones no-op para no importar expo-notifications.
 */
const loadNotificationService = () => {
  if (IS_WEB) {
    return {
      configureNotifications: () => {},
      isReminderActive: async () => false,
      toggleReminder: async () => true,
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../services/notifications.service') as {
    configureNotifications: () => void
    isReminderActive: () => Promise<boolean>
    toggleReminder: (enabled: boolean) => Promise<boolean>
  }
}

export const useNotifications = () => {
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { configureNotifications, isReminderActive } = loadNotificationService()
    configureNotifications()
    ;(async () => {
      const active = await isReminderActive()
      setReminderEnabled(active)
      setLoading(false)
    })()
  }, [])

  const toggle = useCallback(async (enabled: boolean): Promise<boolean> => {
    const { toggleReminder } = loadNotificationService()
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