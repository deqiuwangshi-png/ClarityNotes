"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get("token_hash");

  if (!tokenHash) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
            <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-on-surface">
          链接无效
        </h2>
        <p className="text-sm text-on-surface-variant">
          该密码重置链接无效或已过期，请重新发起密码重置请求。
        </p>
        <a
          href="/forgot-password"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          重新发起重置
        </a>
      </div>
    );
  }

  return <UpdatePasswordForm tokenHash={tokenHash} />;
}

export default function ResetPasswordPage() {
  return (
    <AuthCard>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <div className="size-10 animate-spin rounded-full border-4 border-mint-border border-t-mint-accent" />
          </div>
        }
      >
        <ResetPasswordInner />
      </Suspense>
    </AuthCard>
  );
}
