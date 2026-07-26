import { subscribeToTransactions, fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from '../../../services/transactions.service'

// Mock firebase module
jest.mock('firebase/firestore', () => {
  const mockOnSnapshot = jest.fn((_query, onNext, _onError) => {
    onNext({
      docs: [
        {
          id: 'doc-1',
          data: () => ({
            amount: 1500,
            description: 'Test',
            category: 'general',
            date: '2026-07-26',
            type: 'expense',
            userId: 'u1',
            createdAt: { toDate: () => new Date('2026-07-26T00:00:00Z') },
            updatedAt: { toDate: () => new Date('2026-07-26T00:00:00Z') },
            isRecurring: false,
          }),
        },
      ],
      docChanges: jest.fn(() => []),
      metadata: { fromCache: false },
    })
    return jest.fn()
  })

  const mockAddDoc = jest.fn(() => Promise.resolve({ id: 'new-mock-id' }))
  const mockGetDocs = jest.fn(() => Promise.resolve({
    empty: false,
    docs: [
      {
        id: 'doc-1',
        data: () => ({
          amount: 1500,
          description: 'Test',
          category: 'general',
          date: '2026-07-26',
          type: 'expense',
          userId: 'u1',
          createdAt: { toDate: () => new Date('2026-07-26T00:00:00Z') },
          updatedAt: { toDate: () => new Date('2026-07-26T00:00:00Z') },
          isRecurring: false,
        }),
      },
    ],
  }))
  const mockUpdateDoc = jest.fn(() => Promise.resolve())
  const mockDeleteDoc = jest.fn(() => Promise.resolve())

  class MockTimestamp {
    static fromDate(date: Date) {
      return { toDate: () => date }
    }
    static now() {
      return { toDate: () => new Date() }
    }
  }

  return {
    collection: jest.fn(() => ({})),
    doc: jest.fn(() => ({ id: 'test-id' })),
    addDoc: mockAddDoc,
    getDocs: mockGetDocs,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    onSnapshot: mockOnSnapshot,
    query: jest.fn((_ref, ...constraints) => ({ ref: _ref, constraints })),
    where: jest.fn(() => 'where-clause'),
    orderBy: jest.fn(() => 'order-by-clause'),
    Timestamp: MockTimestamp,
    Unsubscribe: jest.fn(),
  }
})

// Mock the db import
jest.mock('../../../lib/firebase', () => ({
  db: {},
}))

describe('transactions.service', () => {
  const userId = 'test-user-id'

  describe('subscribeToTransactions', () => {
    it('calls onUpdate with transformed transactions', () => {
      const onUpdate = jest.fn()
      const onError = jest.fn()
      const unsubscribe = subscribeToTransactions(userId, onUpdate, onError)

      expect(onUpdate).toHaveBeenCalledTimes(1)
      expect(onUpdate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'doc-1',
            amount: 1500,
            description: 'Test',
            date: '2026-07-26',
            type: 'expense',
          }),
        ])
      )
      expect(onError).not.toHaveBeenCalled()
      expect(unsubscribe).toBeDefined()
    })

    it('returns an unsubscribe function', () => {
      const onUpdate = jest.fn()
      const onError = jest.fn()
      const unsubscribe = subscribeToTransactions(userId, onUpdate, onError)
      expect(typeof unsubscribe).toBe('function')
    })
  })

  describe('fetchTransactions', () => {
    it('returns an array of transactions', async () => {
      const transactions = await fetchTransactions(userId)
      expect(transactions).toHaveLength(1)
      expect(transactions[0]).toMatchObject({
        id: 'doc-1',
        amount: 1500,
        description: 'Test',
      })
    })
  })

  describe('createTransaction', () => {
    it('returns the created document id', async () => {
      const id = await createTransaction(userId, {
        amount: 2000,
        description: 'New transaction',
        category: 'salary',
        date: '2026-07-26',
        type: 'income',
      })
      expect(id).toBe('new-mock-id')
    })
  })

  describe('updateTransaction', () => {
    it('updates with partial data', async () => {
      await expect(
        updateTransaction('doc-1', { description: 'Updated' })
      ).resolves.toBeUndefined()
    })
  })

  describe('deleteTransaction', () => {
    it('deletes the document', async () => {
      await expect(
        deleteTransaction('doc-1')
      ).resolves.toBeUndefined()
    })
  })
})