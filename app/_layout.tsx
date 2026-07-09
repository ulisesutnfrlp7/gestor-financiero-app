// app/_layout.tsx
// Layout raíz — punto de entrada de la aplicación.
//
// Responsabilidades:
// 1. Escuchar el estado de autenticación (onAuthStateChanged)
// 2. Redirigir entre (auth) y (tabs) según si hay usuario logueado
// 3. Sincronizar el userId al store de Zustand
// 4. Iniciar la suscripción en tiempo real a Firestore via useTransactions()
// 5. Controlar la visibilidad del Splash Screen

import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { onAuthStateChanged } from 'firebase/auth'
import { useSegments, useRouter } from 'expo-router'
import { auth } from '@/lib/firebase'
import { useFinanceStore } from '@/store/useFinanceStore'
import { useTransactions } from '@/hooks/useTransactions'
import '../global.css'

// Mantiene el splash screen visible hasta que completemos la inicialización
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const segments = useSegments()
  const router = useRouter()
  const setUserId = useFinanceStore((state) => state.setUserId)

  // Suscripción Firestore: activa una vez que userId esté seteado
  useTransactions()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        setUserId(null)
      }

      // Determinar si estamos en una ruta de auth
      const inAuthGroup = segments[0] === '(auth)'

      if (!user && !inAuthGroup) {
        // No hay usuario y no estamos en auth → redirigir a login
        router.replace('/(auth)/login')
      } else if (user && inAuthGroup) {
        // Hay usuario y estamos en auth → redirigir a tabs
        router.replace('/(tabs)')
      }

      // Ocultar splash una vez que tenemos el estado de auth
      await SplashScreen.hideAsync()
    })

    return () => unsubscribe()
  }, [segments, router, setUserId])

  return (
    <>
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
    </>
  )
}