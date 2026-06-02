"use client";

import { useRef, useEffect } from "react";

interface EditorTitleProps {
  title: string;
  onTitleChange: (title: string) => void;
  autoFocus?: boolean;
}

export function EditorTitle({ title, onTitleChange, autoFocus }: EditorTitleProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (autoFocus && titleRef.current) {
      titleRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <h1
      ref={titleRef}
      className="mb-6 cursor-text text-4xl font-bold tracking-tight text-mint-text outline-none transition-colors hover:text-mint-accent-light"
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const newTitle = e.currentTarget.textContent ?? title;
        if (newTitle !== title) {
          onTitleChange(newTitle);
        }
      }}
    >
      {title}
    </h1>
  );
}
