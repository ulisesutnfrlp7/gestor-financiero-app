// services/users.service.ts
// Servicio para gestionar perfiles de usuario en Firestore.
//
// Firebase Auth maneja la autenticación (email, password, uid),
// pero no crea documentos en Firestore automáticamente.
// Esta capa se encarga de persistir datos del perfil del usuario.

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { deleteUser, signOut } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'

const COLLECTION = 'users'

/**
 * Verifica si el perfil de usuario ya existe en Firestore.
 *
 * @param uid - ID del usuario (el mismo que Firebase Auth)
 * @returns true si el documento existe, false si no
 */
export const checkUserProfileExists = async (uid: string): Promise<boolean> => {
  const userRef = doc(db, COLLECTION, uid)
  const snapshot = await getDoc(userRef)
  return snapshot.exists()
}

/**
 * Crea un documento de perfil de usuario en Firestore.
 * Se llama inmediatamente después de registrar un nuevo usuario.
 *
 * @param uid - ID del usuario (el mismo que Firebase Auth)
 * @param email - Email con el que se registró
 */
export const createUserProfile = async (
  uid: string,
  email: string
): Promise<void> => {
  const userRef = doc(db, COLLECTION, uid)
  await setDoc(userRef, {
    email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/**
 * Elimina todos los datos del usuario en cascada:
 * 1. Transacciones
 * 2. Plantillas recurrentes
 * 3. Categorías personalizadas
 * 4. Perfil de usuario
 * 5. Cuenta de Firebase Auth
 * 6. Cerrar sesión
 *
 * Usa batches de Firestore para operaciones atómicas.
 */
export const deleteUserAccount = async (userId: string): Promise<void> => {
  // 1-4. Eliminar datos de Firestore en batch (con sesión activa)
  const batch = writeBatch(db)

  // 1. Eliminar transacciones
  const transactionsQuery = query(
    collection(db, 'transactions'),
    where('userId', '==', userId)
  )
  const transactionsSnapshot = await getDocs(transactionsQuery)
  transactionsSnapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref))

  // 2. Eliminar plantillas recurrentes
  const recurringQuery = query(
    collection(db, 'recurringTemplates'),
    where('userId', '==', userId)
  )
  const recurringSnapshot = await getDocs(recurringQuery)
  recurringSnapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref))

  // 3. Eliminar categorías personalizadas
  const categoriesSnapshot = await getDocs(
    collection(db, 'users', userId, 'categories')
  )
  categoriesSnapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref))

  // 4. Eliminar perfil de usuario
  batch.delete(doc(db, COLLECTION, userId))

  // Ejecutar batch
  await batch.commit()

  // 5. Eliminar cuenta de Firebase Auth (requiere sesión reciente)
  const currentUser = auth.currentUser
  if (currentUser) {
    await deleteUser(currentUser)
  }

  // 6. Cerrar sesión
  await signOut(auth)
}