import { notificationRepo } from "@/repositories"
import type { NotificationPrefs } from "@/repositories/types"

export async function loadNotificationPrefs(): Promise<NotificationPrefs> {
  return notificationRepo.getPrefs()
}

export async function saveNotificationPrefs(prefs: NotificationPrefs): Promise<void> {
  await notificationRepo.updatePrefs(prefs)
}
