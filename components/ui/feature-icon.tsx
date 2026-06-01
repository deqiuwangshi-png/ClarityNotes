import type { FC } from 'react'
import { cn } from '@/lib/utils'

export interface FeatureIconProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-3xl',
} as const

export const FeatureIcon: FC<FeatureIconProps> = ({ name, size = 'md', className }) => {
  return (
    <span className={cn('material-symbols-outlined', sizeMap[size], className)}>
      {name}
    </span>
  )
}
