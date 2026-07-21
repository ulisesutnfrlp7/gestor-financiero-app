// app/(tabs)/history.tsx — Historial de movimientos
// Lista completa de todos los movimientos del usuario, ordenados por fecha desc
// (el orden lo maneja la query de Firestore, no el cliente).

import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFinanceStore, selectAllCategories } from '@/store/useFinanceStore'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters, type Filters } from '@/components/transactions/TransactionFilters'
import { deleteTransaction, fetchTransactions } from '@/services/transactions.service'
import { exportTransactionsPdf } from '@/utils/exportPdf'
import { isOnline } from '@/utils/network'

export default function HistoryScreen() {
  const transactions = useFinanceStore((state) => state.transactions)
  const isLoading    = useFinanceStore((state) => state.isLoading)
  const userId       = useFinanceStore((state) => state.userId)
  const setTransactions = useFinanceStore((state) => state.setTransactions)
  const error        = useFinanceStore((state) => state.error)
  const allCategories = useFinanceStore(selectAllCategories)
  const [refreshing, setRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
    searchQuery: '',
  })

  const handleEdit = (id: string) => {
    router.push(`/transaction/${id}`)
  }

  const handleRefresh = useCallback(async () => {
    if (!userId) return
    setRefreshing(true)
    try {
      const data = await fetchTransactions(userId)
      setTransactions(data)
    } catch {
      // Ignorar errores en pull-to-refresh
    } finally {
      setRefreshing(false)
    }
  }, [userId, setTransactions])

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar Movimiento',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const online = await isOnline()
            if (!online) {
              Alert.alert('Sin conexión', 'Sin conexión a Internet. Verificá tu conexión.')
              return
            }
            await deleteTransaction(id)
            Alert.alert('Éxito', 'Movimiento eliminado exitosamente.')
          },
        },
      ]
    )
  }

  // Filtrar transacciones según los filtros activos
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.category && t.category !== filters.category) return false
      if (filters.dateFrom && t.date < filters.dateFrom) return false
      if (filters.dateTo && t.date > filters.dateTo) return false
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase()
        if (!t.description.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [transactions, filters])

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Encabezado */}
      <View className="px-5 pt-6 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Historial de Movimientos</Text>
      </View>

      {/* Banner de error */}
      {error && (
        <View className="mx-5 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}

      {/* Filtros */}
      <TransactionFilters filters={filters} onChange={setFilters} />

      {/* Lista de movimientos */}
      <TransactionList
        transactions={filteredTransactions}
        isLoading={isLoading}
        onItemPress={(id) => router.push(`/transaction/${id}`)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Botón exportar PDF */}
      <View className="px-5 py-3 bg-white border-t border-gray-200" style={{ paddingBottom: 96 }}>
        <TouchableOpacity
          onPress={async () => {
            setIsExporting(true)
            try {
              await exportTransactionsPdf(filteredTransactions, allCategories, filters)
            } catch (e) {
              Alert.alert('Error', 'No se pudo generar el PDF. Intentá de nuevo.')
            } finally {
              setIsExporting(false)
            }
          }}
          disabled={isExporting || filteredTransactions.length === 0}
          className={`flex-row items-center justify-center rounded-xl py-3.5 mt-2 gap-2 ${
            filteredTransactions.length === 0 ? 'bg-gray-200' : 'bg-indigo-600'
          }`}
          accessibilityLabel="Exportar PDF"
        >
          {isExporting
            ? <ActivityIndicator size="small" color="white" />
            : <Ionicons name="document-text-outline" size={18} color={filteredTransactions.length === 0 ? '#9CA3AF' : 'white'} />}
          <Text className={`font-semibold text-sm ${
            filteredTransactions.length === 0 ? 'text-gray-400' : 'text-white'
          }`}>
            {isExporting
              ? 'Generando PDF...'
              : `Exportar PDF (${filteredTransactions.length} movimiento${filteredTransactions.length !== 1 ? 's' : ''})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/transaction/new')}
        className="absolute bottom-8 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center"
        style={{ elevation: 6, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
        accessibilityLabel="Agregar movimiento"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
