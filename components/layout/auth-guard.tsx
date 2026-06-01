"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hydrated = useHydrated();

  useEffect(() => {
    if (hydrated && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isLoading, isAuthenticated, router]);

  if (!hydrated || isLoading) {
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

  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex h-screen items-center justify-center bg-mint-bg">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-mint-accent animate-pulse">
            draw
          </span>
          <span className="text-sm text-mint-muted">正在跳转到登录页...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
