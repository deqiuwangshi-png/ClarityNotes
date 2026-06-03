import { create } from "zustand"

export interface ConfirmConfig {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
}

interface UiState {
  confirmOpen: boolean
  confirmConfig: ConfirmConfig | null
  confirmResolve: ((value: boolean) => void) | null

  openConfirm: (config: ConfirmConfig) => Promise<boolean>
  closeConfirm: (confirmed: boolean) => void
}

export const useUiStore = create<UiState>()((set, get) => ({
  confirmOpen: false,
  confirmConfig: null,
  confirmResolve: null,

  openConfirm: (config: ConfirmConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      set({
        confirmOpen: true,
        confirmConfig: config,
        confirmResolve: resolve,
      })
    })
  },

  closeConfirm: (confirmed: boolean) => {
    const { confirmResolve } = get()
    if (confirmResolve) {
      confirmResolve(confirmed)
    }
    set({
      confirmOpen: false,
      confirmConfig: null,
      confirmResolve: null,
    })
  },
}))
