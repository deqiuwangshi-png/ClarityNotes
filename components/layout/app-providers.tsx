"use client"

import { type ReactNode } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ConfirmDialog />
    </>
  )
}
