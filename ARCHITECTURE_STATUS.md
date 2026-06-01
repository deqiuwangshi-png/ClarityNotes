# 架构状态文档

> 最后更新：2026-06-02
> 基于当前实际文件内容生成，遵循六层架构规范：类型定义层 → 基础设施层 → 数据层 → 业务逻辑层 → 状态层 → UI 层

---

## 总览

| 模块 | 类型层 | 基础设施层 | 数据层 | 业务逻辑层 | 状态层 | UI 层 | 总体状态 |
|------|--------|------------|--------|------------|--------|-------|----------|
| 官网 | ✅ | ✅ | N/A | N/A | N/A | ✅ | 已完成 |
| 认证 | ✅ | 🚧 | ✅ | ✅ | ✅ | ✅ | 已完成 |
| 应用主页 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 已完成 |
| 内容编辑器 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 已完成 |
| 垃圾箱 | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | 已完成 |
| 用户菜单 | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | 已完成 |

---

## 各模块详细说明

### 1. 官网 (Landing)

**总体状态**：✅ 已完成

官网为纯静态展示页面，不需要数据层、业务逻辑层和状态层。

| 层级 | 状态 | 文件 |
|------|------|------|
| 类型层 | ✅ | `types/landing.ts` — NavLink, HeroBadge, Feature, PhilosophyPoint, Testimonial, Stat, FooterLink, FooterSection |
| 基础设施层 | ✅ | `constants/landing.ts` — 所有静态常量使用 landing 类型标注 |
| 数据层 | N/A | 无数据存取需求 |
| 业务逻辑层 | N/A | 无业务逻辑 |
| 状态层 | N/A | 纯静态展示 |
| UI 层 | ✅ | `components/landing/` — Navbar, Footer, HeroSection, FeaturesSection, StatsSection, DesignPhilosophy, CTASection, ProductPreview, FeatureTag, Logo |

---

### 2. 认证 (Auth)

**总体状态**：✅ 已完成

认证模块使用 React Context（而非 Zustand）作为状态层，符合项目早期决策。

| 层级 | 状态 | 文件 |
|------|------|------|
| 类型层 | ✅ | `types/auth.ts` — User, LoginPayload, RegisterPayload, AuthResponse |
| 基础设施层 | 🚧 | `lib/validators.ts` — validateEmail, validatePassword, validateFullName, validateConfirmPassword（部分完成：无 auth 专属 constants） |
| 数据层 | ✅ | `data/mockUsers.ts` — MOCK_USERS, findUserByEmail, addUser |
| 业务逻辑层 | ✅ | `lib/services/auth-service.ts` — validateLogin, validateRegister, createSession, clearSession, getCurrentUser |
| 状态层 | ✅ | `lib/auth-context.tsx` — AuthProvider（Context）, useAuth() hook |
| UI 层 | ✅ | `components/auth/` — AuthForm, SocialLogin, auth-card, auth-page, tab-switcher |

---

### 3. 应用主页 (Workspace / 文件树 + 文件夹浏览)

**总体状态**：✅ 已完成

应用主页为六层架构最完整的模块，使用 Zustand 进行状态管理。

| 层级 | 状态 | 文件 |
|------|------|------|
| 类型层 | ✅ | `types/fileTree.ts` — TreeNode, BreadcrumbItem, DocumentInfo, FolderItem, TrashItemData, UserInfo, DropdownMenuItem, EditorMenuAction |
| 基础设施层 | ✅ | `constants/fileTree.ts` — MAX_DEPTH, ILLEGAL_CHARS_REGEX, DEFAULT_NAME, MAX_NAME_LENGTH<br>`utils/idGenerator.ts` — generateId<br>`utils/dateFormatter.ts` — formatTimestamp<br>`utils/validator.ts` — validateName, generateUniqueName |
| 数据层 | ✅ | `data/mockFileTree.ts` — initialTree, getTree, setTree, resetTree |
| 业务逻辑层 | ✅ | `lib/services/fileTreeService.ts` — findNode, getParent, getSiblingNames, buildBreadcrumb, createNode, renameNode, deleteNode, moveToTrash（9 个纯函数） |
| 状态层 | ✅ | `store/fileTreeStore.ts` — useFileTreeStore + 5 selector hooks（useSelectedNode, useFolderItems, useBreadcrumb, useDocumentInfo, useFolderName） |
| UI 层 | ✅ | `components/workspace/sidebar/` — FileTree, TreeItem, TreeItemMenu, UserSection, SearchBar, SidebarFooter<br>`components/workspace/layout/` — SidebarLayout, SidebarToggle<br>`components/workspace/folder/` — FolderListHeader, FolderListItem<br>`components/workspace/content/FolderView.tsx`<br>Props Drilling 已消除：SidebarLayout 4 props, FileTree 0 props, TreeItem 3 props |

