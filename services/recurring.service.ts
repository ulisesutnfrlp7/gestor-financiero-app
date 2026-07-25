// Acceso a Firestore para las plantillas recurrentes y su ejecución segura.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { RecurringFormData, RecurringTemplate } from '@/types'
import { calculateNextExecutionDate } from '@/utils/recurrence'

const COLLECTION = 'recurringTemplates'
const TRANSACTIONS_COLLECTION = 'transactions'

type RecurringTemplateUpdate = Partial<RecurringFormData> &
  Pick<Partial<RecurringTemplate>, 'isActive' | 'nextExecutionDate' | 'lastGeneratedDate'>

const toDateString = (value: unknown): string => {
  if (value instanceof Timestamp) return value.toDate().toISOString().split('T')[0]
  return value as string
}

const toISOString = (value: unknown): string => {
  if (value instanceof Timestamp) return value.toDate().toISOString()
  return value as string
}

const mapTemplate = (id: string, data: DocumentData): RecurringTemplate => ({
  id,
  amount: data['amount'] as number,
  description: data['description'] as string,
  category: data['category'] as string,
  type: data['type'] as RecurringTemplate['type'],
  userId: data['userId'] as string,
  frequency: data['frequency'] as RecurringTemplate['frequency'],
  executionDay: (data['executionDay'] as number | null | undefined) ?? null,
  startDate: toDateString(data['startDate']),
  endDate: data['endDate'] == null ? null : toDateString(data['endDate']),
  isActive: data['isActive'] === true,
  lastGeneratedDate: data['lastGeneratedDate'] == null
    ? null
    : toDateString(data['lastGeneratedDate']),
  nextExecutionDate: toDateString(data['nextExecutionDate']),
  createdAt: toISOString(data['createdAt']),
  updatedAt: toISOString(data['updatedAt']),
})

export const subscribeToRecurringTemplates = (
  userId: string,
  onUpdate: (templates: RecurringTemplate[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const templatesQuery = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('nextExecutionDate', 'asc')
  )

  return onSnapshot(
    templatesQuery,
    (snapshot) => onUpdate(snapshot.docs.map((item) => mapTemplate(item.id, item.data()))),
    onError
  )
}

export const fetchRecurringTemplates = async (userId: string): Promise<RecurringTemplate[]> => {
  const templatesQuery = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('nextExecutionDate', 'asc')
  )
  const snapshot = await getDocs(templatesQuery)
  return snapshot.docs.map((item) => mapTemplate(item.id, item.data()))
}

export const createRecurringTemplate = async (
  userId: string,
  data: RecurringFormData
): Promise<string> => {
  const now = new Date().toISOString()
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    userId,
    isActive: true,
    lastGeneratedDate: null,
    nextExecutionDate: data.startDate,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}

export const updateRecurringTemplate = async (
  id: string,
  data: RecurringTemplateUpdate
): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export const deleteRecurringTemplate = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id))
}

/**
 * Genera una única ocurrencia si la plantilla continúa pendiente. El uso de una
 * transacción de Firestore vuelve la operación idempotente ante snapshots
 * repetidos o dos dispositivos abiertos con la misma cuenta.
 */
export const executeDueRecurringTemplate = async (
  id: string,
  userId: string,
  today: string
): Promise<boolean> => {
  const templateRef = doc(db, COLLECTION, id)

  return runTransaction(db, async (firestoreTransaction) => {
    const snapshot = await firestoreTransaction.get(templateRef)
    if (!snapshot.exists()) return false

    const template = mapTemplate(snapshot.id, snapshot.data())
    const isDue = template.nextExecutionDate <= today
    const isWithinEndDate = template.endDate === null || template.endDate >= today
    if (!template.isActive || template.userId !== userId || !isDue || !isWithinEndDate) {
      return false
    }

    const now = new Date().toISOString()
    const transactionRef = doc(collection(db, TRANSACTIONS_COLLECTION))
    const nextExecutionDate = calculateNextExecutionDate(template.nextExecutionDate, template)

    firestoreTransaction.set(transactionRef, {
      amount: template.amount,
      description: template.description,
      category: template.category,
      date: template.nextExecutionDate,
      type: template.type,
      userId: template.userId,
      isRecurring: true,
      createdAt: now,
      updatedAt: now,
    })
    firestoreTransaction.update(templateRef, {
      lastGeneratedDate: template.nextExecutionDate,
      nextExecutionDate,
      updatedAt: now,
    })

    return true
  })
}
