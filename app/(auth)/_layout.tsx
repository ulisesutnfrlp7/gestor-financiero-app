// app/(auth)/_layout.tsx
// Layout para las pantallas de autenticación (login/register).
// Sin tabs, sin header — solo el contenido centrado.

import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  )
}