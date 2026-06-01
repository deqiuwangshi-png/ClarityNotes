"use client";

import { useState, useEffect, useCallback } from "react";

export interface UseTextSelectionReturn {
  visible: boolean;
  position: { top: number; left: number } | null;
  above: boolean;
  selectedText: string;
  clearSelection: () => void;
}

const BUBBLE_HEIGHT = 44;
const BUBBLE_MARGIN = 12;

export function useTextSelection(): UseTextSelectionReturn {
  const [visible, setVisible] = useState(false);
  const [above, setAbove] = useState(true);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedText, setSelectedText] = useState("");

  const clearSelection = useCallback(() => {
    setVisible(false);
    setPosition(null);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection();
      const text = selection?.toString() ?? "";

      if (text.length > 0 && selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const fitsAbove = rect.top > BUBBLE_HEIGHT + BUBBLE_MARGIN * 2;
        const top = fitsAbove
          ? rect.top - BUBBLE_HEIGHT - BUBBLE_MARGIN
          : rect.bottom + BUBBLE_MARGIN;
        const left = rect.left + rect.width / 2;

        setSelectedText(text);
        setAbove(fitsAbove);
        setPosition({ top, left });
        setVisible(true);
      } else {
        setVisible(false);
        setPosition(null);
        setSelectedText("");
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    window.addEventListener("scroll", handleSelectionChange, true);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("scroll", handleSelectionChange, true);
    };
  }, []);

  return { visible, position, above, selectedText, clearSelection };
}
