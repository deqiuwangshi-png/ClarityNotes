import type {
  IUserRepository,
  IFileTreeRepository,
  ITrashRepository,
  ISessionRepository,
  ISupabaseAuthRepository,
  FileTreeRow,
  DocumentRow,
  TrashRow,
  FileTreeWithContent,
} from "@/repositories/types"

import { MockUserRepository } from "@/repositories/mock-users"
import { SupabaseFileTreeRepository } from "@/repositories/supabase-fileTree"
import { SupabaseTrashRepository } from "@/repositories/supabase-trash"
import { MockSessionRepository } from "@/repositories/mock-session"
import { SupabaseAuthRepository } from "@/repositories/supabase-auth"

export const userRepo: IUserRepository = new MockUserRepository()
export const fileTreeRepo: IFileTreeRepository = new SupabaseFileTreeRepository()
export const trashRepo: ITrashRepository = new SupabaseTrashRepository()
export const sessionRepo: ISessionRepository = new MockSessionRepository()
export const supabaseAuthRepo: ISupabaseAuthRepository = new SupabaseAuthRepository()

export type {
  IUserRepository,
  IFileTreeRepository,
  ITrashRepository,
  ISessionRepository,
  ISupabaseAuthRepository,
  FileTreeRow,
  DocumentRow,
  TrashRow,
  FileTreeWithContent,
}
