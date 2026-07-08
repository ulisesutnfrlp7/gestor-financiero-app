// components/ui/EmptyState.tsx
// Componente para pantallas vacías. Mejora la UX informando al usuario
// que no hay datos en lugar de mostrar una pantalla en blanco.

import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Ionicons>['name']
  title: string
  subtitle: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
  return (
    <View className="flex-1 items-center justify-center px-10 py-20">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-5">
        <Ionicons name={icon} size={36} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-semibold text-gray-700 text-center mb-2">
        {title}
      </Text>
      <Text className="text-gray-400 text-center text-sm leading-5">
        {subtitle}
      </Text>
    </View>
  )
}
