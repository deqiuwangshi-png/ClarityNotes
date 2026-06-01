import type { User } from "@/types/auth"

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    email: 'demo@claritynotes.com',
    password: 'demo1234',
    fullName: '演示用户',
    avatar: '演',
    membership: 'pro',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'user-002',
    email: 'admin@claritynotes.com',
    password: 'admin123',
    fullName: '管理员',
    avatar: '管',
    membership: 'enterprise',
    createdAt: '2025-02-20T10:30:00Z',
  },
  {
    id: 'user-003',
    email: 'test@claritynotes.com',
    password: 'test1234',
    fullName: '测试账号',
    avatar: '测',
    membership: 'free',
    createdAt: '2025-05-01T14:00:00Z',
  },
]

export function findUserByEmail(email: string): User | undefined {
  return MOCK_USERS.find((u) => u.email === email)
}

export function addUser(user: User): void {
  MOCK_USERS.push(user)
}
