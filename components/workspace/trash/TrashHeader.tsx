import { Button } from "@/components/ui/button";

interface TrashHeaderProps {
  onEmptyAll?: () => void;
}

export function TrashHeader({ onEmptyAll }: TrashHeaderProps) {
  return (
    <header className="mb-10 flex h-20 items-end justify-between border-b border-mint-border/20 pb-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-mint-text">回收站</h1>
        <p className="text-xs text-mint-muted/70">
          文档与文件夹在删除后将保存在这里，清空后将无法找回。
        </p>
      </div>
      <div className="flex items-center">
        <Button
          variant="text"
          icon="delete_sweep"
          className="rounded-xl border border-red-200 bg-white px-4 text-red-600 shadow-sm hover:bg-red-50 hover:border-red-300"
          onClick={onEmptyAll}
        >
          清空回收站
        </Button>
      </div>
    </header>
  );
}
