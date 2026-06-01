"use client";

import { useState, useCallback } from "react";

export interface UseAuthTabReturn {
  activeTab: "login" | "register";
  switchTab: (tab: "login" | "register") => void;
  isAnimating: boolean;
}

export function useAuthTab(): UseAuthTabReturn {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isAnimating, setIsAnimating] = useState(false);

  const switchTab = useCallback((tab: "login" | "register") => {
    setIsAnimating(true);
    setActiveTab(tab);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  return { activeTab, switchTab, isAnimating };
}
