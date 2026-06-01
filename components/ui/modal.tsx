'use client'

import { useEffect, useCallback } from 'react'
import type { FC, ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

const widthMap: Record<NonNullable<ModalProps['width']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  width = 'md',
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full ${widthMap[width]} max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-mint-border/20 px-6 py-4">
            <h2 className="text-lg font-semibold text-mint-text">{title}</h2>
            <button
              className="flex size-8 items-center justify-center rounded-full text-mint-muted transition hover:bg-mint-hover hover:text-mint-accent cursor-pointer"
              type="button"
              onClick={onClose}
              aria-label="关闭"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        )}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
