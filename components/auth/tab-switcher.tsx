import type { FC } from 'react'
import { cn } from '@/lib/utils'

export interface TabSwitcherProps {
  activeTab: 'login' | 'register'
  onSwitch: (tab: 'login' | 'register') => void
}

export const TabSwitcher: FC<TabSwitcherProps> = ({ activeTab, onSwitch }) => {
  return (
    <div className="mb-8 flex rounded-xl bg-[#f1f5f1] p-1">
      <button
        className={cn(
          'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300',
          activeTab === 'login'
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-on-surface-variant hover:text-on-surface',
        )}
        onClick={() => onSwitch('login')}
      >
        登录
      </button>
      <button
        className={cn(
          'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300',
          activeTab === 'register'
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-on-surface-variant hover:text-on-surface',
        )}
        onClick={() => onSwitch('register')}
      >
        注册
      </button>
    </div>
  )
}
