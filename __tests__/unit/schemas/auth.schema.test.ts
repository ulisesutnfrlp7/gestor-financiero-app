import { loginSchema, registerSchema } from '../../../schemas/auth.schema'

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: '123456' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: '123456' })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '12345' })
    expect(result.success).toBe(false)
  })

  it('accepts password with exactly 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '123456' })
    expect(result.success).toBe(true)
  })
})

describe('registerSchema', () => {
  it('accepts valid register data with matching passwords', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
      confirmPassword: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rejects passwords that do not match', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
      confirmPassword: '654321',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const confirmIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'confirmPassword'
      )
      expect(confirmIssue).toBeDefined()
    }
  })

  it('rejects empty confirmPassword', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
      confirmPassword: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email in register', () => {
    const result = registerSchema.safeParse({
      email: 'invalid',
      password: '123456',
      confirmPassword: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short password in register', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: '12345',
      confirmPassword: '12345',
    })
    expect(result.success).toBe(false)
  })
})