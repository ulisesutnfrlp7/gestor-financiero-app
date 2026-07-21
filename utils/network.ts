// utils/network.ts
// Utilidad para verificar conectividad a Internet.
// Firebase Firestore tiene persistencia offline: cuando no hay WiFi,
// addDoc/updateDoc/deleteDoc NO lanzan error, solo guardan localmente.
// Esta función permite detectar si hay conexión real antes de operar.

const TIMEOUT_MS = 5_000

/**
 * Verifica si hay conexión a Internet haciendo un fetch a un endpoint de Google.
 * Google es confiable, no requiere API key, y funciona en todo el mundo.
 * 
 * @returns true si hay conexión, false si no
 */
export const isOnline = async (): Promise<boolean> => {
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