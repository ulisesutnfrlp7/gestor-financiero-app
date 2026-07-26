const mockCollection = jest.fn()
const mockDoc = jest.fn((db, path) => ({ id: path || 'mock-doc-id' }))

const mockAddDoc = jest.fn(() => Promise.resolve({ id: 'new-mock-id' }))
const mockGetDocs = jest.fn(() => Promise.resolve({
  empty: false,
  docs: [
    {
      id: 'doc-1',
      data: () => ({
        amount: 1500,
        description: 'Test transaction',
        category: 'general',
        date: '2026-07-26',
        type: 'expense',
        userId: 'u1',
        createdAt: { toDate: () => new Date('2026-07-26T00:00:00Z') },
        updatedAt: { toDate: () => new Date('2026-07-26T00:00:00Z') },
      }),
    },
  ],
}))
const mockUpdateDoc = jest.fn(() => Promise.resolve())
const mockDeleteDoc = jest.fn(() => Promise.resolve())
const mockOnSnapshot = jest.fn((_query, onNext, onError) => {
  // Simulate successful subscription
  onNext({
    docs: [
      {
        id: 'doc-1',
        data: () => ({
          amount: 1500,
          description: 'Real-time transaction',
          category: 'general',
          date: '2026-07-26',
          type: 'expense',
          userId: 'u1',
          createdAt: { toDate: () => new Date('2026-07-26T00:00:00Z') },
          updatedAt: { toDate: () => new Date('2026-07-26T00:00:00Z') },
        }),
      },
    ],
    docChanges: jest.fn(() => []),
    metadata: { fromCache: false },
  })
  // Return unsubscribe function
  return jest.fn()
})

const mockQuery = jest.fn((collectionRef, ...constraints) => ({
  ...collectionRef,
  constraints,
}))

const mockWhere = jest.fn(() => 'where-clause')
const mockOrderBy = jest.fn(() => 'order-by-clause')
const mockTimestamp = {
  fromDate: jest.fn((date) => ({ toDate: () => date })),
  now: jest.fn(() => ({ toDate: () => new Date() })),
}

const firebase = {
  initializeApp: jest.fn(() => ({ name: '[DEFAULT]' })),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({ name: '[DEFAULT]' })),
}

const firestore = {
  getFirestore: jest.fn(() => ({})),
  collection: mockCollection,
  doc: mockDoc,
  addDoc: mockAddDoc,
  getDocs: mockGetDocs,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  onSnapshot: mockOnSnapshot,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  Timestamp: mockTimestamp,
}

module.exports = {
  ...firebase,
  ...firestore,
  default: {
    ...firebase,
    ...firestore,
  },
}