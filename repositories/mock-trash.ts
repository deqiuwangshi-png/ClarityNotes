import type { TrashItemData } from "@/types/fileTree"
import type { ITrashRepository } from "@/repositories/types"
import {
  getTrash,
  setTrash,
  addToTrash,
  removeFromTrash,
  clearTrash,
} from "@/data/mockTrash"

export class MockTrashRepository implements ITrashRepository {
  getTrash(): TrashItemData[] {
    return getTrash()
  }

  setTrash(items: TrashItemData[]): void {
    setTrash(items)
  }

  addToTrash(item: TrashItemData): void {
    addToTrash(item)
  }

  removeFromTrash(id: string): void {
    removeFromTrash(id)
  }

  clearTrash(): void {
    clearTrash()
  }
}
