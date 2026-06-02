"use client";

import { useRef, useEffect } from "react";
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

interface EditorBodyProps {
  readOnly?: boolean
  externalTitle?: string
  externalContent?: string
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
  const content = useEditorStore((s) => s.content);
  const title = useEditorStore((s) => s.title);
  const setContent = useEditorStore((s) => s.setContent);
  const setTitle = useEditorStore((s) => s.setTitle);
  const saveNow = useEditorStore((s) => s.saveNow);
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId);

  const editor = useEditor({
    extensions,
    content: readOnly ? (externalContent ?? "") : content,
    editable: !readOnly,
    onUpdate: readOnly
      ? undefined
      : ({ editor: ed }) => {
          if (isSettingContent.current) return;
          setContent(ed.getHTML());
        },
  });

  useEffect(() => {
    if (!editor || readOnly) return;
    isSettingContent.current = true;
    editor.commands.setContent(content);
    requestAnimationFrame(() => {
      isSettingContent.current = false;
    });
  }, [selectedNodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!editor || !readOnly || externalContent === undefined) return;
    editor.commands.setContent(externalContent ?? "");
  }, [externalContent, editor, readOnly]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    saveNow();
  };

  if (readOnly) {
    const displayTitle = (externalTitle ?? "").replace(/\.md$/, "");
    return <EditorReadonly displayTitle={displayTitle} editor={editor} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-mint-bg" style={{ scrollbarGutter: "stable" }}>
      <div className="mx-auto max-w-[800px] px-6 py-6">
        <div className="editor-card p-10">
          <EditorTitle title={title} onTitleChange={handleTitleChange} />
          <EditorContentArea editor={editor} />
        </div>
      </div>
    </div>
  );
}
