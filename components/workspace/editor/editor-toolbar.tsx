"use client";

import { useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";

interface EditorToolbarProps {
  editor: Editor;
}

function ToolbarButton({
  icon,
  title,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="flex size-8 items-center justify-center rounded-full text-mint-muted transition hover:bg-mint-hover hover:text-mint-accent aria-pressed:bg-mint-accent aria-pressed:text-white"
      title={title}
      aria-pressed={active}
      onClick={onClick}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const insertLink = useCallback(() => {
    const url = prompt("输入链接地址", "https://");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const insertCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed }) => {
        const { from, to } = ed.state.selection;
        return from !== to && ed.isEditable;
      }}
      options={{
        placement: "top",
        offset: { mainAxis: 10 } as Parameters<typeof import("@floating-ui/dom").offset>[0],
      }}
    >
      <div className="bubble-toolbar rounded-full bg-white/70 backdrop-blur-md py-1.5 px-3 shadow-soft flex items-center gap-1">
        <ToolbarButton
          icon="format_bold"
          title="加粗"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          icon="format_italic"
          title="斜体"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon="format_strikethrough"
          title="删除线"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <div className="mx-1 h-4 w-px bg-mint-border/50" />
        <ToolbarButton
          icon="link"
          title="链接"
          active={editor.isActive("link")}
          onClick={insertLink}
        />
        <ToolbarButton
          icon="code"
          title="行内代码"
          active={editor.isActive("code")}
          onClick={insertCode}
        />
      </div>
    </BubbleMenu>
  );
}
