"use client"

import { Modal } from "@/components/ui/modal"
import { useUiStore } from "@/store/uiStore"

export function ConfirmDialog() {
  const open = useUiStore((s) => s.confirmOpen)
  const config = useUiStore((s) => s.confirmConfig)
  const closeConfirm = useUiStore((s) => s.closeConfirm)

  if (!config) return null

  const confirmLabel = config.confirmLabel ?? "确认"
  const cancelLabel = config.cancelLabel ?? "取消"
  const isDanger = config.variant === "danger"

  return (
    <Modal open={open} onClose={() => closeConfirm(false)} title={config.title} width="sm">
      <div className="px-6 py-4">
        <p className="text-sm text-mint-muted">{config.message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-mint-border px-4 py-2 text-sm text-mint-muted transition hover:bg-mint-hover/60"
            type="button"
            onClick={() => closeConfirm(false)}
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm text-white transition ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-mint-primary hover:bg-mint-primary/90"
            }`}
            type="button"
            onClick={() => closeConfirm(true)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
