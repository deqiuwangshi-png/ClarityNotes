"use client";

interface SaveStatusBadgeProps {
  isSaved?: boolean;
  error?: string | null;
  savingText?: string;
  savedText?: string;
  errorText?: string;
}

export function SaveStatusBadge({
  isSaved = true,
  error,
  savingText = "保存中...",
  savedText = "已保存",
  errorText = "保存失败",
}: SaveStatusBadgeProps) {
  const statusText = error ? errorText : isSaved ? savedText : savingText;
  const dotClass = error ? "bg-red-500" : isSaved ? "bg-mint-accent" : "bg-yellow-500";
  const textClass = error ? "text-red-500" : "text-mint-muted";

  return (
    <span className={`flex items-center gap-1.5 text-xs ${textClass}`} title={error ?? statusText}>
      <span className={`inline-block size-1.5 rounded-full ${dotClass}`} />
      <span>{statusText}</span>
    </span>
  );
}
