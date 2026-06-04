"use client";

import { useRef, useEffect, useCallback } from "react";
import type { DocNode } from "@/types/fileTree";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { useEditorStore } from "@/store/editorStore";
import { useFileTreeStore } from "@/store/fileTreeStore";
import { EditorReadonly } from "@/components/workspace/editor/editor-readonly";
import { EditorTitle } from "@/components/workspace/editor/editor-title";
import { EditorContentArea } from "@/components/workspace/editor/editor-content-area";

const AUTO_SAVE_DELAY = 2000

interface EditorBodyProps {
  readOnly?: boolean
  externalTitle?: string
  externalContent?: DocNode
}

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Image,
  Placeholder.configure({ placeholder: "开始写点什么..." }),
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
];

export function EditorBody({ readOnly, externalTitle, externalContent }: EditorBodyProps) {
  const isSettingContent = useRef(false);
  const hasAutoFocused = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const content = useEditorStore((s) => s.content);
  const title = useEditorStore((s) => s.title);
  const setContent = useEditorStore((s) => s.setContent);
  const setTitle = useEditorStore((s) => s.setTitle);
  const performSave = useEditorStore((s) => s.performSave);
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId);
  const creatingNodeId = useFileTreeStore((s) => s.creatingNodeId);

  const isNewDocument = !readOnly && selectedNodeId === creatingNodeId;

  const scheduleSave = useCallback(() => {
    if (readOnly) return
    if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null
      if (selectedNodeId) performSave(selectedNodeId)
    }, AUTO_SAVE_DELAY)
  }, [readOnly, selectedNodeId, performSave])

  // 页面隐藏时立即保存（不等待防抖）
  useEffect(() => {
    if (readOnly) return
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (saveTimerRef.current !== null) {
          clearTimeout(saveTimerRef.current)
          saveTimerRef.current = null
        }
        if (selectedNodeId) performSave(selectedNodeId)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [readOnly, selectedNodeId, performSave])

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current)
    }
  }, [])

  const editor = useEditor({
    extensions,
    content: readOnly ? (externalContent ?? undefined) : undefined,
    editable: !readOnly,
    immediatelyRender: true,
    onUpdate: readOnly
      ? undefined
      : ({ editor: ed }) => {
          if (isSettingContent.current) return;
          setContent(ed.getJSON() as DocNode);
          scheduleSave();
        },
  });

  // 可编辑模式：content 不传入 useEditor，改由 effect 异步设置
  useEffect(() => {
    if (!editor || readOnly) return;
    isSettingContent.current = true;
    editor.commands.setContent(content);
    requestAnimationFrame(() => {
      isSettingContent.current = false;
    });
  }, [selectedNodeId, content]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isNewDocument && editor && !hasAutoFocused.current) {
      hasAutoFocused.current = true;
      editor.commands.focus("end");
    }
    if (!isNewDocument) {
      hasAutoFocused.current = false;
    }
  }, [isNewDocument, editor]);

  useEffect(() => {
    if (!editor || !readOnly || externalContent === undefined) return;
    editor.commands.setContent(externalContent ?? "");
  }, [externalContent, editor, readOnly]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (saveTimerRef.current !== null) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    if (selectedNodeId) performSave(selectedNodeId)
  }, [setTitle, selectedNodeId, performSave])

  if (readOnly) {
    const displayTitle = (externalTitle ?? "").replace(/\.md$/, "");
    return <EditorReadonly displayTitle={displayTitle} editor={editor} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-mint-bg" style={{ scrollbarGutter: "stable" }}>
      <div className="mx-auto max-w-[800px] px-6 py-6">
        <div className="editor-card p-10">
          <EditorTitle title={title} onTitleChange={handleTitleChange} autoFocus={isNewDocument} />
          <EditorContentArea editor={editor} />
        </div>
      </div>
    </div>
  );
}
