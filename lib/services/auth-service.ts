import type { User, RegisterPayload, AuthResponse } from "@/types/auth"
import { userRepo, sessionRepo } from "@/repositories"
import { generateUid } from "@/utils/uid"

function toSafeUser(user: User & { password: string }): User {
  return {
    id: user.id,
    uid: user.uid,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    avatar: user.avatar,
    membership: user.membership,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function validateLogin(email: string, password: string): AuthResponse {
  const mockUser = userRepo.findUserCredentials(email, password)
  if (mockUser) {
    return { success: true, user: toSafeUser(mockUser) }
  }
  return { success: false, error: "邮箱或密码错误，请重试" }
}

export function validateRegister(payload: RegisterPayload): AuthResponse {
  const existing = userRepo.findUserByEmail(payload.email)
  if (existing) {
    return { success: false, error: "该邮箱已被注册" }
  }
  const newUser: User & { password: string } = {
    id: `user-${Date.now()}`,
    uid: generateUid(),
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName,
    avatar: payload.fullName.charAt(0),
    membership: "free",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  userRepo.addUser(newUser)
  return { success: true, user: toSafeUser(newUser) }
}

export function createSession(user: User, rememberMe?: boolean): void {
  sessionRepo.createSession(user, rememberMe)
}

export function clearSession(): void {
  sessionRepo.clearSession()
}

export function getCurrentUser(): User | null {
  return sessionRepo.getCurrentUser()
}
