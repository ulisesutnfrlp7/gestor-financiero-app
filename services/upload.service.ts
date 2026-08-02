// services/upload.service.ts
// Servicio de subida de imágenes a Cloudinary.
// Usa unsigned upload con upload preset (no requiere autenticación del lado del servidor).

/**
 * Sube una imagen a Cloudinary y devuelve la URL pública.
 *
 * @param uri - URI local de la imagen (file:// o content://)
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
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: `receipt_${Date.now()}.jpg`,
  } as any)
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