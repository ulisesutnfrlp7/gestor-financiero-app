import { uploadReceipt } from '../../../services/upload.service'

describe('upload.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set env vars directly without reassigning process.env
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud'
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET = 'test-preset'
  })

  afterAll(() => {
    // Restore original .env values
    delete process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
    delete process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  })

  it('throws error when Cloudinary is not configured', async () => {
    delete process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
    delete process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    await expect(uploadReceipt('file:///test.jpg')).rejects.toThrow(
      'Cloudinary no está configurado'
    )
  })

  it('uploads image and returns secure_url on success', async () => {
    const mockResponse = { secure_url: 'https://res.cloudinary.com/test/image/upload/v123/test.jpg' }
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock

    const result = await uploadReceipt('file:///test.jpg')

    expect(result).toBe(mockResponse.secure_url)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.cloudinary.com/v1_1/test-cloud/image/upload',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    )
  })

  it('throws error when upload fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Bad request'),
      })
    ) as jest.Mock

    await expect(uploadReceipt('file:///test.jpg')).rejects.toThrow(
      'Error al subir imagen a Cloudinary: 400'
    )
  })
})