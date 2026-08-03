// services/upload.service.ts
// Servicio de subida de imágenes a Cloudinary.
// Usa unsigned upload con upload preset (no requiere autenticación del lado del servidor).
//
// Multiplataforma:
//   - Nativo: recibe una URI local (file:// o content://) → se manda como archivo en FormData
//   - Web: recibe un data URI (data:image/...;base64,...) → se convierte a Blob/File

import { Platform } from 'react-native'

const IS_WEB = Platform.OS === 'web'

/**
 * Convierte un data URI (data:image/jpeg;base64,...) a un File (solo web).
 */
const dataUriToFile = (dataUri: string, filename: string): File => {
  const [meta, base64] = dataUri.split(',')
  const mimeMatch = meta.match(/data:(.*?);base64/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const byteString = atob(base64)
  const bytes = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i)
  }
  return new File([bytes], filename, { type: mimeType })
}

/**
 * Sube una imagen a Cloudinary y devuelve la URL pública.
 *
 * @param uri - URI de la imagen: file:// (nativo) o data URI (web)
 * @returns URL pública de la imagen en Cloudinary
 */
export const uploadReceipt = async (uri: string): Promise<string> => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary no está configurado. Verificá las variables de entorno.')
  }

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  const formData = new FormData()

  if (IS_WEB) {
    const file = dataUriToFile(uri, `receipt_${Date.now()}.jpg`)
    formData.append('file', file)
  } else {
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `receipt_${Date.now()}.jpg`,
    } as any)
  }

  formData.append('upload_preset', uploadPreset)

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al subir imagen a Cloudinary: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  return data.secure_url as string
}