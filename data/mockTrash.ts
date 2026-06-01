import type { TrashItemData } from "@/types/fileTree"

const initialTrashItems: TrashItemData[] = [
  { id: "trash-1", type: "folder", name: "旧版设计参考", count: 12, lastModified: "05/28 10:12", createdAt: "05/20 09:30" },
  { id: "trash-2", type: "file", name: "未命名笔记_草稿.md", lastModified: "05/24 16:45", createdAt: "05/23 14:20" },
  { id: "trash-3", type: "file", name: "2025年终总结.md", lastModified: "05/10 09:15", createdAt: "05/01 08:00" },
  { id: "trash-4", type: "folder", name: "废弃项目", count: 3, lastModified: "04/28 11:00", createdAt: "04/15 10:00" },
]

let memoryTrash: TrashItemData[] = [...initialTrashItems]

export function getTrash(): TrashItemData[] {
  return memoryTrash
}

export function setTrash(items: TrashItemData[]): void {
  memoryTrash = items
}

export function addToTrash(item: TrashItemData): void {
  memoryTrash.push(item)
}

export function removeFromTrash(id: string): void {
  memoryTrash = memoryTrash.filter((item) => item.id !== id)
}

export function clearTrash(): void {
  memoryTrash = []
}

export { initialTrashItems }
