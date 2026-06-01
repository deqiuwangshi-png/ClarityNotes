import type { FC } from 'react'
import { cn } from '@/lib/utils'

export interface SubmitButtonProps {
  label: string
  loading?: boolean
  disabled?: boolean
  className?: string
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  label,
  loading,
  disabled,
  className,
}) => {
  const isDisabled = loading || disabled

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={cn(
        'w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-on-primary shadow-md shadow-primary/10 transition-all',
        'hover:opacity-90',
        'active:scale-[0.98]',
        isDisabled && 'cursor-not-allowed opacity-80',
        className,
      )}
    >
      {loading ? '处理中...' : label}
    </button>
  )
}
