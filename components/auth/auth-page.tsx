"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { useAuthTab } from "@/hooks/use-auth-tab";
import { AuthCard } from "@/components/auth/auth-card";
import { TabSwitcher } from "@/components/auth/tab-switcher";
import { AuthForm } from "@/components/auth/AuthForm";
import { SocialLogin } from "@/components/auth/SocialLogin";
import type { RegisterPayload } from "@/types/auth";

export default function AuthPage() {
  const { login, register, clearError } = useAuth();
  const { activeTab, switchTab } = useAuthTab(clearError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleLoginSubmit = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const result = await login(email, password);
        if (result.success) {
          router.push("/workspace");
        } else {
          setSubmitError(result.error || "登录失败，请重试");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [login, router],
  );

  const handleRegisterSubmit = useCallback(
    async (payload: RegisterPayload) => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const result = await register(payload);
        if (result.success) {
          router.push("/workspace");
        } else {
          setSubmitError(result.error || "注册失败，请重试");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [register, router],
  );

  return (
    <AuthCard>
      <TabSwitcher activeTab={activeTab} onSwitch={switchTab} />
      {submitError && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}
      <div className="mt-6 space-y-6">
        <AuthForm
          key={activeTab}
          type={activeTab}
          isSubmitting={isSubmitting}
          onSubmit={(payload) =>
            activeTab === "login"
              ? handleLoginSubmit(payload as { email: string; password: string; rememberMe?: boolean })
              : handleRegisterSubmit(payload as RegisterPayload)
          }
          serverError={submitError}
        />
        {activeTab === "login" && <SocialLogin disabled={isSubmitting} />}
      </div>
    </AuthCard>
  );
}
