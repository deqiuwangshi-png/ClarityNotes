"use client";

import { useState, useCallback } from "react";

export interface UseAuthTabReturn {
  activeTab: "login" | "register";
  switchTab: (tab: "login" | "register") => void;
  isAnimating: boolean;
}

export function useAuthTab(onTabSwitch?: () => void): UseAuthTabReturn {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isAnimating, setIsAnimating] = useState(false);

  const switchTab = useCallback((tab: "login" | "register") => {
    onTabSwitch?.();
    setIsAnimating(true);
    setActiveTab(tab);
    setTimeout(() => setIsAnimating(false), 300);
  }, [onTabSwitch]);

  return { activeTab, switchTab, isAnimating };
}
