// services/categories.service.ts
// Capa de acceso a datos para categorías personalizadas.
// Las categorías se almacenan en una subcolección /users/{userId}/categories/.

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CustomCategory, TransactionType } from '@/types'
import { ALL_CATEGORIES } from '@/constants/categories'
import { CHART_COLORS } from '@/constants/colors'

const getCategoriesRef = (userId: string) =>
  collection(db, 'users', userId, 'categories')

/**
 * Suscripción en tiempo real a las categorías del usuario.
 */
export const subscribeToCategories = (
  userId: string,
  onUpdate: (categories: CustomCategory[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const q = query(
    getCategoriesRef(userId),
    orderBy('createdAt', 'asc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const categories: CustomCategory[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          label:    data['label'] as string,
          type:     data['type'] as TransactionType,
          color:    data['color'] as string,
          icon:     data['icon'] as string,
          userId:   data['userId'] as string,
          createdAt: data['createdAt'] as string,
        }
      })
      onUpdate(categories)
    },
    onError
  )
}

/**
 * Precarga las categorías default al registrar un usuario nuevo.
 * Se llama una sola vez desde el hook de autenticación.
 */
export const seedDefaultCategories = async (userId: string): Promise<void> => {
  const ref = getCategoriesRef(userId)
  const snapshot = await getDocs(ref)

  // Si ya tiene categorías, no precargar
  if (!snapshot.empty) return

  const batch = writeBatch(db)
  const now = new Date().toISOString()

  ALL_CATEGORIES.forEach((cat, index) => {
    const docRef = doc(ref)
    batch.set(docRef, {
      label: cat.label,
      type: cat.type,
      color: CHART_COLORS[index % CHART_COLORS.length],
      icon: cat.icon,
      userId,
      createdAt: now,
    })
  })

  await batch.commit()
}

/**
 * Crea una nueva categoría personalizada.
 */
export const createCategory = async (
  userId: string,
  data: { label: string; type: TransactionType; color: string; icon: string }
): Promise<string> => {
  const docRef = await addDoc(getCategoriesRef(userId), {
    ...data,
    userId,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

/**
 * Actualiza el nombre y/o color de una categoría existente.
 */
export const updateCategory = async (
  userId: string,
  categoryId: string,
  data: { label: string; color: string }
): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'categories', categoryId)
  await updateDoc(docRef, data)
}

/**
 * Elimina una categoría y todos los movimientos asociados a ella.
 * Primero busca las transacciones con esa categoría, las borra en batch,
 * y finalmente borra la categoría.
 */
export const deleteCategory = async (
  userId: string,
  categoryId: string
): Promise<void> => {
  // 1. Buscar transacciones con esta categoría
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    where('category', '==', categoryId)
  )
  const snapshot = await getDocs(q)

  // 2. Borrar todo en un batch
  const batch = writeBatch(db)
  snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref))
  batch.delete(doc(db, 'users', userId, 'categories', categoryId))
  await batch.commit()
}