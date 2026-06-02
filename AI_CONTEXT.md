# AI 上下文速查

> 仅包含 AI 编码所需的核心信息。详细文档见 [docs/08模块化文档.md](./docs/08模块化文档.md) 和 [docs/02架构设计.md](./docs/02架构设计.md)。

---

## 项目速览

| 项 | 值 |
|----|-----|
| 名称 | ClarityNotes（心智笔记） |
| 技术 | Next.js 16 + React 19 + TS + Tailwind v4 + Zustand |
| 包管理 | `pnpm`（禁 npm/yarn） |
| 路径别名 | `@/*` → `./*` |
| 架构 | 8 层单向依赖：UI → Store → Service → Repository → Data → Utils/Constants → Types |

---

## 路由

```
/              → app/page.tsx                      (LandingPage)
/login         → app/(auth)/login/page.tsx         (AuthPage, AuthLayout 已登录→跳 /workspace)
/workspace     → app/(main)/workspace/page.tsx     (AuthGuard 保护, SidebarLayout 包裹)
/trash         → app/(main)/trash/page.tsx         (同上)
/account       → AccountSettingsDialog (Modal)     (UserSection → UserMenu → 账号设置)
```

---

## Repository 实例（5 个，通过 `@/repositories` 导入）

```ts
import { userRepo, fileTreeRepo, trashRepo, workspaceRepo, sessionRepo } from "@/repositories"
```

| 实例 | 接口 | 关键方法 |
|------|------|----------|
| `userRepo` | `IUserRepository` | `findUserByEmail`, `addUser`, `updateUserInStorage` |
| `fileTreeRepo` | `IFileTreeRepository` | `getTree()`, `setTree(tree)`, `resetTree()` |
| `trashRepo` | `ITrashRepository` | `getTrash()`, `addToTrash(item)`, `removeFromTrash(id)`, `clearTrash()` |
| `workspaceRepo` | `IWorkspaceRepository` | `.mockUser` (UserInfo), `.mockMenuActions` (DropdownMenuItem[]) |
| `sessionRepo` | `ISessionRepository` | `createSession(user, rememberMe?)`, `clearSession()`, `getCurrentUser()`, `clearAllData()` |

---

## 核心类型

```ts
// 认证 (types/auth.ts)
interface User { id, uid, email, password, phone?, fullName, avatar, membership, createdAt }
interface RegisterPayload { fullName, email, password }
interface AuthResponse { success, user?, error? }

// 文件树 (types/fileTree.ts)
interface TreeNode { id, name, type: "folder"|"file", level, expanded, children?, createdAt?, updatedAt?, wordCount?, content? }
interface TrashItemData { id, name, type: "folder"|"file", deletedAt, createdAt, itemCount?, content?, wordCount? }
interface BreadcrumbItem { id, name, isLast }
interface FolderItem { id, name, type, lastModified, createdAt }
interface DocumentInfo { id, title, content, createdAt, lastModified, isSaved, wordCount? }
interface UserInfo { displayName, email, avatarInitial }
interface DropdownMenuItem { key, label, icon }
```

---

## Service 层签名

```ts
// lib/services/auth-service.ts
validateLogin(email: string, password: string): AuthResponse
validateRegister(payload: RegisterPayload): AuthResponse
createSession(user: User, rememberMe?: boolean): void
clearSession(): void
getCurrentUser(): User | null

// lib/services/userService.ts
validateOldPassword(user: User, oldPassword: string): boolean
updateUserInfo(user: User, updates: Partial<User>): User
clearAllUserData(): void

// lib/services/fileTreeService.ts
findNode(nodes: TreeNode[], id: string): TreeNode | null
getParent(nodes: TreeNode[], childId: string): TreeNode | null
getSiblingNames(nodes: TreeNode[], nodeId: string): string[]
buildBreadcrumb(tree: TreeNode[], targetId: string): BreadcrumbItem[]
createNode(tree, parentId, type, desiredName?): { newTree, createdNode } | { error }
renameNode(tree, nodeId, newName): { tree } | { error }
deleteNode(tree, nodeId, deleteChildren?): { newTree, deletedNode } | { error }
moveToTrash(tree, nodeId): { newTree, trashItem: TrashItemData } | { error }

// lib/services/editorService.ts
saveContent(tree, nodeId, content, wordCount): { tree } | { error }
updateTitle(tree, nodeId, newTitle): { tree } | { error }

// lib/services/trashService.ts
restoreItem(trashItem, tree, targetParentId?): { newTree, restoredId } | { error }
deletePermanently(trashId): void
emptyTrash(): void
batchRestore(items, tree): { newTree, restoredIds }
batchDelete(ids): void
```

---

## Zustand Store 形状

### fileTreeStore

| State | 类型 |
|-------|------|
| `tree` | `TreeNode[]` |
| `selectedNodeId` | `string \| null` |
| `expandedIds` | `Set<string>` |
| `currentView` | `"editor" \| "folder"` |
| `creatingNodeId` | `string \| null` |

