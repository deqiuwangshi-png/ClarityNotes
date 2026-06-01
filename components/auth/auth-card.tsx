import type { FC } from 'react'

export interface AuthCardProps {
  children: React.ReactNode
}

export const AuthCard: FC<AuthCardProps> = ({ children }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-[460px] rounded-2xl bg-white p-8 shadow-lg md:p-10">
        {children}
      </div>
    </main>
  )
}
