import type { User } from "@/types/auth"

interface MockUser extends User {
  password: string
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-001',
    uid: 'A3fG9kL2',
    email: 'demo@claritynotes.com',
    password: 'demo1234',
    fullName: '演示用户',
    avatar: '演',
    membership: 'pro',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'user-002',
    uid: 'B7xM2qW5',
    email: 'admin@claritynotes.com',
    password: 'admin123',
    fullName: '管理员',
    avatar: '管',
    membership: 'enterprise',
    createdAt: '2025-02-20T10:30:00Z',
  },
  {
    id: 'user-003',
    uid: 'C9rT6pN1',
    email: 'test@claritynotes.com',
    password: 'test1234',
    fullName: '测试账号',
    avatar: '测',
    membership: 'free',
    createdAt: '2025-05-01T14:00:00Z',
  },
]

const SESSION_USER_KEY = "claritynotes_auth_user"

export function findUserByEmail(email: string): User | undefined {
  const found = MOCK_USERS.find((u) => u.email === email)
  if (!found) return undefined
  return stripPassword(found)
}

export function findUserCredentials(email: string, password: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.email === email && u.password === password)
}

export function getPasswordForUser(userId: string): string | undefined {
  return MOCK_USERS.find((u) => u.id === userId)?.password
}

export function updatePassword(userId: string, newPassword: string): void {
  const user = MOCK_USERS.find((u) => u.id === userId)
  if (user) user.password = newPassword
}

export function addUser(user: MockUser | User & { password: string }): void {
  MOCK_USERS.push(user as MockUser)
}

export function stripPassword(user: MockUser): User {
  return {
    id: user.id,
    uid: user.uid,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    avatar: user.avatar,
    membership: user.membership,
    createdAt: user.createdAt,
  }
}

export function getUserFromStorage(): User | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(SESSION_USER_KEY) ?? sessionStorage.getItem(SESSION_USER_KEY)
    if (stored) {
      return JSON.parse(stored) as User
    }
  } catch {
    localStorage.removeItem(SESSION_USER_KEY)
    sessionStorage.removeItem(SESSION_USER_KEY)
  }
  return null
}

export function updateUserInStorage(user: User): void {
  if (typeof window === "undefined") return
  const key = localStorage.getItem(SESSION_USER_KEY) ? SESSION_USER_KEY : sessionStorage.getItem(SESSION_USER_KEY) ? SESSION_USER_KEY : null
  if (!key) {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
    return
  }
  if (key === SESSION_USER_KEY) {
    localStorage.setItem(key, JSON.stringify(user))
  } else {
    sessionStorage.setItem(key, JSON.stringify(user))
  }
}
