// components/categories/CategoryManager.tsx
// Gestión de categorías personalizadas.
// Permite crear, editar y eliminar categorías.
//
// Se puede usar como:
//   - Modal (asScreen=false): desde el ícono engranaje en Historial
//   - Pantalla (asScreen=true): desde la tab "Categorías"

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
import { categorySchema, validateCategoryUniqueness } from '@/schemas/category.schema'
import { ColorPicker } from './ColorPicker'

interface CategoryManagerProps {
  visible?: boolean
  onClose?: () => void
  asScreen?: boolean
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  visible,
  onClose,
  asScreen = false,
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

  // Estado para crear
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<'income' | 'expense'>('expense')
  const [newColor, setNewColor] = useState('#FF0000')
  const [isCreating, setIsCreating] = useState(false)
  const [newError, setNewError] = useState('')

  // Estado para editar
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editColor, setEditColor] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editError, setEditError] = useState('')

  if (!userId) return null

  // ─── Crear ──────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    const result = categorySchema.safeParse({ label: newLabel.trim(), type: newType, color: newColor })
    if (!result.success) {
      setNewError(result.error.errors[0].message)
      return
    }

    const uniqueness = validateCategoryUniqueness(result.data, allCategories)
    if (!uniqueness.success) {
      setNewError(uniqueness.error)
      return
    }

    setNewError('')
    setIsCreating(true)
    try {
      await createCategory(userId, {
        label: result.data.label,
        type: result.data.type,
        color: result.data.color,
        icon: result.data.type === 'income' ? 'pricetag-outline' : 'ellipsis-horizontal-outline',
      })
      setNewLabel('')
      setNewColor('#FF0000')
      Alert.alert('Éxito', 'Categoría creada exitosamente.')
    } catch {
      Alert.alert('Error', 'No se pudo crear la categoría.')
    } finally {
      setIsCreating(false)
    }
  }

  // ─── Editar ─────────────────────────────────────────────────────────────────

  const handleUpdate = async (categoryId: string) => {
    const result = categorySchema.safeParse({ label: editLabel.trim(), type: 'expense', color: editColor })
    if (!result.success) {
      setEditError(result.error.errors[0].message)
      return
    }

    const original = allCategories.find((c) => c.id === categoryId)
    if (!original) return

    const dataWithType = { ...result.data, type: original.type }
    const uniqueness = validateCategoryUniqueness(dataWithType, allCategories, categoryId)
    if (!uniqueness.success) {
      setEditError(uniqueness.error)
      return
    }

    setEditError('')
    setIsEditing(true)
    try {
      await updateCategory(userId, categoryId, { label: result.data.label, color: result.data.color })
      setEditingId(null)
      setEditLabel('')
      setEditColor('')
      Alert.alert('Éxito', 'Categoría editada exitosamente.')
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la categoría.')
    } finally {
      setIsEditing(false)
    }
  }

  // ─── Eliminar ───────────────────────────────────────────────────────────────

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
              Alert.alert('Éxito', 'Categoría eliminada exitosamente.')
            } catch {
              Alert.alert('Error', 'No se pudo eliminar la categoría.')
            }
          },
        },
      ]
    )
  }

  // ─── Iniciar edición ────────────────────────────────────────────────────────

  const startEditing = (cat: { id: string; label: string; color: string }) => {
    setEditingId(cat.id)
    setEditLabel(cat.label)
    setEditColor(cat.color)
    setEditError('')
  }

  // ─── Render: item de categoría ──────────────────────────────────────────────

  const renderCategory = (cat: { id: string; label: string; color: string }) => {
    const isEditingThis = editingId === cat.id

    return (
      <View
        key={cat.id}
        className="bg-white border border-gray-200 rounded-lg px-3 py-3 mb-2"
      >
        {isEditingThis ? (
          <>
            <View className="flex-row items-center mb-2">
              <TextInput
                value={editLabel}
                onChangeText={(text) => {
                  setEditLabel(text)
                  if (editError) setEditError('')
                }}
                className={`flex-1 border rounded-lg px-3 py-2 text-sm text-gray-900 ${
                  editError ? 'border-red-400' : 'border-gray-200'
                }`}
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
                onPress={() => {
                  setEditingId(null)
                  setEditError('')
                }}
                className="ml-1 p-1"
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ColorPicker color={editColor} onChange={setEditColor} />
            {editError && (
              <Text className="text-red-500 text-xs mt-2">{editError}</Text>
            )}
          </>
        ) : (
          <View className="flex-row items-center">
            <View
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: cat.color }}
            />
            <Text className="flex-1 text-gray-900 text-sm">{cat.label}</Text>
            <TouchableOpacity
              onPress={() => startEditing(cat)}
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
          </View>
        )}
      </View>
    )
  }

  // ─── Contenido principal ────────────────────────────────────────────────────

  const content = (
    <ScrollView className="flex-1 px-5 pt-4" keyboardShouldPersistTaps="handled">
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

        <Text className="text-xs text-gray-500 mb-2">Nombre</Text>
        <TextInput
          placeholder="Nombre de la categoría..."
          value={newLabel}
          onChangeText={(text) => {
            setNewLabel(text)
            if (newError) setNewError('')
          }}
          className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-900 mb-3 ${
            newError ? 'border-red-400' : 'border-gray-200'
          }`}
          placeholderTextColor="#9CA3AF"
          maxLength={30}
        />

        <Text className="text-xs text-gray-500 mb-2">Color</Text>
        <ColorPicker color={newColor} onChange={setNewColor} />

        {newError && (
          <Text className="text-red-500 text-xs mt-3">{newError}</Text>
        )}

        <TouchableOpacity
          onPress={handleCreate}
          disabled={isCreating}
          className="bg-indigo-600 rounded-lg py-3 items-center mt-4"
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
  )

  // ─── Render: modal o pantalla ───────────────────────────────────────────────

  if (asScreen) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="px-5 pt-6 pb-2">
          <Text className="text-2xl font-bold text-gray-900">Categorías</Text>
        </View>
        {content}
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
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Categorías</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        {content}
      </View>
    </Modal>
  )
}