"use client";

interface SaveStatusBadgeProps {
  isSaved?: boolean;
  savingText?: string;
  savedText?: string;
}

export function SaveStatusBadge({ isSaved = true, savingText = "保存中...", savedText = "已保存" }: SaveStatusBadgeProps) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-mint-muted">
      <span className={`inline-block size-1.5 rounded-full ${isSaved ? "bg-mint-accent" : "bg-yellow-500"}`} />
      <span>{isSaved ? savedText : savingText}</span>
    </span>
  );
}
