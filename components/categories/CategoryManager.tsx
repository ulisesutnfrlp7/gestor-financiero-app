// components/categories/CategoryManager.tsx
// Modal de gestión de categorías personalizadas.
// Permite crear, editar y eliminar categorías.
// Se accede desde el ícono de engranaje en la pantalla de Historial.

import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFinanceStore, selectAllCategories } from '@/store/useFinanceStore'
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categories.service'

interface CategoryManagerProps {
  visible: boolean
  onClose: () => void
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  visible,
  onClose,
}) => {
  const userId     = useFinanceStore((state) => state.userId)
  const allCategories = useFinanceStore(selectAllCategories)
  const transactions = useFinanceStore((state) => state.transactions)
  const incomeCategories = useMemo(
    () => allCategories.filter((c) => c.type === 'income'),
    [allCategories]
  )
  const expenseCategories = useMemo(
    () => allCategories.filter((c) => c.type === 'expense'),
    [allCategories]
  )

  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<'income' | 'expense'>('expense')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  if (!userId) return null

  const handleCreate = async () => {
    const label = newLabel.trim()
    if (!label) return
    setIsCreating(true)
    try {
      await createCategory(userId, {
        label,
        type: newType,
        icon: newType === 'income' ? 'pricetag-outline' : 'ellipsis-horizontal-outline',
      })
      setNewLabel('')
    } catch {
      Alert.alert('Error', 'No se pudo crear la categoría.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (categoryId: string) => {
    const label = editLabel.trim()
    if (!label) return
    setIsEditing(true)
    try {
      await updateCategory(userId, categoryId, { label })
      setEditingId(null)
      setEditLabel('')
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la categoría.')
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = (categoryId: string, label: string) => {
    const count = transactions.filter((t) => t.category === categoryId).length
    const msg = count > 0
      ? `¿Eliminar "${label}"?\n\nSe eliminarán también ${count} movimiento${count !== 1 ? 's' : ''} asociado${count !== 1 ? 's' : ''} a esta categoría.\n\nEsta acción no se puede deshacer.`
      : `¿Eliminar "${label}"?\n\nEsta categoría no tiene movimientos asociados.\n\nEsta acción no se puede deshacer.`

    Alert.alert(
      'Eliminar Categoría',
      msg,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(userId, categoryId)
            } catch {
              Alert.alert('Error', 'No se pudo eliminar la categoría.')
            }
          },
        },
      ]
    )
  }

  const startEditing = (id: string, currentLabel: string) => {
    setEditingId(id)
    setEditLabel(currentLabel)
  }

  const renderCategory = (cat: { id: string; label: string }) => {
    const isEditingThis = editingId === cat.id

    return (
      <View
        key={cat.id}
        className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-3 mb-2"
      >
        {isEditingThis ? (
          <>
            <TextInput
              value={editLabel}
              onChangeText={setEditLabel}
              className="flex-1 text-gray-900 text-sm"
              autoFocus
              maxLength={30}
            />
            <TouchableOpacity
              onPress={() => handleUpdate(cat.id)}
              disabled={isEditing || !editLabel.trim()}
              className="ml-2 p-1"
            >
              {isEditing ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Ionicons name="checkmark" size={20} color="#4F46E5" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditingId(null)}
              className="ml-1 p-1"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className="flex-1 text-gray-900 text-sm">{cat.label}</Text>
            <TouchableOpacity
              onPress={() => startEditing(cat.id, cat.label)}
              className="ml-2 p-1"
            >
              <Ionicons name="pencil-outline" size={18} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(cat.id, cat.label)}
              className="ml-1 p-1"
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
            </TouchableOpacity>
          </>
        )}
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">
            Categorías
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5 pt-4">
          {/* Crear nueva categoría */}
          <View className="bg-white border border-gray-200 rounded-lg px-4 py-5 mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Nueva Categoría
            </Text>
            <View className="flex-row gap-2 mb-4">
              {(['expense', 'income'] as const).map((type) => {
                const isSelected = newType === type
                const activeClass = type === 'income'
                  ? 'bg-green-600 border-green-600'
                  : 'bg-red-600 border-red-600'
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setNewType(type)}
                    className={`flex-1 py-2.5 rounded-lg items-center border ${
                      isSelected ? activeClass : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-gray-500'
                    }`}>
                      {type === 'income' ? 'Ingreso' : 'Gasto'}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            <TextInput
              placeholder="Nombre de la categoría"
              value={newLabel}
              onChangeText={setNewLabel}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 mb-3"
              placeholderTextColor="#9CA3AF"
              maxLength={30}
            />
            <TouchableOpacity
              onPress={handleCreate}
              disabled={isCreating || !newLabel.trim()}
              className="bg-indigo-600 rounded-lg py-3 items-center"
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-sm font-semibold">Agregar Categoría</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Gastos */}
          <Text className="text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">
            Gastos
          </Text>
          {expenseCategories.length === 0 ? (
            <Text className="text-gray-400 text-sm mb-4">Sin categorías de gasto</Text>
          ) : (
            <View className="mb-6">
              {expenseCategories.map(renderCategory)}
            </View>
          )}

          {/* Ingresos */}
          <Text className="text-sm font-semibold text-green-600 mb-2 uppercase tracking-wide">
            Ingresos
          </Text>
          {incomeCategories.length === 0 ? (
            <Text className="text-gray-400 text-sm mb-4">Sin categorías de ingreso</Text>
          ) : (
            <View className="mb-8">
              {incomeCategories.map(renderCategory)}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}