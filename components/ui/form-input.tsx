import type { FC, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  error?: string
  rightSlot?: React.ReactNode
}

export const FormInput: FC<FormInputProps> = ({
  label,
  error,
  rightSlot,
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
      <input
        className={cn(
          'w-full rounded-xl border bg-white px-4 py-3 text-sm text-on-surface outline-none transition-all',
          error
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
            : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
        disabled={disabled}
        {...inputProps}
      />
      {error && (
        <p className="ml-1 mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  )
}
