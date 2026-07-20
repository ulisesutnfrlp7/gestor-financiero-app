// app/(tabs)/categories.tsx — Pantalla de gestión de categorías
// Reemplaza el modal de CategoryManager por una pantalla completa
// en la tab bar, evitando problemas de scroll con ColorPicker.

import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CategoryManager } from '@/components/categories/CategoryManager'

export default function CategoriesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CategoryManager />
    </SafeAreaView>
  )
}