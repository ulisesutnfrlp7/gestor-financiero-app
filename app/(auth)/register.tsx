// app/(auth)/register.tsx
// Pantalla de registro de nuevo usuario.

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createUserProfile } from '@/services/users.service'
import { AuthForm } from '@/components/auth/AuthForm'
import { registerSchema } from '@/schemas/auth.schema'

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const credential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      // Crear perfil en Firestore
      await createUserProfile(credential.user.uid, data.email)
      // La redirección la maneja onAuthStateChanged en _layout.tsx
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string }
      if (firebaseErr.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado')
      } else if (firebaseErr.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres')
      } else if (firebaseErr.code === 'auth/invalid-email') {
        setError('Email inválido')
      } else {
        setError(firebaseErr.message ?? 'Error al registrarse')
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
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-900">Crear cuenta</Text>
        <Text className="text-gray-500 mt-2 text-base">Completá tus datos para registrarte</Text>
      </View>

      {error && (
        <View className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}

      <AuthForm
        schema={registerSchema}
        onSubmit={handleRegister}
        submitLabel="Crear Cuenta"
        isLoading={isLoading}
        showConfirmPassword
      >
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text className="text-indigo-600 text-sm font-medium">
            ¿Ya tenés cuenta? Iniciá sesión
          </Text>
        </TouchableOpacity>
      </AuthForm>
    </KeyboardAvoidingView>
  )
}