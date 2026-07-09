// services/users.service.ts
// Servicio para gestionar perfiles de usuario en Firestore.
//
// Firebase Auth maneja la autenticación (email, password, uid),
// pero no crea documentos en Firestore automáticamente.
// Esta capa se encarga de persistir datos del perfil del usuario.

import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const COLLECTION = 'users'

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