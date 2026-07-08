// services/transactions.service.ts
// Capa de acceso a datos: ÚNICA responsabilidad → hablar con Firestore.
// Las pantallas y el store NO importan Firebase directamente.
// Esto facilita el testing (mockear el servicio) y el cambio de backend.

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
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Transaction, TransactionFormData } from '@/types'

const COLLECTION = 'transactions'

/**
 * Suscripción en tiempo real a los movimientos del usuario.
 * Devuelve una función 'unsubscribe' que debe llamarse en el cleanup del useEffect.
 *
 * Se usa onSnapshot (listener) en lugar de getDocs (one-shot) para que la UI
 * se actualice automáticamente si otro dispositivo del mismo usuario agrega datos.
 */
export const subscribeToTransactions = (
  userId: string,
  onUpdate: (transactions: Transaction[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const transactions: Transaction[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          amount:      data['amount'] as number,
          description: data['description'] as string,
          category:    data['category'] as string,
          type:        data['type'] as Transaction['type'],
          userId:      data['userId'] as string,
          // Firestore puede devolver Timestamp o string según si se guardó con serverTimestamp o ISO
          date:      data['date'] instanceof Timestamp
            ? data['date'].toDate().toISOString().split('T')[0]
            : (data['date'] as string),
          createdAt: data['createdAt'] instanceof Timestamp
            ? data['createdAt'].toDate().toISOString()
            : (data['createdAt'] as string),
          updatedAt: data['updatedAt'] instanceof Timestamp
            ? data['updatedAt'].toDate().toISOString()
            : (data['updatedAt'] as string),
        }
      })
      onUpdate(transactions)
    },
    onError
  )
}

/**
 * Crea un nuevo movimiento en Firestore y devuelve su ID generado.
 */
export const createTransaction = async (
  userId: string,
  data: TransactionFormData
): Promise<string> => {
  const now = new Date().toISOString()
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    userId,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}

/**
 * Actualiza los campos de un movimiento existente.
 * Solo se actualizan los campos provistos (Partial).
 */
export const updateTransaction = async (
  id: string,
  data: Partial<TransactionFormData>
): Promise<void> => {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Elimina un movimiento de Firestore de forma permanente.
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id))
}
