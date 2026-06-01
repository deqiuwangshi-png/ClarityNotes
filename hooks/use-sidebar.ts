"use client";

import { useState, useCallback } from "react";

export interface UseSidebarReturn {
  collapsed: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
}

export function useSidebar(initialCollapsed = false): UseSidebarReturn {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const expand = useCallback(() => {
    setCollapsed(false);
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
  }, []);

  return { collapsed, toggle, expand, collapse };
}
