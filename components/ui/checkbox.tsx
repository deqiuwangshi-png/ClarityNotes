import type { FC } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled,
  id,
}) => {
  return (
    <div className="flex items-center gap-2 px-1">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={cn(
          'size-4 rounded border-outline-variant text-primary focus:ring-primary',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          'text-sm text-on-surface-variant',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        )}
      >
        {label}
      </label>
    </div>
  )
}
