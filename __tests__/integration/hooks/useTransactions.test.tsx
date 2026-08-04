import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useTransactions } from '../../../hooks/useTransactions'
import { useFinanceStore } from '../../../store/useFinanceStore'

// Mock the transactions service
const mockSubscribeToTransactions = jest.fn()
const mockFetchTransactions = jest.fn()

jest.mock('../../../services/transactions.service', () => ({
  subscribeToTransactions: (...args: any[]) => mockSubscribeToTransactions(...args),
  fetchTransactions: (...args: any[]) => mockFetchTransactions(...args),
}))

describe('useTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useFinanceStore.setState({
      transactions: [],
      categories: [],
      recurringTemplates: [],
      isLoading: false,
      error: null,
      userId: null,
    })
  })

  it('does not subscribe when userId is null', async () => {
    await renderHook(() => useTransactions())
    expect(mockSubscribeToTransactions).not.toHaveBeenCalled()
  })

  it('subscribes when userId is set', async () => {
    mockSubscribeToTransactions.mockImplementation((_userId: string, onUpdate: Function, _onError: Function) => {
      onUpdate([
        {
          id: '1',
          amount: 1000,
          description: 'Test',
          category: 'general',
          date: '2026-07-26',
          type: 'expense' as const,
          userId: 'u1',
          createdAt: '2026-07-26T00:00:00Z',
          updatedAt: '2026-07-26T00:00:00Z',
        },
      ])
      return jest.fn()
    })

    useFinanceStore.getState().setUserId('test-user')
    const { result } = await renderHook(() => useTransactions())

    expect(mockSubscribeToTransactions).toHaveBeenCalledWith(
      'test-user',
      expect.any(Function),
      expect.any(Function)
    )
    expect(useFinanceStore.getState().transactions).toHaveLength(1)
    expect(useFinanceStore.getState().isLoading).toBe(false)
    expect(result.current.refresh).toBeDefined()
  })

  it('sets loading to true while subscribing', async () => {
    // Don't call onUpdate immediately to simulate loading
    mockSubscribeToTransactions.mockReturnValue(jest.fn())

    useFinanceStore.getState().setUserId('test-user')
    await renderHook(() => useTransactions())

    expect(useFinanceStore.getState().isLoading).toBe(true)
  })

  it('sets error when subscription fails', async () => {
    mockSubscribeToTransactions.mockImplementation((_userId: string, _onUpdate: Function, onError: Function) => {
      onError(new Error('Network error'))
      return jest.fn()
    })

    useFinanceStore.getState().setUserId('test-user')
    await renderHook(() => useTransactions())

    await waitFor(() => {
      expect(useFinanceStore.getState().error).toBe('Network error')
    })
    expect(useFinanceStore.getState().isLoading).toBe(false)
  })

  it('subscribes and sets loading state on mount', async () => {
    const unsubscribe = jest.fn()
    mockSubscribeToTransactions.mockReturnValue(unsubscribe)

    useFinanceStore.getState().setUserId('test-user')
    const { result } = await renderHook(() => useTransactions())

    expect(mockSubscribeToTransactions).toHaveBeenCalled()
    expect(result.current.refresh).toBeDefined()
  })

  describe('refresh', () => {
    it('fetches transactions and updates store', async () => {
      mockSubscribeToTransactions.mockReturnValue(jest.fn())
      mockFetchTransactions.mockResolvedValue([
        {
          id: '2',
          amount: 2000,
          description: 'Refreshed',
          category: 'salary',
          date: '2026-07-27',
          type: 'income' as const,
          userId: 'u1',
          createdAt: '',
          updatedAt: '',
        },
      ])

      useFinanceStore.getState().setUserId('test-user')
      const { result } = await renderHook(() => useTransactions())

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockFetchTransactions).toHaveBeenCalledWith('test-user')
      expect(useFinanceStore.getState().transactions).toHaveLength(1)
      expect(useFinanceStore.getState().transactions[0].description).toBe('Refreshed')
    })

    it('does nothing when userId is null', async () => {
      const { result } = await renderHook(() => useTransactions())

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockFetchTransactions).not.toHaveBeenCalled()
    })

    it('sets error when fetch fails', async () => {
      mockSubscribeToTransactions.mockReturnValue(jest.fn())
      mockFetchTransactions.mockRejectedValue(new Error('Fetch failed'))

      useFinanceStore.getState().setUserId('test-user')
      const { result } = await renderHook(() => useTransactions())

      await act(async () => {
        await result.current.refresh()
      })

      expect(useFinanceStore.getState().error).toBe('Fetch failed')
    })
  })
})