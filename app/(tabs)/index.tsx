// app/(tabs)/index.tsx — Dashboard
// Pantalla principal: resumen financiero del usuario.
//
// Usa selectores de Zustand en lugar de derivar los valores en el componente.
// Esto garantiza que solo se re-renderiza cuando cambia el valor que necesita,
// no cuando cambia cualquier parte del store.

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import {
  useFinanceStore,
  selectBalance,
  selectTotalIncome,
  selectTotalExpenses,
} from '@/store/useFinanceStore'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { SummaryItem } from '@/components/dashboard/SummaryItem'

export default function DashboardScreen() {
  const transactionCount = useFinanceStore((state) => state.transactions.length)
  const balance          = useFinanceStore(selectBalance)
  const totalIncome      = useFinanceStore(selectTotalIncome)
  const totalExpenses    = useFinanceStore(selectTotalExpenses)

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => signOut(auth),
        },
      ]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Encabezado */}
        <View className="px-5 pt-6 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Mis Finanzas</Text>
            <Text className="text-gray-500 mt-1 text-sm">Resumen general</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="w-10 h-10 rounded-full items-center justify-center bg-gray-100"
          >
            <Ionicons name="log-out-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Tarjeta de balance */}
        <View className="px-5 mt-4">
          <BalanceCard balance={balance} />
        </View>

        {/* Ingresos y Gastos */}
        <View className="px-5 mt-4 flex-row gap-3">
          <SummaryItem
            label="Ingresos"
            amount={totalIncome}
            type="income"
            className="flex-1"
          />
          <SummaryItem
            label="Gastos"
            amount={totalExpenses}
            type="expense"
            className="flex-1"
          />
        </View>

        {/* Cantidad de movimientos */}
        <View className="mx-5 mt-3 bg-white rounded-xl p-4 border border-gray-100 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-500 text-sm">Movimientos registrados</Text>
            <Text className="text-3xl font-bold text-gray-900 mt-1">
              {transactionCount}
            </Text>
          </View>
          <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center">
            <Ionicons name="swap-vertical-outline" size={24} color="#4F46E5" />
          </View>
        </View>
      </ScrollView>

      {/* FAB — Floating Action Button */}
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
