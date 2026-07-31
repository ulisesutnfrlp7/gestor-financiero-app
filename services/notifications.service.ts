// services/notifications.service.ts
// Servicio de notificaciones locales para recordatorios diarios.
// Sin servidor push, sin FCM — solo notificaciones programadas desde el dispositivo.

import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const REMINDER_KEY = '@reminder_enabled'
const REMINDER_HOUR = 20
const REMINDER_MINUTE = 0
const REMINDER_TITLE = '📊 Gestor Financiero'
const REMINDER_BODY = 'No te olvides de registrar tus movimientos de hoy'

/**
 * Configura el handler global de notificaciones.
 * Debe llamarse una vez al iniciar la app.
 */
export const configureNotifications = (): void => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })
}

/**
 * Solicita permiso para mostrar notificaciones.
 * En Android no requiere permiso explícito (siempre granted).
 * En iOS muestra el diálogo nativo.
 */
export const requestPermission = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    return false
  }

  // Android: necesita el channel para que suene/notifique en background
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Recordatorios',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 100],
    })
  }

  return true
}

/**
 * Programa el recordatorio diario a las 20:00.
 * Cancela cualquier recordatorio previo antes de crear el nuevo.
 */
export const scheduleDailyReminder = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync()

  await Notifications.scheduleNotificationAsync({
    content: {
      title: REMINDER_TITLE,
      body: REMINDER_BODY,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: REMINDER_HOUR,
      minute: REMINDER_MINUTE,
    },
  })

  await AsyncStorage.setItem(REMINDER_KEY, 'true')
}

/**
 * Cancela el recordatorio diario.
 */
export const cancelReminder = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync()
  await AsyncStorage.setItem(REMINDER_KEY, 'false')
}

/**
 * Retorna true si el recordatorio está activo.
 */
export const isReminderActive = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(REMINDER_KEY)
  return value === 'true'
}

/**
 * Activa o desactiva el recordatorio según el parámetro.
 * Útil para el toggle en la UI.
 */
export const toggleReminder = async (enabled: boolean): Promise<boolean> => {
  if (enabled) {
    const permitted = await requestPermission()
    if (!permitted) return false
    await scheduleDailyReminder()
  } else {
    await cancelReminder()
  }
  return true
}