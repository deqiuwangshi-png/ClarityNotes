import { createClient } from '@/lib/supabase/client'
import type { INotificationRepository, NotificationPrefs } from '@/repositories/types'

export class SupabaseNotificationRepository implements INotificationRepository {
  async getPrefs(): Promise<NotificationPrefs> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('doc_update, comment')
      .single()

    if (error || !data) {
      return { docUpdate: true, comment: false }
    }

    return {
      docUpdate: data.doc_update,
      comment: data.comment,
    }
  }

  async updatePrefs(prefs: NotificationPrefs): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('notification_preferences')
      .upsert(
        { user_id: user.id, doc_update: prefs.docUpdate, comment: prefs.comment },
        { onConflict: 'user_id' },
      )
  }
}
