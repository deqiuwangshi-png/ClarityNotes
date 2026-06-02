import type { TreeNode } from "@/types/fileTree"
import type { IFileTreeRepository } from "@/repositories/types"
import { getTree, setTree, resetTree } from "@/data/mockFileTree"

export class MockFileTreeRepository implements IFileTreeRepository {
  getTree(): TreeNode[] {
    return getTree()
  }

  setTree(newTree: TreeNode[]): void {
    setTree(newTree)
  }

  resetTree(): void {
    resetTree()
  }
}
