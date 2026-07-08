// app/(tabs)/history.tsx — Historial de movimientos
// Lista completa de todos los movimientos del usuario, ordenados por fecha desc
// (el orden lo maneja la query de Firestore, no el cliente).

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFinanceStore } from '@/store/useFinanceStore'
import { TransactionList } from '@/components/transactions/TransactionList'

export default function HistoryScreen() {
  const transactions = useFinanceStore((state) => state.transactions)
  const isLoading    = useFinanceStore((state) => state.isLoading)

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Encabezado */}
      <View className="px-5 pt-6 pb-4">
        <Text className="text-2xl font-bold text-gray-900">Historial</Text>
        <Text className="text-gray-500 mt-1 text-sm">
          {transactions.length}{' '}
          {transactions.length === 1 ? 'movimiento' : 'movimientos'}
        </Text>
      </View>

      {/* Lista de movimientos */}
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        onItemPress={(id) => router.push(`/transaction/${id}`)}
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
