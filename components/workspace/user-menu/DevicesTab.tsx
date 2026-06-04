"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserSessions, removeUserSession } from "@/lib/services/sessionService";
import type { UserSession } from "@/repositories/types";

function formatSessionTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} 分钟前`;
    }
    return `${hours} 小时前`;
  }
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString("zh-CN");
}

function parseDeviceName(ua: string | null): string {
  if (!ua) return "未知设备";
  if (ua.includes("Windows")) return "Windows 桌面端";
  if (ua.includes("Mac")) return "Mac 桌面端";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS 移动端";
  if (ua.includes("Android")) return "Android 移动端";
  if (ua.includes("Linux")) return "Linux 桌面端";
  return ua.slice(0, 30);
}

function getDeviceIcon(ua: string | null): string {
  if (!ua) return "devices";
  if (ua.includes("Windows")) return "laptop_windows";
  if (ua.includes("Mac")) return "laptop_mac";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "phone_iphone";
  if (ua.includes("Android")) return "android";
  return "devices";
}

export function DevicesTab() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getUserSessions().then((data) => {
      if (mounted) {
        setSessions(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleRemove = useCallback(async (sessionId: string) => {
    await removeUserSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-1 text-base font-semibold text-mint-text">已登录设备</h3>
          <p className="mb-4 text-xs text-mint-muted">管理你的设备和会话</p>
        </div>
        <p className="text-xs text-mint-muted">加载中...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-1 text-base font-semibold text-mint-text">已登录设备</h3>
          <p className="mb-4 text-xs text-mint-muted">管理你的设备和会话</p>
        </div>
        <p className="text-xs text-mint-muted">暂无设备信息</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold text-mint-text">已登录设备</h3>
        <p className="mb-4 text-xs text-mint-muted">管理你的设备和会话</p>
      </div>
      {sessions.map((session) => {
        const deviceName = parseDeviceName(session.userAgent);
        const iconName = getDeviceIcon(session.userAgent);
        return (
          <div key={session.id} className="flex items-center justify-between rounded-xl border border-mint-border/20 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-mint-accent">{iconName}</span>
              <div>
                <p className="text-sm font-medium text-mint-text">{deviceName}</p>
                <p className="text-xs text-mint-muted">{formatSessionTime(session.updatedAt)}{session.ip ? ` · ${session.ip}` : ''}</p>
              </div>
            </div>
            {session.isCurrent ? (
              <span className="rounded-full bg-mint-accent/10 px-2.5 py-0.5 text-xs font-medium text-mint-accent">当前</span>
            ) : (
              <button
                className="text-xs font-medium text-red-500 hover:text-red-600 cursor-pointer"
                type="button"
                onClick={() => handleRemove(session.id)}
              >
                移除
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
