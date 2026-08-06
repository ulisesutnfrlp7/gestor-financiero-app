import {
  checkUserProfileExists,
  createUserProfile,
} from '../../../services/users.service'

// Mock firebase/firestore
jest.mock('firebase/firestore', () => {
  const mockSetDoc = jest.fn(() => Promise.resolve())
  const mockGetDoc = jest.fn()

  return {
    doc: jest.fn((_db, _collection, _id) => ({ id: 'mock-user-id' })),
    setDoc: mockSetDoc,
    getDoc: mockGetDoc,
    serverTimestamp: jest.fn(() => new Date()),
    collection: jest.fn(() => ({})),
    query: jest.fn((_ref, ...constraints) => ({ ref: _ref, constraints })),
    where: jest.fn(() => 'where-clause'),
    getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
    writeBatch: jest.fn(() => ({
      delete: jest.fn(),
      commit: jest.fn(() => Promise.resolve()),
    })),
  }
})

// Mock firebase/auth
jest.mock('firebase/auth', () => ({
  deleteUser: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
}))

// Mock lib/firebase
jest.mock('../../../lib/firebase', () => ({
  db: {},
  auth: {},
}))

// Import mocks after jest.mock calls
import { getDoc, setDoc } from 'firebase/firestore'

const mockedGetDoc = getDoc as jest.Mock
const mockedSetDoc = setDoc as jest.Mock

describe('users.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkUserProfileExists', () => {
    it('returns true when the profile document exists', async () => {
      mockedGetDoc.mockResolvedValue({ exists: () => true })

      const result = await checkUserProfileExists('user-123')
      expect(result).toBe(true)
      expect(mockedGetDoc).toHaveBeenCalledTimes(1)
    })

    it('returns false when the profile document does not exist', async () => {
      mockedGetDoc.mockResolvedValue({ exists: () => false })

      const result = await checkUserProfileExists('user-123')
      expect(result).toBe(false)
    })
  })

  describe('createUserProfile', () => {
    it('creates the profile with email and timestamps', async () => {
      mockedSetDoc.mockResolvedValue(undefined)

      await createUserProfile('user-123', 'test@example.com')

      expect(mockedSetDoc).toHaveBeenCalledTimes(1)
      expect(mockedSetDoc).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'mock-user-id' }),
        expect.objectContaining({
          email: 'test@example.com',
        })
      )
    })
  })
})