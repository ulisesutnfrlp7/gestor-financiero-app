// Botón "Continuar con Google" reutilizable para login y registro.
// Usa require() dinámico dentro del handler para evitar que Metro
// cargue el módulo nativo en tiempo de bundle. Así Expo Go nunca
// crashea — solo muestra un Alert amigable si el módulo no existe.

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createUserProfile } from '@/services/users.service'
import { isOnline } from '@/utils/network'

interface GoogleSignInButtonProps {
  /** 'login' solo autentica; 'register' además crea el perfil en Firestore */
  mode: 'login' | 'register'
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ mode }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    const online = await isOnline()
    if (!online) {
      Alert.alert('Sin conexión', 'Necesitás estar conectado a internet para iniciar sesión con Google.')
      return
    }
    setIsLoading(true)
    try {
      // Import dinámico — solo se evalúa al tocar el botón
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleSignin, statusCodes } = require('@react-native-google-signin/google-signin') as {
        GoogleSignin: {
          configure: (config: { webClientId: string }) => void
          hasPlayServices: (opts: { showPlayServicesUpdateDialog: boolean }) => Promise<void>
          signOut: () => Promise<void>
          signIn: () => Promise<{ data?: { idToken?: string } }>
        }
        statusCodes: {
          SIGN_IN_CANCELLED: string
          PLAY_SERVICES_NOT_AVAILABLE: string
        }
      }

      // Configurar si no se configuró antes
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
      })

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      // Cerrar sesión previa para forzar el selector de cuentas
      await GoogleSignin.signOut()
      const userInfo = await GoogleSignin.signIn()
      const idToken = userInfo.data?.idToken

      if (!idToken) {
        Alert.alert('Error', 'No se pudo obtener el token de Google.')
        return
      }

      const credential = GoogleAuthProvider.credential(idToken)
      const userCredential = await signInWithCredential(auth, credential)

      // Si es registro, crear perfil en Firestore
      if (mode === 'register') {
        await createUserProfile(userCredential.user.uid, userCredential.user.email ?? '')
      }

      // La redirección la maneja onAuthStateChanged en _layout.tsx
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }

      // Si el módulo nativo no está disponible (Expo Go)
      if (error.message?.includes('RNGoogleSignin')) {
        Alert.alert(
          'No disponible',
          'Google Sign-In requiere un build nativo. Usá Expo Go solo para desarrollo.'
        )
        return
      }

      if (!error.code) {
        Alert.alert('Error', error.message ?? 'Error al iniciar sesión con Google.')
        return
      }

      if (error.code === 'SIGN_IN_CANCELLED') {
        // Usuario canceló — no mostrar error
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        Alert.alert('Error', 'Google Play Services no están disponibles en este dispositivo.')
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        Alert.alert('Error', 'Ya existe una cuenta con este email usando otro método de inicio de sesión.')
      } else {
        Alert.alert('Error', error.message ?? 'Error al iniciar sesión con Google.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="w-full px-6">
      <TouchableOpacity
        onPress={handleGoogleSignIn}
        disabled={isLoading}
        className={`w-full py-3.5 rounded-xl items-center justify-center flex-row gap-3 border ${
          isLoading ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'
        }`}
      >
        {isLoading ? (
          <ActivityIndicator color="#4F46E5" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text className="text-gray-700 font-semibold text-base">
              Continuar con Google
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}