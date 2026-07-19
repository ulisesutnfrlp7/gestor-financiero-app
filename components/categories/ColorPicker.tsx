// components/categories/ColorPicker.tsx
// Selector de color simple: grilla de círculos táctiles.
// El usuario toca el círculo del color deseado.
// Sin arrastre, sin PanResponder, sin conflictos con ScrollView.

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

// Paleta de 35 colores vibrantes
const COLORS = [
  // Rojos y naranjas
  '#EF4444', '#F97316', '#FB923C', '#F59E0B', '#FBBF24',
  // Amarillos y verdes
  '#EAB308', '#22C55E', '#10B981', '#84CC16', '#34D399',
  // Verdes azulados y cyan
  '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  // Azules y morados
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E',
  // Rosas y adicionales
  '#F472B6', '#FB7185', '#E11D48', '#BE123C', '#9F1239',
  // Tonos pastel y adicionales
  '#A3E635', '#4ADE80', '#2DD4BF', '#38BDF8', '#818CF8',
  '#C084FC', '#E879F9',
]

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
      >
        {COLORS.map((c) => {
          const isSelected = color === c
          return (
            <TouchableOpacity
              key={c}
              onPress={() => onChange(c)}
              activeOpacity={0.7}
              style={{ width: 40, height: 40 }}
            >
              <View
                className="w-full h-full rounded-full"
                style={{
                  backgroundColor: c,
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: '#4F46E5',
                  transform: [{ scale: isSelected ? 1.15 : 1 }],
                }}
              />
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Preview del color seleccionado */}
      <View className="flex-row items-center justify-center mt-3">
        <View
          className="w-6 h-6 rounded-full mr-2 border border-gray-200"
          style={{ backgroundColor: color }}
        />
        <Text className="text-xs text-gray-500 font-mono">{color.toUpperCase()}</Text>
      </View>
    </View>
  )
}