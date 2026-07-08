// lib/firebase.ts
// Punto único de inicialización de Firebase.
//
// Patrón singleton correcto:
//   - 'isFirstInit' se captura ANTES de initializeApp (después siempre es >= 1)
//   - initializeAuth solo puede llamarse UNA vez por instancia de app
//   - En Fast Refresh, getApps().length > 0 → se reutilizan las instancias existentes

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { initializeAuth, getAuth, type Auth, type Persistence } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ─── Nota sobre getReactNativePersistence ────────────────────────────────────
// La función existe en el bundle RN de firebase/auth que Metro resuelve
// correctamente en runtime. Sin embargo, @firebase/auth coloca "types" ANTES
// de "react-native" en su mapa de exports, por lo que TypeScript resuelve los
// tipos del browser build (que no expone la función), ignorando customConditions.
// require() con tipado explícito es el workaround estándar para este bug.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence
}

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

// initializeAuth (con persistencia en AsyncStorage) solo en la primera carga.
// getAuth() devuelve la instancia ya creada en recargas por Fast Refresh.
const auth: Auth = isFirstInit
  ? initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  : getAuth(app)

const db: Firestore = getFirestore(app)

export { app, auth, db }