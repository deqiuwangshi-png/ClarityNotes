import { useState } from "react";
import { Modal } from "@/components/ui/modal";

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

function AccountTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-1 text-base font-semibold text-mint-text">个人信息</h3>
        <p className="mb-4 text-xs text-mint-muted">修改你的头像、用户名和邮箱地址</p>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-mint-accent text-xl font-bold text-white shadow-sm">用</div>
          <div>
            <button className="rounded-lg border border-mint-border/50 px-3 py-1.5 text-xs font-medium text-mint-text transition hover:bg-mint-hover cursor-pointer" type="button" onClick={() => console.log("【更换头像】")}>更换头像</button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-mint-muted">用户名</label>
            <input className="w-full rounded-xl border border-mint-border/30 bg-white px-4 py-2.5 text-sm text-mint-text outline-none focus:border-mint-accent focus:ring-1 focus:ring-mint-accent" defaultValue="临时账号" type="text" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-mint-muted">邮箱地址</label>
            <input className="w-full rounded-xl border border-mint-border/30 bg-white px-4 py-2.5 text-sm text-mint-text outline-none focus:border-mint-accent focus:ring-1 focus:ring-mint-accent" defaultValue="user@example.com" type="email" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold text-mint-text">通知偏好</h3>
        <p className="mb-4 text-xs text-mint-muted">管理你收到的通知类型</p>
      </div>
      {["文档更新通知", "评论与反馈"].map((label) => (
        <div key={label} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mint-text">{label}</p>
            <p className="text-xs text-mint-muted">当有人{label === "文档更新通知" ? "更新文档时" : "评论你的文档时"}发送通知</p>
          </div>
          <div className="h-6 w-10 rounded-full bg-mint-accent/30 cursor-pointer" />
        </div>
      ))}
    </div>
  );
}

function DevicesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold text-mint-text">已登录设备</h3>
        <p className="mb-4 text-xs text-mint-muted">管理你的设备和会话</p>
      </div>
      {[
        { name: "Windows 桌面端", time: "当前设备", active: true },
        { name: "iPhone 15 Pro", time: "2 天前", active: false },
        { name: "MacBook Pro", time: "5 天前", active: false },
      ].map((device) => (
        <div key={device.name} className="flex items-center justify-between rounded-xl border border-mint-border/20 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-mint-accent">{device.active ? "laptop" : "phone_iphone"}</span>
            <div>
              <p className="text-sm font-medium text-mint-text">{device.name}</p>
              <p className="text-xs text-mint-muted">{device.time}</p>
            </div>
          </div>
          {device.active ? (
            <span className="rounded-full bg-mint-accent/10 px-2.5 py-0.5 text-xs font-medium text-mint-accent">当前</span>
          ) : (
            <button className="text-xs font-medium text-red-500 hover:text-red-600 cursor-pointer" type="button" onClick={() => console.log(`【移除设备】${device.name}`)}>移除</button>
          )}
        </div>
      ))}
    </div>
  );
}
