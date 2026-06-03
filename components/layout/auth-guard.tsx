"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-mint-bg">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-mint-accent animate-pulse">
            draw
          </span>
          <span className="text-sm text-mint-muted">加载中...</span>
        </div>
      </div>
    );
  }

  if (fallback) return <>{fallback}</>;

  return <>{children}</>;
}
