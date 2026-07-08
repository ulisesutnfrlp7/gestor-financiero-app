// app/+not-found.tsx
import { Link, Stack } from 'expo-router'
import { View, Text } from 'react-native'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '¡Oops!' }} />
      <View className="flex-1 items-center justify-center p-8 bg-gray-50">
        <Text className="text-5xl mb-4">🔍</Text>
        <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
          Pantalla no encontrada
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          La pantalla que buscás no existe.
        </Text>
        <Link href="/">
          <Text className="text-indigo-600 font-semibold text-base">
            Volver al inicio
          </Text>
        </Link>
      </View>
    </>
  )
}
