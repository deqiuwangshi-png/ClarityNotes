"use client";

import { useRef, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { useFileTreeStore } from "@/store/fileTreeStore";

interface EditorBodyProps {
  createdAt: string;
  lastModified: string;
}

export function EditorBody({ createdAt, lastModified }: EditorBodyProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasLoadedRef = useRef(false);
  const content = useEditorStore((s) => s.content);
  const title = useEditorStore((s) => s.title);
  const wordCount = useEditorStore((s) => s.wordCount);
  const setContent = useEditorStore((s) => s.setContent);
  const setTitle = useEditorStore((s) => s.setTitle);
  const saveNow = useEditorStore((s) => s.saveNow);
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId);

  useEffect(() => {
    hasLoadedRef.current = false;
  }, [selectedNodeId]);

  useEffect(() => {
    if (editorRef.current && content && !hasLoadedRef.current) {
      editorRef.current.innerHTML = content;
      hasLoadedRef.current = true;
    } else if (editorRef.current && !content && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
    }
  }, [content, selectedNodeId]);

  return (
    <div className="flex-1 overflow-y-auto bg-white" style={{ scrollbarGutter: "stable" }}>
      <div className="mx-auto max-w-[720px] px-8 py-10">
        <h1
          ref={titleRef}
          className="mb-1 cursor-text text-4xl font-bold tracking-tight text-mint-text outline-none transition-colors hover:text-mint-accent-light"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const newTitle = e.currentTarget.textContent ?? title;
            if (newTitle !== title) {
              setTitle(newTitle);
              saveNow();
            }
          }}
        >
          {title}
        </h1>

        <div className="mb-8 flex items-center gap-4 text-xs text-mint-muted">
          <span>创建于 {createdAt}</span>
          <span className="h-3 w-px bg-mint-border/30" />
          <span>更新于 {lastModified}</span>
          <span className="h-3 w-px bg-mint-border/30" />
          <span>{wordCount} 字</span>
        </div>

        <div
          ref={editorRef}
          className="prose-custom min-h-[400px] cursor-text text-sm leading-relaxed text-mint-text outline-none"
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            if (editorRef.current) {
              setContent(editorRef.current.innerHTML);
            }
          }}
        />
      </div>
    </div>
  );
}
