import type {
  IFileTreeRepository,
  IDocumentRepository,
  ITrashRepository,
  ISupabaseAuthRepository,
  INotificationRepository,
  FileTreeRow,
  DocumentRow,
  TrashRow,
  FileTreeWithContent,
} from "@/repositories/types"

import { SupabaseFileTreeRepository } from "@/repositories/supabase-fileTree"
import { SupabaseDocumentRepository } from "@/repositories/supabase-document"
import { SupabaseTrashRepository } from "@/repositories/supabase-trash"
import { SupabaseAuthRepository } from "@/repositories/supabase-auth"
import { SupabaseNotificationRepository } from "@/repositories/supabase-notification"

export const fileTreeRepo: IFileTreeRepository = new SupabaseFileTreeRepository()
export const documentRepo: IDocumentRepository = new SupabaseDocumentRepository()
export const trashRepo: ITrashRepository = new SupabaseTrashRepository()
export const supabaseAuthRepo: ISupabaseAuthRepository = new SupabaseAuthRepository()
export const notificationRepo: INotificationRepository = new SupabaseNotificationRepository()

export type {
  IFileTreeRepository,
  IDocumentRepository,
  ITrashRepository,
  ISupabaseAuthRepository,
  INotificationRepository,
  FileTreeRow,
  DocumentRow,
  TrashRow,
  FileTreeWithContent,
}
