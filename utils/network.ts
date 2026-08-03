// utils/network.ts
// Utilidad para verificar conectividad a Internet.
// Firebase Firestore tiene persistencia offline: cuando no hay WiFi,
// addDoc/updateDoc/deleteDoc NO lanzan error, solo guardan localmente.
// Esta función permite detectar si hay conexión real antes de operar.
//
// Multiplataforma:
//   - Nativo: fetch a un endpoint de Google (confiable, sin API key)
//   - Web: usa navigator.onLine (el fetch a Google falla por CORS en el navegador)

import { Platform } from 'react-native'

const IS_WEB = Platform.OS === 'web'
const TIMEOUT_MS = 5_000

/**
 * Verifica si hay conexión a Internet.
 *
 * @returns true si hay conexión, false si no
 */
export const isOnline = async (): Promise<boolean> => {
  // En web, navigator.onLine es la API nativa del navegador.
  // Evita el error de CORS al hacer fetch a google.com/generate_204.
  if (IS_WEB) {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const response = await fetch('https://www.google.com/generate_204', {
      method: 'HEAD',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}