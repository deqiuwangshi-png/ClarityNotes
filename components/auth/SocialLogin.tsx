"use client";

import { useAuth } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface SocialLoginProps {
  disabled?: boolean;
}

const PROVIDERS = [
  { provider: "google", label: "Google", icon: "cloud" },
  { provider: "apple", label: "Apple", icon: "phone_iphone" },
] as const;

export function SocialLogin({ disabled }: SocialLoginProps) {
  const { signInWithOAuth } = useAuth();

  const handleClick = async (provider: "google" | "apple") => {
    try {
      await signInWithOAuth(provider);
    } catch {
      // OAuth 流程会跳转页面，错误由 Supabase 处理
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-outline-variant/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-on-surface-variant">或者通过以下方式</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {PROVIDERS.map(({ provider, label, icon }) => (
          <button
            key={provider}
            onClick={() => handleClick(provider)}
            disabled={disabled}
            className={cn(
              "group flex items-center justify-center gap-3 rounded-xl border border-outline-variant bg-white py-3 transition-all hover:bg-surface",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface transition-transform group-hover:scale-110">
              {icon}
            </span>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
