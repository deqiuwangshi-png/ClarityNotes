"use client";

import { cn } from "@/lib/utils";

interface SocialLoginProps {
  disabled?: boolean;
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
}

const SOCIAL_PROVIDERS = [
  { icon: "cloud", label: "Google", onClickKey: "onGoogleClick" as const },
  { icon: "phone_iphone", label: "Apple", onClickKey: "onAppleClick" as const },
] as const;

export function SocialLogin({ disabled, onGoogleClick, onAppleClick }: SocialLoginProps) {
  const handleSocialClick = (provider: typeof SOCIAL_PROVIDERS[number]) => {
    const handler = provider.onClickKey === "onGoogleClick" ? onGoogleClick : onAppleClick;
    if (handler) {
      handler();
    } else {
      alert("第三方登录演示模式");
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
        {SOCIAL_PROVIDERS.map((provider) => (
          <button
            key={provider.label}
            onClick={() => handleSocialClick(provider)}
            disabled={disabled}
            className={cn(
              "group flex items-center justify-center gap-3 rounded-xl border border-outline-variant bg-white py-3 transition-all hover:bg-surface",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface transition-transform group-hover:scale-110">
              {provider.icon}
            </span>
            <span className="text-sm font-medium">{provider.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