---

### 4. 内容编辑器 (Editor)

**总体状态**：✅ 已完成

| 层级 | 状态 | 文件 |
|------|------|------|
| 类型层 | ✅ | `types/fileTree.ts` — TreeNode.content?: string, DocumentInfo |
| 基础设施层 | ✅ | `utils/editor.ts` — countWords(html), debounce |
| 数据层 | ✅ | `data/mockFileTree.ts` — TreeNode.content 字段持久化 |
| 业务逻辑层 | ✅ | `lib/services/editorService.ts` — saveContent, updateTitle（2 个纯函数） |
| 状态层 | ✅ | `store/editorStore.ts` — content, title, wordCount, isDirty, isSaved, loadFromNode, setContent, setTitle, saveNow, cancelAutoSave（2 秒防抖自动保存） |
| UI 层 | ✅ | `components/workspace/editor/` — EditorHeader, EditorBody（contentEditable 与 React 正确隔离）<br>`components/workspace/content/DocumentEditor.tsx` — 组合 EditorHeader + EditorBody + BubbleMenu<br>WorkspacePage useEffect 当选中文档变化时同步 content → editorStore |

---

### 5. 垃圾箱 (Trash)

**总体状态**：✅ 已完成

垃圾箱模块为六层架构完整模块，与文件树 store 双向联动。

| 层级 | 状态 | 文件 |
|------|------|------|
| 类型层 | ✅ | `types/fileTree.ts` — TrashItemData |
| 基础设施层 | N/A | 复用 fileTree 常量及 validator |
| 数据层 | ✅ | `data/mockTrash.ts` — getTrash, setTrash, addToTrash, removeFromTrash, clearTrash |
| 业务逻辑层 | ✅ | `lib/services/trashService.ts` — restoreItem, deletePermanently, emptyTrash, batchRestore, batchDelete（5 个纯函数） |
| 状态层 | ✅ | `store/trashStore.ts` — items, isBatchMode, selectedIds, refresh, enterBatchMode, exitBatchMode, toggleSelectItem, toggleSelectAll, restoreItem, deletePermanently, emptyTrash, batchRestore, batchDelete |
| UI 层 | ✅ | `components/workspace/trash/` — TrashHeader, TrashItem, FloatingBatchBar<br>`store/fileTreeStore.ts` — deleteNode 联动 moveToTrash + addToTrash，restoreFromTrash |

---

### 6. 用户菜单 (User Menu)

**总体状态**：✅ 已完成

用户菜单与认证模块共享类型层、数据层和业务逻辑层。

| 层级 | 状态 | 文件 |
|------|------|------|
| 类型层 | ✅ | `types/fileTree.ts` — UserInfo |
| 基础设施层 | N/A | 无专属常量/工具函数 |
| 数据层 | ✅ | `data/mockUsers.ts` — 与 Auth 共享 |
| 业务逻辑层 | ✅ | `lib/services/auth-service.ts` — createSession, clearSession, getCurrentUser（与 Auth 共享） |
| 状态层 | ✅ | `lib/auth-context.tsx` — useAuth() → user, logout（与 Auth 共享） |
| UI 层 | ✅ | `components/workspace/user-menu/` — UserMenu, AccountSettingsDialog, MembershipDialog |

---

## 模块依赖关系

```
应用主页 (Workspace)
├── 文件树 ←→ fileTreeStore ←→ fileTreeService ←→ mockFileTree
├── 文件夹浏览 ←── 复用文件树状态
├── 内容编辑器 ←→ editorStore ←→ editorService ←→ mockFileTree
│     ↕ 双向联动
│   WorkspacePage syncs content → editorStore.loadFromNode()
│   editorStore.saveContent() → fileTreeStore.setTree()
└── 垃圾箱 ←→ trashStore ←→ trashService ←→ mockTrash
      ↕ 双向联动
    fileTreeStore.deleteNode() → addToTrash()
    fileTreeStore.restoreFromTrash() ← trashStore.restoreItem()

认证 (Auth)          用户菜单 (User Menu)
└── auth-context ──────┘（共享 user 状态）

官网 (Landing)
└── 独立模块，无依赖其他业务模块
```

---

## 待重构优先级

| 优先级 | 模块 | 说明 |
|--------|------|------|
|  中 | 认证基础设施层 | `lib/validators.ts` 无 auth 专属 constants 文件 |
| 🟢 低 | 编辑器工具栏 | `document.execCommand` 已废弃，建议统一为 hook 管理 |
