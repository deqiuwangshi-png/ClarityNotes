"use client";

import { useCallback } from "react";

interface BubbleMenuProps {
  visible: boolean;
  position: { top: number; left: number } | null;
  above: boolean;
}

export function BubbleMenu({ visible, position, above }: BubbleMenuProps) {
  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    const sel = window.getSelection();
    if (sel && sel.rangeCount) sel.removeAllRanges();
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt("输入链接地址", "https://");
    if (url) document.execCommand("createLink", false, url);
  }, []);

  const insertCode = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString() || "code";
    document.execCommand("insertHTML", false,
      `<code class="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-red-600">${text}</code>`);
  }, []);

  if (!visible || !position) return null;

  const arrowClass = above
    ? "bottom-[-4px] border-t-white border-l-transparent border-r-transparent border-b-transparent"
    : "top-[-4px] border-b-white border-l-transparent border-r-transparent border-t-transparent";

  return (
    <div className="fixed z-100" style={{ top: position.top, left: position.left, transform: "translateX(-50%)", pointerEvents: visible ? "auto" : "none" }}>
      <div className={`relative rounded-xl bg-[#1e2522] px-1.5 py-1 shadow-2xl flex items-center gap-0.5 ${above ? "" : "flex-col-reverse"}`}>
        <div className="flex items-center gap-0.5">
          {["format_bold", "format_italic", "format_strikethrough"].map((icon) => (
            <button key={icon} className="flex size-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/10 hover:text-white" title={icon.replace("format_", "")} onClick={() => exec(icon === "format_bold" ? "bold" : icon === "format_italic" ? "italic" : "strikeThrough")}>
              <span className="material-symbols-outlined text-[16px]">{icon}</span>
            </button>
          ))}
          <div className="mx-1 h-4 w-px bg-white/15" />
          <button className="flex size-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/10 hover:text-white" title="链接" onClick={insertLink}>
            <span className="material-symbols-outlined text-[16px]">link</span>
          </button>
          <button className="flex size-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/10 hover:text-white" title="代码" onClick={insertCode}>
            <span className="material-symbols-outlined text-[16px]">code</span>
          </button>
        </div>
        <div className={`absolute ${arrowClass} border-[5px]`} />
      </div>
    </div>
  );
}
