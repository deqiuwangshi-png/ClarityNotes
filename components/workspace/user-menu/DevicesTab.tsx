"use client";

export function DevicesTab() {
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
