import type { FC, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  error?: string
  rightSlot?: React.ReactNode
  /** 输入框内右侧插槽，用于放置图标按钮（如密码切换） */
  suffix?: React.ReactNode
}

export const FormInput: FC<FormInputProps> = ({
  label,
  error,
  rightSlot,
  suffix,
  disabled,
  className,
  ...inputProps
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-1">
        <label className="text-xs font-medium tracking-[0.02em] text-on-surface-variant">
          {label}
        </label>
        {rightSlot}
      </div>
      <div className="relative">
        <input
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3 text-sm text-on-surface outline-none transition-all',
            suffix && 'pr-10',
            error
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
              : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20',
            disabled && 'cursor-not-allowed opacity-60',
            className,
          )}
          disabled={disabled}
          {...inputProps}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="ml-1 mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  )
}
