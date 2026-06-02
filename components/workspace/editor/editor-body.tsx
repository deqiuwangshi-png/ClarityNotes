"use client";

import { useRef, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { useFileTreeStore } from "@/store/fileTreeStore";

interface EditorBodyProps {
  readOnly?: boolean
  externalTitle?: string
  externalContent?: string
}

export function EditorBody({ readOnly, externalTitle, externalContent }: EditorBodyProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasLoadedRef = useRef(false);
  const content = useEditorStore((s) => s.content);
  const title = useEditorStore((s) => s.title);
  const setContent = useEditorStore((s) => s.setContent);
  const setTitle = useEditorStore((s) => s.setTitle);
  const saveNow = useEditorStore((s) => s.saveNow);
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId);

  useEffect(() => {
    hasLoadedRef.current = false;
  }, [selectedNodeId]);

  useEffect(() => {
    if (readOnly) return
    if (editorRef.current && content && !hasLoadedRef.current) {
      editorRef.current.innerHTML = content;
      hasLoadedRef.current = true;
    } else if (editorRef.current && !content && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
    }
  }, [content, selectedNodeId, readOnly]);

  if (readOnly) {
    const displayTitle = (externalTitle ?? "").replace(/\.md$/, "");
    const displayContent = externalContent ?? "";

    return (
      <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
        <div className="mx-auto max-w-[800px] px-6 py-6">
          <div className="editor-card p-10">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-mint-text">
              {displayTitle}
            </h1>
            <div
              className="prose-custom min-h-[200px] text-mint-text pointer-events-none select-none"
              data-editor-body="true"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-mint-bg" style={{ scrollbarGutter: "stable" }}>
      <div className="mx-auto max-w-[800px] px-6 py-6">
        <div className="editor-card p-10">
          <h1
            ref={titleRef}
            className="mb-6 cursor-text text-4xl font-bold tracking-tight text-mint-text outline-none transition-colors hover:text-mint-accent-light"
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

          <div
            ref={editorRef}
            className="prose-custom min-h-[400px] cursor-text text-mint-text outline-none"
            data-editor-body="true"
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
    </div>
  );
}
