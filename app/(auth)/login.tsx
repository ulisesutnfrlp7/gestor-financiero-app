// app/(auth)/login.tsx
// Pantalla de inicio de sesión.

import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthForm } from '@/components/auth/AuthForm'
import { loginSchema } from '@/schemas/auth.schema'

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      // La redirección la maneja onAuthStateChanged en _layout.tsx
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string }
      if (firebaseErr.code === 'auth/user-not-found' || firebaseErr.code === 'auth/invalid-credential') {
        setError('Email o contraseña incorrectos')
      } else if (firebaseErr.code === 'auth/invalid-email') {
        setError('Email inválido')
      } else {
        setError(firebaseErr.message ?? 'Error al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 justify-center"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="items-center mb-10">
        <Image
          source={require('@/assets/icono.jpg')}
          className="w-40 h-40 mb-6 rounded-full border-2 border-indigo-100"
          resizeMode="cover"
          fadeDuration={0}
        />
        <Text className="text-3xl font-bold text-gray-900">Gestor Financiero</Text>
        <Text className="text-gray-500 mt-2 text-base">Iniciá sesión para continuar</Text>
      </View>

      {error && (
        <View className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}

      <AuthForm
        schema={loginSchema}
        onSubmit={handleLogin}
        submitLabel="Iniciar Sesión"
        isLoading={isLoading}
      >
        <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
          <Text className="text-indigo-600 text-sm font-medium">
            ¿No tenés cuenta? Registrate
          </Text>
        </TouchableOpacity>
      </AuthForm>
    </KeyboardAvoidingView>
  )
}