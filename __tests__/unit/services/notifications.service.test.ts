import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
}))

// expo-notifications is auto-mocked via __mocks__/expo-notifications.js

const {
  configureNotifications,
  requestPermission,
  scheduleDailyReminder,
  cancelReminder,
  isReminderActive,
  toggleReminder,
} = require('../../../services/notifications.service')

describe('notifications.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('configureNotifications', () => {
    it('calls setNotificationHandler with expected config', () => {
      configureNotifications()
      expect(Notifications.setNotificationHandler).toHaveBeenCalledWith({
        handleNotification: expect.any(Function),
      })
    })
  })

  describe('requestPermission', () => {
    it('returns true when permission is already granted', async () => {
      jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ status: 'granted' } as any)

      const result = await requestPermission()

      expect(result).toBe(true)
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled()
    })

    it('requests permission if not yet granted', async () => {
      jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ status: 'undetermined' } as any)
      jest.mocked(Notifications.requestPermissionsAsync).mockResolvedValue({ status: 'granted' } as any)

      const result = await requestPermission()

      expect(result).toBe(true)
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled()
    })

    it('returns false when permission is denied', async () => {
      jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ status: 'undetermined' } as any)
      jest.mocked(Notifications.requestPermissionsAsync).mockResolvedValue({ status: 'denied' } as any)

      const result = await requestPermission()

      expect(result).toBe(false)
    })
  })

  describe('scheduleDailyReminder', () => {
    it('cancels previous notifications and schedules a daily one', async () => {
      await scheduleDailyReminder()

      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled()
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: '📊 Gestor Financiero',
          body: 'No te olvides de registrar tus movimientos de hoy',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20,
          minute: 0,
        },
      })
    })

    it('saves reminder_enabled=true to AsyncStorage', async () => {
      await scheduleDailyReminder()

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@reminder_enabled', 'true')
    })
  })

  describe('cancelReminder', () => {
    it('cancels all scheduled notifications', async () => {
      await cancelReminder()

      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled()
    })

    it('saves reminder_enabled=false to AsyncStorage', async () => {
      await cancelReminder()

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@reminder_enabled', 'false')
    })
  })

  describe('isReminderActive', () => {
    it('returns true when AsyncStorage has "true"', async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValue('true')

      const result = await isReminderActive()

      expect(result).toBe(true)
    })

    it('returns false when AsyncStorage has "false"', async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValue('false')

      const result = await isReminderActive()

      expect(result).toBe(false)
    })

    it('returns false when AsyncStorage returns null', async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValue(null)

      const result = await isReminderActive()

      expect(result).toBe(false)
    })
  })

  describe('toggleReminder', () => {
    it('calls cancelReminder when enabled=false', async () => {
      const result = await toggleReminder(false)

      expect(result).toBe(true)
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled()
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@reminder_enabled', 'false')
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled()
    })

    it('requests permission and schedules when enabled=true', async () => {
      const result = await toggleReminder(true)

      expect(result).toBe(true)
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled()
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled()
    })
  })
})