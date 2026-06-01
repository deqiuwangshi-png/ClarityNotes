import type { FC } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = 'center',
}) => {
  return (
    <div
      className={cn(
        'mb-14',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
      )}
    >
      <h2 className="text-display-md font-bold text-on-surface">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-on-surface-variant">
          {subtitle}
        </p>
      )}
    </div>
  )
}