| Action | 签名 |
|--------|------|
| `selectNode` | `(id: string) => void` |
| `toggleExpand` | `(id: string) => void` |
| `createFile` | `(parentId: string) => void` |
| `createFolder` | `(parentId: string) => void` |
| `commitRename` | `(nodeId: string, newName: string) => void` |
| `cancelCreate` | `(nodeId: string) => void` |
| `deleteNode` | `(nodeId: string) => void` |
| `setTree` | `(tree: TreeNode[]) => void` |
| `restoreFromTrash` | `(nodeId, trashStoreRestore) => void` |

| Derived Hook | 返回 |
|-------------|------|
| `useBreadcrumb()` | `BreadcrumbItem[]` |
| `useFolderItems()` | `FolderItem[]` |
| `useFolderName()` | `string` |
| `useDocumentInfo()` | `DocumentInfo \| null` |

### editorStore

| State | 类型 |
|-------|------|
| `content` | `string` |
| `title` | `string` |
| `wordCount` | `number` |
| `isSaved` | `boolean` |
| `isDirty` | `boolean` |

| Action | 签名 |
|--------|------|
| `loadEditorFromTree` | `(nodeId: string) => void` |
| `setContent` | `(html: string) => void` |
| `setTitle` | `(newTitle: string) => void` |
| `saveNow` | `() => void` |
| `cancelAutoSave` | `() => void` |

### trashStore

| State | 类型 |
|-------|------|
| `items` | `TrashItemData[]` |
| `isBatchMode` | `boolean` |
| `selectedIds` | `Set<string>` |

| Action | 签名 |
|--------|------|
| `refresh` | `() => void` |
| `enterBatchMode` | `(initialItemId?: string) => void` |
| `exitBatchMode` | `() => void` |
| `toggleSelectItem` | `(itemId: string) => void` |
| `toggleSelectAll` | `() => void` |
| `restoreItem` | `(itemId, fileTree) => { newTree } \| null` |
| `deletePermanently` | `(itemId: string) => void` |
| `emptyTrash` | `() => void` |
| `batchRestore` | `(fileTree) => { newTree } \| null` |
| `batchDelete` | `() => void` |

---

## useAuth() 接口

```ts
import { useAuth } from "@/lib/auth-context"

const {
  user,           // User | null
  isLoading,      // boolean
  isAuthenticated,// boolean
  login,          // (email, password, rememberMe?) => Promise<{ success, error? }>
  register,       // (payload: RegisterPayload) => Promise<{ success, error? }>
  logout,         // (clearAll?: boolean) => void   — clearAll=true 时清空所有数据
  updateUser,     // (updates: Partial<User>) => void
  authError,      // string | null
  clearError,     // () => void
} = useAuth()
```

---

## Hooks

| Hook | 位置 | 返回 |
|------|------|------|
| `useSidebar()` | `hooks/use-sidebar.ts` | `{ collapsed, toggle, expand, collapse }` |
| `useSidebarLayout()` | `components/workspace/layout/SidebarLayout.tsx` | `{ collapsed }` |
| `useAuthTab()` | `hooks/use-auth-tab.ts` | `{ activeTab, switchTab, isAnimating }` |

---

## 跨 Store 协作规则

| 谁 | 做什么 | 如何 |
|----|--------|------|
| `editorStore` 保存时 | 写回文件树 | `useFileTreeStore.getState()` 读取 tree/selectedNodeId，`setTree()` 写回 |
| `page.tsx` 选中节点 | 加载编辑器 | `editorStore.loadEditorFromTree(id)` 内部读 `fileTreeStore.getState().tree` |
| `fileTreeStore.deleteNode()` | 移到垃圾箱 | 调用 `trashRepo.addToTrash()` |
| `trash/page.tsx` 恢复 | 写回文件树 | `fileTreeStore.restoreFromTrash()` → `trashService.restoreItem()` |

---

## EditorBody 双模式

```ts
interface EditorBodyProps {
  readOnly?: boolean           // 只读模式（不显示交互元素，无 zustand 依赖）
  externalTitle?: string       // 只读模式下的标题（自动去 .md 后缀）
  externalContent?: string     // 只读模式下的 HTML 内容
}
```

- 正常模式：读写 contentEditable + zustand store + 2s 自动保存
- 只读模式：`pointer-events-none select-none` + `prose-custom` 排版，不使用 store

---

## 关键规则

1. 所有跨目录导入用 `@/` 别名，禁止深层相对路径
2. UI 层不能直接 import data/ 或 lib/services/，必须通过 store/hook
3. 数据层仅被 repositories/ 调用
4. 修改数据结构需同时更新 types/ → data/ → repositories/mock-*.ts
5. TrashItemData 需含 `content`/`wordCount` 以支持预览
6. SidebarLayout 折叠顶部栏：/workspace 显示 `<TopBarBreadcrumb />`，/trash 显示 "回收站" 文字
