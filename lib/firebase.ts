// lib/firebase.ts
// Punto único de inicialización de Firebase.
//
// Patrón singleton correcto:
//   - 'isFirstInit' se captura ANTES de initializeApp (después siempre es >= 1)
//   - initializeAuth solo puede llamarse UNA vez por instancia de app
//   - En Fast Refresh, getApps().length > 0 → se reutilizan las instancias existentes
//
// Soporte multiplataforma:
//   - Nativo (iOS/Android): persistencia en AsyncStorage vía getReactNativePersistence
//   - Web: Firebase Auth usa por defecto la persistencia del navegador (localStorage)

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { initializeAuth, getAuth, type Auth, type Persistence } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const IS_WEB = Platform.OS === 'web'

// ─── Nota sobre getReactNativePersistence ────────────────────────────────────
// La función existe en el bundle RN de firebase/auth que Metro resuelve
// correctamente en runtime. Sin embargo, @firebase/auth coloca "types" ANTES
// de "react-native" en su mapa de exports, por lo que TypeScript resuelve los
// tipos del browser build (que no expone la función), ignorando customConditions.
// require() con tipado explícito es el workaround estándar para este bug.
// Solo se ejecuta en nativo; en web se usa la persistencia por defecto.
const { getReactNativePersistence } = (() => {
  if (IS_WEB) return { getReactNativePersistence: null as null }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('firebase/auth') as {
    getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence
  }
  return mod
})()

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

// ⚠ Capturar ANTES de initializeApp — después getApps().length siempre será >= 1
const isFirstInit = getApps().length === 0

const app: FirebaseApp = isFirstInit ? initializeApp(firebaseConfig) : getApp()

// initializeAuth (con persistencia) solo en la primera carga.
// getAuth() devuelve la instancia ya creada en recargas por Fast Refresh.
// En web no hace falta persistencia explícita: getAuth() usa localStorage.
const auth: Auth = isFirstInit
  ? IS_WEB
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence!(AsyncStorage),
      })
  : getAuth(app)

const db: Firestore = getFirestore(app)

export { app, auth, db }
