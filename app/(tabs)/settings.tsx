// app/(tabs)/settings.tsx
// Pantalla de configuración: recordatorio diario, etc.

import React from 'react'
import { View, Text, Switch, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNotifications } from '@/hooks/useNotifications'

export default function SettingsScreen() {
  const { reminderEnabled, loading, toggle } = useNotifications()

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4">
        
        {/* Encabezado */}
        <View className="px-0 py-2 mb-3">
          <Text className="text-2xl font-bold text-gray-900">Configuración</Text>
          <Text className="text-gray-500 text-sm mt-1">Programá tu recordatorio</Text>
        </View>

        {/* Recordatorio diario */}
        <View className="bg-white rounded-xl p-4 flex-row items-center justify-between shadow-sm border border-gray-100">
          <View className="flex-1 mr-4">
            <Text className="text-gray-900 font-semibold text-base">
              Recordatorio Diario
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Recibí una notificación a las 20:00 para registrar tus movimientos.
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <Switch
              value={reminderEnabled}
              onValueChange={(value) => { toggle(value) }}
              trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
              thumbColor={reminderEnabled ? '#4F46E5' : '#9CA3AF'}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}