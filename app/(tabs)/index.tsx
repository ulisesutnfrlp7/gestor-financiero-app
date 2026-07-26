// app/(tabs)/index.tsx — Dashboard
// Pantalla principal: resumen financiero del usuario.
//
// Usa selectores de Zustand en lugar de derivar los valores en el componente.
// Esto garantiza que solo se re-renderiza cuando cambia el valor que necesita,
// no cuando cambia cualquier parte del store.

import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useFinanceStore } from '@/store/useFinanceStore'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { SummaryItem } from '@/components/dashboard/SummaryItem'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { deleteUserAccount } from '@/services/users.service'
import { isOnline } from '@/utils/network'

export default function DashboardScreen() {
  const transactions = useFinanceStore((state) => state.transactions)
  const error = useFinanceStore((state) => state.error)
  const userId = useFinanceStore((state) => state.userId)

  // Estado para el filtro de fechas
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtrar transacciones según el rango de fechas
  const filteredTransactions = useMemo(() => {
    if (!dateFrom && !dateTo) return transactions
    return transactions.filter((t) => {
      if (dateFrom && t.date < dateFrom) return false
      if (dateTo && t.date > dateTo) return false
      return true
    })
  }, [transactions, dateFrom, dateTo])

  // Calcular métricas sobre las transacciones filtradas
  const totalIncome = useMemo(
    () => filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  )

  const totalExpenses = useMemo(
    () => filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  )

  const balance = totalIncome - totalExpenses
  const transactionCount = filteredTransactions.length

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
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

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Todos tus datos se perderán. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '¿Estás seguro?',
              'Se eliminarán: todas tus transacciones, plantillas recurrentes y categorías.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Sí, eliminar todo',
                  style: 'destructive',
                  onPress: async () => {
                    if (!userId) return

                    const online = await isOnline()
                    if (!online) {
                      Alert.alert('Sin conexión', 'Necesitás conexión a Internet para eliminar la cuenta.')
                      return
                    }

                    setIsDeleting(true)
                    try {
                      await deleteUserAccount(userId)
                      // La redirección la maneja onAuthStateChanged en _layout.tsx
                    } catch (err: unknown) {
                      const fbErr = err as { code?: string; message?: string }
                      // Si el error es de Auth (sesión expirada, token vencido), los datos de Firestore
                      // ya se eliminaron. No mostrar error al usuario.
                      if (
                        fbErr.code === 'auth/requires-recent-login' ||
                        fbErr.code === 'auth/user-token-expired' ||
                        fbErr.code === 'auth/invalid-user-token'
                      ) {
                        // Datos eliminados, solo falló Auth. La redirección se maneja sola.
                      } else {
                        Alert.alert('Error', 'No se pudo eliminar la cuenta. Intentalo de nuevo más tarde.')
                      }
                    }
                  },
                },
              ]
            )
          },
        },
      ]
    )
  }

  const subtitle = dateFrom || dateTo
    ? `Del ${dateFrom ? dateFrom : '—'} al ${dateTo ? dateTo : '—'}`
    : 'Resumen General'

  // NUEVO: Early return para la pantalla de eliminación
  if (isDeleting) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-gray-900 font-semibold text-lg mt-5 text-center">
          Eliminando todos tus datos...
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center mx-10">
          Esto puede tardar unos segundos. Por favor, no cierres la aplicación.
        </Text>
      </SafeAreaView>
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
            <Text className="text-gray-500 mt-1 text-sm">{subtitle}</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleLogout}
              className="w-10 h-10 rounded-full items-center justify-center bg-gray-100"
            >
              <Ionicons name="log-out-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="w-10 h-10 rounded-full items-center justify-center bg-red-50"
            >
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner de error */}
        {error && (
          <View className="mx-5 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <Text className="text-red-600 text-sm text-center">{error}</Text>
          </View>
        )}

        {/* Filtro de fechas */}
        <DateRangeFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChange={(from, to) => {
            setDateFrom(from)
            setDateTo(to)
          }}
        />

        {/* Tarjeta de balance */}
        <View className="px-5 mt-5">
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
            <Text className="text-gray-500 text-sm">Movimientos Registrados</Text>
            <Text className="text-3xl font-bold text-gray-900 mt-1">
              {transactionCount}
            </Text>
          </View>
          <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center">
            <Ionicons name="swap-vertical-outline" size={24} color="#4F46E5" />
          </View>
        </View>

        {/* Gráficos por categoría */}
        <CategoryChart transactions={filteredTransactions} type="expense" />
        <CategoryChart transactions={filteredTransactions} type="income" />
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