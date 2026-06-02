export interface UserInfo {
  displayName: string
  email: string
  avatarInitial: string
}

export interface TreeNode {
  id: string
  name: string
  type: "folder" | "file"
  level: number
  expanded: boolean
  children?: TreeNode[]
  createdAt?: string
  updatedAt?: string
  wordCount?: number
  content?: string
}

export interface BreadcrumbItem {
  id: string
  name: string
  isLast: boolean
}

export interface DocumentInfo {
  id: string
  title: string
  content: string
  createdAt: string
  lastModified: string
  isSaved: boolean
  wordCount?: number
}

export interface DropdownMenuItem {
  key: string
  label: string
  icon: string
}

export interface FolderItem {
  id: string
  name: string
  type: "folder" | "file"
  lastModified: string
  createdAt: string
}

export interface SearchResultItem {
  nodeId: string
  title: string
  path: BreadcrumbItem[]
  snippet: string
}

export interface TrashItemData {
  id: string
  type: "folder" | "file"
  name: string
  count?: number
  lastModified: string
  createdAt: string
  content?: string
  wordCount?: number
}

export type EditorMenuAction =
  | "quick-list"
  | "share"
  | "history"
  | "import"
  | "export"
  | "print"
  | "help"
