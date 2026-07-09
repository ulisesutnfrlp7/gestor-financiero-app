// app/(tabs)/history.tsx — Historial de movimientos
// Lista completa de todos los movimientos del usuario, ordenados por fecha desc
// (el orden lo maneja la query de Firestore, no el cliente).

import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFinanceStore } from '@/store/useFinanceStore'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters, type Filters } from '@/components/transactions/TransactionFilters'
import { deleteTransaction, fetchTransactions } from '@/services/transactions.service'

export default function HistoryScreen() {
  const transactions = useFinanceStore((state) => state.transactions)
  const isLoading    = useFinanceStore((state) => state.isLoading)
  const userId       = useFinanceStore((state) => state.userId)
  const setTransactions = useFinanceStore((state) => state.setTransactions)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
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
          onPress: () => deleteTransaction(id),
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
      return true
    })
  }, [transactions, filters])

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Encabezado */}
      <View className="px-5 pt-6 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Historial</Text>
      </View>

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
