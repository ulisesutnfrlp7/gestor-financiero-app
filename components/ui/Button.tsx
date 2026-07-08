// components/ui/Button.tsx
// Componente de botón reutilizable con variantes y estados de carga.
//
// Principio: los componentes UI no conocen la lógica del negocio,
// solo reciben props y delegan las acciones al padre.

import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'

interface ButtonProps {
  onPress: () => void
  title: string
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses = {
  primary:   'bg-indigo-600 active:bg-indigo-700 border border-indigo-600',
  secondary: 'bg-white border border-indigo-600 active:bg-indigo-50',
  danger:    'bg-red-600 active:bg-red-700 border border-red-600',
  ghost:     'bg-transparent border border-transparent active:bg-gray-100',
}

const variantTextClasses = {
  primary:   'text-white font-semibold',
  secondary: 'text-indigo-600 font-semibold',
  danger:    'text-white font-semibold',
  ghost:     'text-gray-700 font-medium',
}

const sizeClasses = {
  sm: 'py-2 px-3 rounded-lg',
  md: 'py-3 px-5 rounded-xl',
  lg: 'py-4 px-6 rounded-xl',
}

const sizeTextClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const spinnerColors = {
  primary:   'white',
  secondary: '#4F46E5',
  danger:    'white',
  ghost:     '#374151',
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
}) => {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`
        flex-row items-center justify-center gap-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : 'self-start'}
        ${isDisabled ? 'opacity-50' : ''}
      `}
    >
      {loading && (
        <ActivityIndicator size="small" color={spinnerColors[variant]} />
      )}
      <Text className={`${variantTextClasses[variant]} ${sizeTextClasses[size]}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}
