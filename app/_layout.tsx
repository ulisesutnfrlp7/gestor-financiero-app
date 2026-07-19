// app/_layout.tsx
// Layout raíz — punto de entrada de la aplicación.
//
// Responsabilidades:
// 1. Escuchar el estado de autenticación (onAuthStateChanged)
// 2. Redirigir entre (auth) y (tabs) según si hay usuario logueado
// 3. Sincronizar el userId al store de Zustand
// 4. Iniciar la suscripción en tiempo real a Firestore via useTransactions()
// 5. Controlar la visibilidad del Splash Screen

import { useEffect, useRef } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { auth } from '@/lib/firebase'
import { useFinanceStore } from '@/store/useFinanceStore'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { seedDefaultCategories } from '@/services/categories.service'
import '../global.css'

// Mantiene el splash screen visible hasta que completemos la inicialización
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()
  const setUserId = useFinanceStore((state) => state.setUserId)
  const splashHidden = useRef(false)

  // Suscripciones Firestore: activas una vez que userId esté seteado
  useTransactions()
  useCategories()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid)
        // Precargar categorías default si es la primera vez
        await seedDefaultCategories(user.uid)
        router.replace('/(tabs)')
      } else {
        setUserId(null)
        router.replace('/(auth)/login')
      }

      if (!splashHidden.current) {
        splashHidden.current = true
        await SplashScreen.hideAsync()
      }
    })

    return () => unsubscribe()
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction/new"
          options={{
            title: 'Nuevo Movimiento',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#4F46E5' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{
            title: 'Editar Movimiento',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#4F46E5' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  )
}