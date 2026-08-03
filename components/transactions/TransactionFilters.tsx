// components/transactions/TransactionFilters.tsx
// Barra de filtros para el historial de movimientos.
// Filtra por tipo (ingreso/gasto), categoría y rango de fechas.
// Las fechas usan DateField (cross-platform).

import React, { useMemo, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { DateField } from '@/components/ui/DateField'
import type { TransactionType } from '@/types'
import { useFinanceStore, selectAllCategories } from '@/store/useFinanceStore'

export interface Filters {
  type: TransactionType | 'all'
  category: string
  dateFrom: string
  dateTo: string
  searchQuery: string
}

interface TransactionFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
}) => {
  const isWeb = Platform.OS === 'web'
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const allCategories = useFinanceStore(selectAllCategories)
  const categories = useMemo(
    () => allCategories.filter((c) => c.type === (filters.type === 'all' ? 'expense' : filters.type)),
    [allCategories, filters.type]
  )

  const setFilter = (partial: Partial<Filters>) => {
    onChange({ ...filters, ...partial })
  }

  const clearFilters = () => {
    onChange({ type: 'all', category: '', dateFrom: '', dateTo: '', searchQuery: '' })
  }

  const hasActiveFilters = filters.type !== 'all' || filters.category || filters.dateFrom || filters.dateTo || filters.searchQuery !== ''

  return (
    <View className="px-5 pb-3">
      {/* Fechas: siempre visibles para mantener layout estable */}
      <View className="flex-row items-stretch gap-2 mt-3 mb-4" style={{ zIndex: 2 }}>
        <View className="flex-1">
          <DateField
            value={filters.dateFrom}
            onChange={(value) => setFilter({ dateFrom: value })}
            className="h-11 justify-center px-3 py-2.5 rounded-lg border border-gray-200 bg-white"
            textClassName="text-sm text-gray-600"
            placeholder="Seleccionar fecha"
          />
        </View>
        <View className="flex-1">
          <DateField
            value={filters.dateTo}
            onChange={(value) => setFilter({ dateTo: value })}
            className="h-11 justify-center px-3 py-2.5 rounded-lg border border-gray-200 bg-white"
            textClassName="text-sm text-gray-600"
            placeholder="Seleccionar fecha"
          />
        </View>
      </View>

      {/* Búsqueda por descripción */}
      <View
        className={`flex-row items-center rounded-lg px-3 py-2 mb-4 bg-white ${
          isWeb ? '' : `border ${isSearchFocused ? 'border-indigo-500' : 'border-gray-200'}`
        }`}
        style={
          isWeb
            ? ({
                zIndex: 1,
                boxSizing: 'border-box',
                // borderWidth fijo en 1px para que el layout NO se mueva al enfocar.
                // En reposo el borderColor es transparente (invisible), en foco azul.
                borderWidth: 1,
                borderColor: isSearchFocused ? '#6366F1' : 'transparent',
                borderStyle: 'solid',
                boxShadow: 'none',
                WebkitBoxShadow: 'none',
                MozBoxShadow: 'none',
                outlineStyle: 'none',
                outlineWidth: 0,
                outlineColor: 'transparent',
                backgroundColor: '#FFFFFF',
              } as unknown as object)
            : { zIndex: 1 }
        }
      >
        <Ionicons name="search-outline" size={18} color="#4F46E5" />
        {isWeb ? (
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={filters.searchQuery}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            id="history-search-input"
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              color: '#111827',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              WebkitBoxShadow: 'none',
              MozBoxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              padding: 0,
            }}
          />
        ) : (
          <TextInput
            placeholder="Buscar por descripción..."
            value={filters.searchQuery}
            onChangeText={(text) => setFilter({ searchQuery: text })}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="flex-1 ml-2 text-sm text-gray-900"
            placeholderTextColor="#9CA3AF"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
            nativeID="history-search-input"
            testID="history-search-input"
          />
        )}
        {filters.searchQuery !== '' && (
          <TouchableOpacity onPress={() => setFilter({ searchQuery: '' })}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tipo */}
      <View className="flex-row gap-2 mb-6 mt-3">
        {(['all', 'expense', 'income'] as const).map((type) => {
          const isSelected = filters.type === type
          const label = type === 'all' ? 'Todos' : type === 'income' ? 'Ingresos' : 'Gastos'
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter({ type, category: '' })}
              className={`px-3 py-1.5 rounded-full border ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Categorías (solo cuando se filtra por un tipo específico) */}
      {filters.type !== 'all' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 mt-3">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setFilter({ category: '' })}
              className={`px-3 py-1.5 rounded-full border ${
                !filters.category
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  !filters.category ? 'text-white' : 'text-gray-600'
                }`}
              >
                Todas
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => {
              const isSelected = filters.category === cat.id
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setFilter({ category: cat.id })}
                  className={`px-3 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      )}

      {/* Botón limpiar filtros */}
      {hasActiveFilters && (
        <TouchableOpacity onPress={clearFilters} className="mt-2 self-start">
          <Text className="text-indigo-600 text-xs font-medium">Limpiar Filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}