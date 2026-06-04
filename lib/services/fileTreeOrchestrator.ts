import type { TreeNode } from "@/types/fileTree"
import { fileTreeRepo, supabaseAuthRepo } from "@/repositories"
import { findNode, addChildToTree } from "@/lib/services/fileTreeService"
import { DEFAULT_ROOT_ID } from "@/constants/fileTree"

interface CreateNodeOrchestratorParams {
  parentId: string
  type: "file" | "folder"
  getTree: () => TreeNode[]
  setTree: (tree: TreeNode[]) => void
  onError: (msg: string) => void
}

interface CreateNodeResult {
  newNodeId: string
  newTree: TreeNode[]
}

async function ensureRealRoot(
  parentId: string,
  userId: string,
  getTree: () => TreeNode[],
  setTree: (tree: TreeNode[]) => void,
  onError: (msg: string) => void,
): Promise<string | null> {
  if (parentId !== DEFAULT_ROOT_ID) return parentId

  const tree = getTree()
  const realRoot = tree.find((n) => n.id !== DEFAULT_ROOT_ID && n.level === 1)
  if (realRoot) return realRoot.id

  try {
    await fileTreeRepo.ensureProfile(userId)
    return await fileTreeRepo.insertNode({
      user_id: userId,
      parent_id: null,
      name: "我的文档",
      type: "folder",
      level: 1,
      sort_order: 0,
    })
  } catch {
    const fresh = await fileTreeRepo.getTree()
    setTree(fresh.length > 0 ? fresh : [])
    onError("根节点初始化失败，请刷新页面重试")
    return null
  }
}

export async function createNodeOrchestrator(
  params: CreateNodeOrchestratorParams,
): Promise<CreateNodeResult | null> {
  const { parentId, type, getTree, setTree, onError } = params

  const session = await supabaseAuthRepo.getSession()
  const userId = session?.id ?? ""

  const realParentId = await ensureRealRoot(parentId, userId, getTree, setTree, onError)
  if (realParentId === null) return null

  const tree = getTree()
  const parent = findNode(tree, parentId)
  const level = parent ? parent.level + 1 : 2
  const sortOrder = parent?.children?.length ?? 0

  try {
    const newId = await fileTreeRepo.insertNode({
      user_id: userId,
      parent_id: realParentId,
      name: type === "file" ? "未命名文档" : "未命名文件夹",
      type,
      level,
      sort_order: sortOrder,
    })

    const newNode: TreeNode =
      type === "file"
        ? {
            id: newId,
            name: "未命名文档",
            type: "file",
            level,
            expanded: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            wordCount: 0,
          }
        : {
            id: newId,
            name: "未命名文件夹",
            type: "folder",
            level,
            expanded: true,
            children: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

    const newTree = addChildToTree(tree, realParentId, newNode, parentId === DEFAULT_ROOT_ID)
    setTree(newTree)
    return { newNodeId: newId, newTree }
  } catch {
    const fresh = await fileTreeRepo.getTree()
    setTree(fresh.length > 0 ? fresh : [])
    onError(`创建${type === "file" ? "文档" : "文件夹"}失败，请重试`)
    return null
  }
}
