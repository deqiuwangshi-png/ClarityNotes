"use client";

import { useState, useEffect, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { loadNotificationPrefs, saveNotificationPrefs } from "@/lib/services/notificationService";
import type { NotificationPrefs } from "@/repositories/types";

const notificationOptions: { label: string; description: string; key: keyof NotificationPrefs }[] = [
  {
    label: "文档更新通知",
    description: "当有人更新文档时发送通知",
    key: "docUpdate",
  },
  {
    label: "评论与反馈",
    description: "当有人评论你的文档时发送通知",
    key: "comment",
  },
];

export function NotificationsTab() {
  const [settings, setSettings] = useState<NotificationPrefs>({ docUpdate: true, comment: false });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadNotificationPrefs().then((prefs) => {
      setSettings(prefs);
      setLoaded(true);
    });
  }, []);

  const toggle = useCallback(async (key: keyof NotificationPrefs) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await saveNotificationPrefs(next);
  }, [settings]);

  if (!loaded) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-1 text-base font-semibold text-mint-text">通知偏好</h3>
          <p className="mb-4 text-xs text-mint-muted">管理你收到的通知类型</p>
        </div>
        <p className="text-xs text-mint-muted">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold text-mint-text">通知偏好</h3>
        <p className="mb-4 text-xs text-mint-muted">管理你收到的通知类型</p>
      </div>
      {notificationOptions.map(({ label, description, key }) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mint-text">{label}</p>
            <p className="text-xs text-mint-muted">{description}</p>
          </div>
          <Switch
            checked={settings[key]}
            onChange={() => toggle(key)}
            ariaLabel={label}
          />
        </div>
      ))}
    </div>
  );
}
