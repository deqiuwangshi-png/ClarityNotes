export interface User {
  id: string
  uid: string
  email: string
  phone?: string
  fullName: string
  avatar: string
  membership: 'free' | 'pro' | 'enterprise'
  createdAt: string
}

export type UserSession = Omit<User, 'password'>

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
