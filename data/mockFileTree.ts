import type { TreeNode } from "@/types/fileTree"

const initialTree: TreeNode[] = [
  {
    id: "folder-1",
    name: "我的文档",
    type: "folder",
    level: 1,
    expanded: true,
    createdAt: "01/01 00:00",
    updatedAt: "01/15 14:32",
    children: [
      {
        id: "folder-1-1",
        name: "随手笔记",
        type: "folder",
        level: 2,
        expanded: false,
        createdAt: "01/05 09:00",
        updatedAt: "01/10 16:00",
        children: [],
      },
      {
        id: "folder-1-2",
        name: "项目产品",
        type: "folder",
        level: 2,
        expanded: true,
        createdAt: "01/08 11:30",
        updatedAt: "01/14 16:20",
        children: [
          {
            id: "folder-1-2-1",
            name: "产品文档",
            type: "folder",
            level: 3,
            expanded: false,
            createdAt: "01/10 09:00",
            updatedAt: "01/12 10:00",
            children: [],
          },
          {
            id: "file-1-2-2",
            name: "需求分析",
            type: "file",
            level: 3,
            expanded: false,
            createdAt: "01/10 09:00",
            updatedAt: "01/15 14:32",
            wordCount: 1280,
          },
        ],
      },
      {
        id: "file-1-3",
        name: "会议纪要",
        type: "file",
        level: 2,
        expanded: false,
        createdAt: "01/12 08:00",
        updatedAt: "01/13 20:15",
        wordCount: 560,
      },
    ],
  },
]

let memoryTree: TreeNode[] = structuredClone(initialTree)

export function getTree(): TreeNode[] {
  return memoryTree
}

export function setTree(newTree: TreeNode[]): void {
  memoryTree = newTree
}

export function resetTree(): void {
  memoryTree = structuredClone(initialTree)
}

export { initialTree }
