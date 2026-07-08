// app/_layout.tsx
// Layout raíz — punto de entrada de la aplicación.
//
// Responsabilidades:
// 1. Inicializar Firebase Anonymous Auth (el usuario no necesita registrarse para el MVP)
// 2. Sincronizar el userId al store de Zustand
// 3. Iniciar la suscripción en tiempo real a Firestore via useTransactions()
// 4. Controlar la visibilidad del Splash Screen
//
// ¿Por qué autenticación anónima?
// Firebase requiere que cada documento tenga un 'owner'. Con auth anónima,
// cada instalación de la app tiene un userId único, lo que permite aplicar
// reglas de seguridad en Firestore (un usuario solo ve sus datos).
// Es una mejora mínima sobre "sin auth" con gran impacto en seguridad.

import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useFinanceStore } from '@/store/useFinanceStore'
import { useTransactions } from '@/hooks/useTransactions'
import '../global.css'

// Mantiene el splash screen visible hasta que completemos la inicialización
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const setUserId = useFinanceStore((state) => state.setUserId)

  // Suscripción Firestore: activa una vez que userId esté seteado
  useTransactions()

  useEffect(() => {
    // onAuthStateChanged se ejecuta:
    // - Al montar: si ya hay sesión activa (app reiniciada)
    // - Cuando cambia el estado de auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        // Primera vez que abre la app: crear sesión anónima
        const credential = await signInAnonymously(auth)
        setUserId(credential.user.uid)
      }
      // Ocultar splash una vez que tenemos el usuario
      await SplashScreen.hideAsync()
    })

    return () => unsubscribe()
  }, [setUserId])

  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transaction/new"
          options={{
            title: 'Nuevo movimiento',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#F9FAFB' },
            headerTitleStyle: { color: '#111827', fontWeight: '600' },
          }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{
            title: 'Editar movimiento',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#F9FAFB' },
            headerTitleStyle: { color: '#111827', fontWeight: '600' },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  )
}
