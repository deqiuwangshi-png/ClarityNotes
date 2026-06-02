"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { AccountTab } from "@/components/workspace/user-menu/AccountTab";
import { NotificationsTab } from "@/components/workspace/user-menu/NotificationsTab";
import { DevicesTab } from "@/components/workspace/user-menu/DevicesTab";

type SettingsTab = "account" | "notifications" | "devices";

interface AccountSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const TABS: { key: SettingsTab; label: string; icon: string }[] = [
  { key: "account", label: "账号设置", icon: "person" },
  { key: "notifications", label: "通知音效", icon: "notifications" },
  { key: "devices", label: "设备管理", icon: "devices" },
];

export function AccountSettingsDialog({ open, onClose }: AccountSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  return (
    <Modal open={open} onClose={onClose} title="账号设置" width="xl">
      <div className="flex h-[520px]">
        <aside className="flex w-[200px] shrink-0 flex-col border-r border-mint-border/10 bg-mint-bg/50 py-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "border-r-2 border-mint-accent bg-mint-hover/60 text-mint-accent"
                  : "text-mint-muted hover:bg-mint-hover/30 hover:text-mint-text"
              } cursor-pointer`}
              type="button"
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === "account" && <AccountTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "devices" && <DevicesTab />}
        </main>
      </div>
    </Modal>
  );
}
