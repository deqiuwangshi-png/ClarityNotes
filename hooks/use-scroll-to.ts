"use client";

import { useCallback } from "react";

export function useScrollTo(): (href: string) => void {
  const scrollTo = useCallback((href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return scrollTo;
}
