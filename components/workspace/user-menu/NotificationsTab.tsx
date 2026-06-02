"use client";

export function NotificationsTab() {
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
