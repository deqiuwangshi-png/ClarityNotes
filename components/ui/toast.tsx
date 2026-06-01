'use client'

import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export const Toast: FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = requestAnimationFrame(() => setVisible(true))
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => {
      cancelAnimationFrame(showTimer)
      clearTimeout(hideTimer)
    }
  }, [duration, onClose])

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 rounded-2xl bg-primary px-6 py-3.5 text-on-primary shadow-elevation transition-all duration-300',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0',
      )}
    >
      <p className="text-body-md font-medium">{message}</p>
    </div>
  )
}
