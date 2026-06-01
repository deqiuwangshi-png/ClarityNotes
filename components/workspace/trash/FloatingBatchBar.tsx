"use client";

interface FloatingBatchBarProps {
  selectedCount: number;
  isVisible: boolean;
  onCancel: () => void;
  onBatchRestore: () => void;
  onBatchDelete: () => void;
}

export function FloatingBatchBar({
  selectedCount,
  isVisible,
  onCancel,
  onBatchRestore,
  onBatchDelete,
}: FloatingBatchBarProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 rounded-2xl border border-[#2b3531] bg-[#1e2522] px-6 py-3.5 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-5 items-center justify-center rounded-full bg-mint-accent text-[11px] font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-gray-300">项已选中</span>
      </div>

      <div className="h-4 w-px bg-gray-700" />

      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="rounded-xl px-3.5 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/10 hover:text-white active:scale-95"
          type="button"
        >
          取消
        </button>

        <button
          onClick={onBatchRestore}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">restore</span>
          <span>恢复</span>
        </button>

        <button
          onClick={onBatchDelete}
          className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-red-500 active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">delete_forever</span>
          <span>确认删除</span>
        </button>
      </div>
    </div>
  );
}
