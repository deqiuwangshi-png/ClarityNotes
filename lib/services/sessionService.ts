import { supabaseAuthRepo } from "@/repositories"
import type { UserSession } from "@/repositories/types"

export async function getUserSessions(): Promise<UserSession[]> {
  return supabaseAuthRepo.getSessions()
}

export async function removeUserSession(sessionId: string): Promise<void> {
  await supabaseAuthRepo.removeSession(sessionId)
}
