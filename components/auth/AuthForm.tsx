// components/auth/AuthForm.tsx
// Formulario de autenticación reutilizable para login y registro.

import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodSchema } from 'zod'

interface AuthFormValues {
  email: string
  password: string
  confirmPassword?: string
}

interface AuthFormProps {
  schema: ZodSchema
  onSubmit: (data: AuthFormValues) => Promise<void>
  submitLabel: string
  children?: React.ReactNode
  isLoading?: boolean
  showConfirmPassword?: boolean
}

export function AuthForm({
  schema,
  onSubmit,
  submitLabel,
  children,
  isLoading = false,
  showConfirmPassword = false,
}: AuthFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  return (
    <View className="w-full px-6">
      {/* Email */}
      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1.5">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`bg-white border rounded-xl px-4 py-3.5 text-gray-900 text-base ${
                errors.email ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="tu@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              editable={!isLoading}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.email.message as string}
          </Text>
        )}
      </View>

      {/* Password */}
      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-1.5">Contraseña</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`bg-white border rounded-xl px-4 py-3.5 text-gray-900 text-base ${
                errors.password ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              editable={!isLoading}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.password.message as string}
          </Text>
        )}
      </View>

      {/* Confirmar contraseña (solo para registro) */}
      {showConfirmPassword && (
        <View className="mb-4">
          <Text className="text-gray-700 text-sm font-medium mb-1.5">Confirmar contraseña</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-white border rounded-xl px-4 py-3.5 text-gray-900 text-base ${
                  errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                editable={!isLoading}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message as string}
            </Text>
          )}
        </View>
      )}

      {/* Botón submit */}
      <TouchableOpacity
        onPress={handleSubmit((data) => {
          // Cast safety: data siempre tiene email/password/confirmPassword
          onSubmit(data as unknown as AuthFormValues)
        })}
        disabled={isLoading}
        className={`w-full py-3.5 rounded-xl items-center justify-center mt-2 ${
          isLoading ? 'bg-indigo-400' : 'bg-indigo-600'
        }`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">{submitLabel}</Text>
        )}
      </TouchableOpacity>

      {/* Contenido extra (links a registro/login) */}
      {children && (
        <View className="mt-6 items-center">
          {children}
        </View>
      )}
    </View>
  )
}