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
import { Platform } from 'react-native'
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
import { useRecurringTemplates } from '@/hooks/useRecurringTemplates'
import { useRecurrenceEngine } from '@/hooks/useRecurrenceEngine'
import { seedDefaultCategories } from '@/services/categories.service'
import '../global.css'

const IS_WEB = Platform.OS === 'web'

// Mantiene el splash screen visible hasta que completemos la inicialización
// (no aplica en web — expo-splash-screen no tiene efecto en navegador)
if (!IS_WEB) {
  SplashScreen.preventAutoHideAsync()
}

export default function RootLayout() {
  const router = useRouter()
  const setUserId = useFinanceStore((state) => state.setUserId)
  const splashHidden = useRef(false)

  useEffect(() => {
    if (IS_WEB) {
      document.title = 'Gestor Financiero'

      const styleId = 'web-focus-styles'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          input:focus,
          textarea:focus,
          select:focus,
          input:focus-visible,
          textarea:focus-visible,
          select:focus-visible {
            outline: none !important;
            border-color: #6366f1 !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
          }

          #history-search-input,
          #history-search-input:focus,
          #history-search-input:focus-visible,
          #history-search-input input,
          #history-search-input textarea,
          #history-search-input input:focus,
          #history-search-input textarea:focus,
          #history-search-input input:focus-visible,
          #history-search-input textarea:focus-visible {
            border: none !important;
            border-width: 0 !important;
            border-color: transparent !important;
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            background: transparent !important;
          }

          #history-search-input::-webkit-search-decoration,
          #history-search-input::-webkit-search-cancel-button,
          #history-search-input::-webkit-search-results-button,
          #history-search-input::-webkit-search-results-decoration {
            -webkit-appearance: none !important;
          }
        `
        document.head.appendChild(style)
      }
    }
  }, [])

  // Suscripciones Firestore: activas una vez que userId esté seteado
  useTransactions()
  useCategories()
  useRecurringTemplates()
  useRecurrenceEngine()

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
        if (!IS_WEB) {
          await SplashScreen.hideAsync()
        }
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
        <Stack.Screen
          name="recurring/[id]"
          options={{
            title: 'Editar Recurrente',
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