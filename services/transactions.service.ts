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
  getDocs,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { uploadReceipt } from '@/services/upload.service'
import type { Transaction, TransactionFormData } from '@/types'

const COLLECTION = 'transactions'

/**
 * Suscripción en tiempo real a los movimientos del usuario.
 * Devuelve una función 'unsubscribe' que debe llamarse en el cleanup del useEffect.
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
          date:      data['date'] instanceof Timestamp
            ? data['date'].toDate().toISOString().split('T')[0]
            : (data['date'] as string),
          createdAt: data['createdAt'] instanceof Timestamp
            ? data['createdAt'].toDate().toISOString()
            : (data['createdAt'] as string),
          updatedAt: data['updatedAt'] instanceof Timestamp
            ? data['updatedAt'].toDate().toISOString()
            : (data['updatedAt'] as string),
          isRecurring: data['isRecurring'] === true,
          receiptUrl: data['receiptUrl'] as string | undefined,
        }
      })
      onUpdate(transactions)
    },
    onError
  )
}

/**
 * Obtiene todos los movimientos del usuario (one-shot, sin listener).
 */
export const fetchTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      amount:      data['amount'] as number,
      description: data['description'] as string,
      category:    data['category'] as string,
      type:        data['type'] as Transaction['type'],
      userId:      data['userId'] as string,
      date:      data['date'] instanceof Timestamp
        ? data['date'].toDate().toISOString().split('T')[0]
        : (data['date'] as string),
      createdAt: data['createdAt'] instanceof Timestamp
        ? data['createdAt'].toDate().toISOString()
        : (data['createdAt'] as string),
      updatedAt: data['updatedAt'] instanceof Timestamp
        ? data['updatedAt'].toDate().toISOString()
        : (data['updatedAt'] as string),
      isRecurring: data['isRecurring'] === true,
      receiptUrl: data['receiptUrl'] as string | undefined,
    }
  })
}

/**
 * Crea un nuevo movimiento en Firestore y devuelve su ID generado.
 * Si hay una URI de comprobante, la sube a Cloudinary primero.
 */
export const createTransaction = async (
  userId: string,
  data: TransactionFormData
): Promise<string> => {
  const now = new Date().toISOString()

  // Subir comprobante a Cloudinary si existe
  let receiptUrl: string | undefined
  if (data.receiptUri) {
    receiptUrl = await uploadReceipt(data.receiptUri)
  }

  const { receiptUri, ...cleanData } = data

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...cleanData,
    date: cleanData.date,
    ...(receiptUrl && { receiptUrl }),
    userId,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}

/**
 * Actualiza los campos de un movimiento existente.
 * Si hay una URI de comprobante nueva, sube la imagen a Cloudinary.
 * Si receiptUri es null, elimina el comprobante existente.
 */
export const updateTransaction = async (
  id: string,
  data: Partial<TransactionFormData>
): Promise<void> => {
  const docRef = doc(db, COLLECTION, id)

  const { receiptUri, ...cleanData } = data

  const updateData: Record<string, any> = {
    ...cleanData,
    updatedAt: new Date().toISOString(),
  }

  // Si hay una URI local nueva, subir a Cloudinary
  if (typeof receiptUri === 'string') {
    const receiptUrl = await uploadReceipt(receiptUri)
    updateData.receiptUrl = receiptUrl
  } else if (receiptUri === null) {
    // Si es null explícitamente, eliminar el comprobante
    updateData.receiptUrl = null
  }
  // Si es undefined, no tocar el campo (mantener el existente)

  await updateDoc(docRef, updateData)
}

/**
 * Elimina un movimiento de Firestore de forma permanente.
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id))
}