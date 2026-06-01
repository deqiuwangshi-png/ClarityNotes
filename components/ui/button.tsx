import type { FC, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-on-primary shadow-soft hover:shadow-md hover:bg-primary/90',
  secondary:
    'border border-outline-variant bg-white/50 backdrop-blur-sm text-on-surface-variant hover:bg-surface-container',
  text: 'bg-transparent text-on-surface-variant hover:text-primary',
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-1.5 text-label-caps rounded-full',
  md: 'px-8 py-3 rounded-2xl text-body-md font-semibold',
  lg: 'px-10 py-4 rounded-2xl text-body-md font-semibold',
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className,
  children,
  ...props
}) => {
  const isIconOnly = !children && !!icon

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 btn-transition active:scale-95',
        variantStyles[variant],
        isIconOnly ? 'p-2' : sizeStyles[size],
        className,
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-[1.2em]">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[1.2em]">{icon}</span>
      )}
    </button>
  )
}
