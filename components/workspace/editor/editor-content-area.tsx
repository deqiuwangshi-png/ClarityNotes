"use client";

import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import { EditorToolbar } from "@/components/workspace/editor/editor-toolbar";

interface EditorContentAreaProps {
  editor: Editor | null;
}

export function EditorContentArea({ editor }: EditorContentAreaProps) {
  return (
    <div className="prose-custom" data-editor-body="true">
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
