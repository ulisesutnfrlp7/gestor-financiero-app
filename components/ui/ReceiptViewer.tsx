// components/ui/ReceiptViewer.tsx
// Visor de imagen a pantalla completa (cross-platform).
// Usa <Modal> de React Native, que también funciona en react-native-web.
// Tocar la imagen/fondo o el botón X cierra el visor.

import React from 'react'
import { Modal, View, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface ReceiptViewerProps {
  visible: boolean
  uri: string
  onClose: () => void
}

export const ReceiptViewer: React.FC<ReceiptViewerProps> = ({ visible, uri, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
        }}
      >
        {/* Área táctil: tocar la imagen o el fondo cierra */}
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={1}
          style={{ flex: 1 }}
        >
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Botón cerrar */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          accessibilityLabel="Cerrar comprobante"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Modal>
  )
}