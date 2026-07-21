// app/(tabs)/categories.tsx — Pantalla de gestión de categorías
// Reemplaza el modal de CategoryManager por una pantalla completa
// en la tab bar, evitando problemas de scroll con ColorPicker.

import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFinanceStore } from '@/store/useFinanceStore'
import { CategoryManager } from '@/components/categories/CategoryManager'

export default function CategoriesScreen() {
  const error = useFinanceStore((state) => state.error)

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {error && (
        <View className="mx-5 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}
      <CategoryManager />
    </SafeAreaView>
  )
}