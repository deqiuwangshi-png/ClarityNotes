export function FolderListHeader() {
  return (
    <div className="mb-2 grid grid-cols-[1fr_140px_140px_40px] items-center gap-3 px-4 text-xs text-[#9CA3AF]">
      <span>文件名</span>
      <span className="text-right">最近编辑</span>
      <span className="text-right">创建时间</span>
      <span />
    </div>
  );
}
