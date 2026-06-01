export interface User {
  id: string
  email: string
  password: string
  fullName: string
  avatar: string
  membership: 'free' | 'pro' | 'enterprise'
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}
