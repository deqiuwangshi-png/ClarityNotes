"use client";

import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

interface EditorReadonlyProps {
  displayTitle: string;
  editor: Editor | null;
}

export function EditorReadonly({ displayTitle, editor }: EditorReadonlyProps) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
      <div className="mx-auto max-w-[800px] px-6 py-6">
        <div className="editor-card p-10">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-mint-text">
            {displayTitle}
          </h1>
          <div className="prose-custom read-only min-h-[200px] text-mint-text" data-editor-body="true">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
