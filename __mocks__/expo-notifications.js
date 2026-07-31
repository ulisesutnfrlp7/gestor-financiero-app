const mockScheduledNotifications = []

const MockNotifications = {
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  cancelAllScheduledNotificationsAsync: jest.fn(() => {
    mockScheduledNotifications.length = 0
    return Promise.resolve()
  }),
  scheduleNotificationAsync: jest.fn(({ content, trigger }) => {
    mockScheduledNotifications.push({ content, trigger })
    return Promise.resolve('notification-id')
  }),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve(mockScheduledNotifications)),
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
  },
  AndroidImportance: {
    DEFAULT: 3,
  },
}

module.exports = MockNotifications