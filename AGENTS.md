# 心智笔记（ClarityNotes）— 项目规则

<!-- 本文件定义了 AI 助手在执行任务时必须遵守的项目规范。 -->

---

## 一、项目基本信息

| 属性 | 值 |
|------|-----|
| 项目名称 | 心智笔记（ClarityNotes） |
| 包管理器 | **pnpm**（禁止使用 npm/yarn） |
| 技术栈 | Next.js 16（App Router）+ React 19 + TypeScript 5 + Supabase |
| 样式方案 | Tailwind CSS v4（`@tailwindcss/postcss`） |
| 图标方案 | Material Symbols Outlined（Google Fonts CDN） |
| 字体方案 | Geist（默认正文）+ Inter（认证页/官网） |
| 路径别名 | `@/*` → `./*`（tsconfig.json paths） |
| ESLint | v9，使用 `eslint-config-next` |
| 开发模式 | `pnpm dev`（自动热更新，无需手动 build） |
| 构建命令 | `pnpm build` |
| 语法检查 | `pnpm lint` |

---

## 二、目录管理规范

### 2.1 根目录结构

```
├── proxy.ts              # ★ 请求入口 — Session 刷新 + Cookie 管理
│
├── app/                  # Next.js App Router 页面路由
│   ├── layout.tsx        # 根布局（AuthProvider + AppProviders + 字体 + 图标）
│   ├── page.tsx          # / 官网首页
│   ├── (auth)/           # 认证路由组
│   │   ├── layout.tsx    # 认证布局（已登录→跳转 /workspace）
│   │   └── login/page.tsx
│   ├── (main)/           # 受保护路由组
│   │   ├── layout.tsx    # AuthGuard 包裹
│   │   ├── workspace/page.tsx
│   │   └── trash/page.tsx
│   └── globals.css       # Tailwind 入口 + 全局变量 + 动画
│
├── components/           # 按类型分类（重要！）
│   ├── ui/               # 基础 UI 原子组件（Button, Input, Modal, Toast, ConfirmDialog...）
│   ├── layout/           # 布局组件（AuthGuard, AppProviders）
│   ├── landing/          # 官网模块组件
│   ├── auth/             # 认证模块组件
│   ├── workspace/        # 工作区模块组件（按功能分子目录）
│   │   ├── sidebar/      # FileTree, TreeItem, SearchBar, SearchResultsView, UserSection...
│   │   ├── content/      # FolderView, DocumentEditor
│   │   ├── editor/       # 编辑器子组件（header, body）
│   │   ├── dropdown/     # 顶栏下拉菜单
│   │   ├── common/       # Breadcrumb, SaveStatusBadge
│   │   ├── folder/       # 文件夹列表子组件
│   │   ├── trash/        # 回收站组件
│   │   ├── user-menu/    # 用户菜单组件
│   │   └── layout/       # SidebarLayout, SidebarContent, CollapsedTopBar, TopBarBreadcrumb
│
├── store/                # 状 态 层（Zustand）
│   ├── fileTreeStore.ts  # ★ 文件树核心状态
│   ├── editorStore.ts    # 编辑器状态（自动保存）
│   ├── trashStore.ts     # 回收站状态
│   ├── searchStore.ts    # 搜索状态
│   └── uiStore.ts        # UI 全局状态（确认弹窗等）
│
├── hooks/                # 自定义 React Hooks
│
├── lib/                  # 工具函数与共享逻辑
│   ├── services/         # 业 务 逻 辑 层（纯函数）
│   │   ├── auth-service.ts
│   │   ├── editorService.ts
│   │   ├── fileTreeService.ts
│   │   └── searchService.ts
│   ├── supabase/         # Supabase 客户端工厂
│   │   ├── client.ts     # 浏览器端 Supabase Client
│   │   ├── server.ts     # 服务端 Supabase Client
│   │   └── proxy.ts      # Session 管理（updateSession）
│   ├── auth-context.tsx  # 认证上下文（AuthProvider + useAuth）
│   ├── utils.ts          # cn() 类名合并
│   └── validators.ts     # 重导出 @/utils/validators
│
├── repositories/         # 数 据 访 问 层（Repository 模式）
│   ├── types.ts          # 接口定义 + 数据库行类型
│   ├── index.ts          # 统一导出 + Repository 实例
│   ├── supabase-auth.ts  # Supabase 认证
│   ├── supabase-fileTree.ts  # file_tree + documents 联表
│   ├── supabase-trash.ts     # trash 表 CRUD
│   ├── mock-users.ts     # 用户数据（Mock）
│   └── mock-session.ts   # Session 管理（Mock）
│
├── data/                 # Mock 数据（仅认证遗留，文件树/回收站已迁至 Supabase）
│   ├── mockUsers.ts      # 预设用户账号
│   └── session-mock.ts   # Session 模拟
│
├── types/                # TypeScript 类型定义
│   ├── auth.ts
│   ├── fileTree.ts
│   └── landing.ts
│
├── utils/                # 基础设施工具
│   ├── dateFormatter.ts
│   ├── editor.ts
│   ├── idGenerator.ts
│   ├── uid.ts
│   ├── validator.ts
│   └── validators.ts
│
├── constants/            # 常量配置
│   ├── fileTree.ts
│   ├── landing.ts
│   └── workspace.ts
│
├── docs/                 # 设计文档（参阅辅助文档，保证架构一致）
│   ├── 02架构设计.md
│   ├── 04.01认证架构.md
│   ├── 05.01应用主页架构.md
│   └── 1.sql             # ★ 唯一数据库建表脚本
│
└── public/               # 静态资源
```

### 2.2 组件分类原则

- **UI 原子组件**（`components/ui/`）：Button, Input, Checkbox, Modal, Toast, FloatingMenu, ConfirmDialog 等通用组件
- **模块组件**（`components/{module}/`）：按业务模块划分，如 auth、landing、workspace（含 trash、user-menu）
- **布局组件**（`components/layout/`）：AuthGuard, AppProviders 等页面框架组件
- 模块内按功能分子目录，如 `workspace/editor/`、`workspace/sidebar/`、`workspace/folder/`

### 2.3 导入路径规范

- 所有跨目录导入必须使用 `@/` 路径别名
- 同目录下推荐使用 `./` 导入
- 禁止使用深层相对路径如 `../../../`

---

## 三、开发约定

### 3.1 开发模式

- 开发服务器**已经通过 `pnpm dev` 启动并常驻后台**，AI 助手**禁止**自动执行 `pnpm build` 或 `pnpm dev`
- 内置 Turbopack 自动热更新（HMR），修改代码后**只需保存文件**，Next.js 会自动重新编译并更新浏览器
- 仅在需要生成生产版本或用户明确要求时，才执行 `pnpm build`
- 验证代码正确性只需运行 `pnpm lint`（ESLint 检查），无需 build

### 3.2 架构分层

项目采用**单向依赖**的严格分层架构，上层依赖下层，下层绝不依赖上层。

```
  ═══════════════════════════════════════════════════════════════════
  服务端入口 — proxy.ts（每次请求先经过，完成 Session 刷新 + 路由守卫）

  ┌──────────────────────────────────────────────────────────────┐
  │  ＵＩ 层  (components/ + app/)                               │
  │  只负责渲染和事件派发，不包含业务逻辑、数据存取                 │
  │  禁止 window.prompt/confirm，统一使用 uiStore + ConfirmDialog │
  │  示例：FileTree, TreeItem, Editor, FolderView, UserSection   │
  └────────────────────┬─────────────────────────────────────────┘
                       │ 调用 Zustand stores / useAuth()
  ┌────────────────────▼─────────────────────────────────────────┐
  │  状 态 层  (store/ + lib/auth-context.tsx + hooks/)          │
  │  Zustand stores 管理全局状态，auth-context 管理认证状态       │
  │  调用 services（业务逻辑）和 repositories（数据存取）           │
  │  示例：fileTreeStore, editorStore, trashStore, uiStore       │
  └────────────────────┬─────────────────────────────────────────┘
                       │ 调用
  ┌────────────────────▼─────────────────────────────────────────┐
  │  业 务 逻 辑 层  (lib/services/)                             │
  │  纯函数，实现所有业务规则：校验、树操作、搜索匹配、保存编排     │
  │  不依赖 React、DOM、状态管理，给定输入必定返回确定性输出        │
  │  示例：fileTreeService, editorService, auth-service          │
  └────────────────────┬─────────────────────────────────────────┘
                       │ 调用
  ┌────────────────────▼─────────────────────────────────────────┐
  │  数 据 访 问 层  (repositories/)                             │
  │  Repository 模式：接口 + Supabase/Mock 实现，封装所有数据存取  │
  │  上层不直接 import data/ 或 supabase client                   │
  │  示例：fileTreeRepo, trashRepo, supabaseAuthRepo, userRepo   │
  └────────────────────┬─────────────────────────────────────────┘
                       │ 调用 supabase.from() 或 data/
  ┌────────────────────▼─────────────────────────────────────────┐
  │  数 据 层  (Supabase PostgreSQL)                             │
  │  public.file_tree — 树结构（邻接表，ON DELETE CASCADE）       │
  │  public.documents — 文档内容（file_id FK 1:1，JSONB）         │
  │  public.trash     — 回收站（original_id 关联，30 天过期）     │
  │  public.profiles  — 用户画像（id = auth.users.id）            │
  │  认证：auth.users（Supabase Auth 管理）                        │
  └──────────────────────────────────────────────────────────────┘
        ═══════════════════════════════════════════════════════
        被所有层引用

  ┌──────────────────────────────────────────────────────────────┐
  │  基 础 设 施 层  (constants/, utils/, lib/utils.ts)          │
  │  通用工具：ID 生成、日期格式化、cn()、校验正则、常量           │
  └──────────────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────────────┐
  │  类 型 定 义 层  (types/)                                    │
  │  TypeScript 接口、类型别名，零依赖，被所有层引用               │
  └──────────────────────────────────────────────────────────────┘
```

| 层级 | 目录 | 职责 | 依赖 |
|------|------|------|------|
| **UI 层** | `components/` + `app/` | 纯展示组件，只负责渲染和派发事件，不包含业务逻辑。禁止 `window.prompt`/`confirm` | 依赖状态层 |
| **状态层** | `store/` + `lib/auth-context.tsx` + `hooks/` | 全局状态管理（Zustand + React Context），调用 services 和 repositories | 依赖业务逻辑层 |
| **业务逻辑层** | `lib/services/` | 纯函数，实现所有业务规则（校验、计算、树操作、编辑器保存编排等） | 依赖数据访问层 |
| **数据访问层** | `repositories/` | Repository 模式封装，接口 + Supabase/Mock 实现 | 依赖数据层 |
| **数据层** | Supabase PostgreSQL | `file_tree` + `documents` + `trash` + `profiles` 四表，RLS 安全策略 | 依赖基础设施层 |
| **基础设施层** | `lib/` / `utils/` / `constants/` | 类型定义、工具函数、常量、cn() 等 | 无依赖 |

### 3.3 组件编写约定

- 所有使用客户端功能（事件、状态、useEffect）的组件，文件顶部加 `"use client"`
- 纯展示组件（无交互逻辑）使用 Server Component，不加 `"use client"`
- 使用 `interface` 定义 Props，导出类型供外部引用
- 组件命名采用 PascalCase，文件命名采用 kebab-case
- 项目中已存在的 UI 组件（`components/ui/`）优先复用，不重复创建

### 3.4 样式约定

- 使用 Tailwind CSS v4 `@theme inline` 定义 CSS 变量
- 主题令牌统一在 `globals.css` 中定义，组件中直接使用 Token 类名
- 认证页使用 `auth-*` 令牌体系，其他页面使用 `mint-*` 令牌体系
- 动画类名如 `.page-transition-enter`、`.btn-transition` 统一在 `globals.css` 中定义
- 项目的所有 UI 样式（包括但不限于颜色、圆角、阴影、字体、间距、布局、动画、响应式断点、Tailwind 类名、CSS 变量等）已经是最终设计，严禁任何修改。

### 3.5 认证约定

- **入口守卫**：`proxy.ts`（根目录）— 每次请求先经过，完成 Session 刷新 + Cookie 管理
- **Supabase Auth**：认证由 Supabase Auth API 处理（`supabase.auth.signInWithPassword` / `signUp` / `signOut`）
- **客户端工厂**：`lib/supabase/client.ts`（浏览器端）、`lib/supabase/server.ts`（服务端）
- **Session 管理**：`lib/supabase/proxy.ts` 中的 `updateSession()`，Cookie 为 httpOnly
- **认证上下文**：`lib/auth-context.tsx`（React Context）
  - `useAuth()` → `{ user, isLoading, isAuthenticated, login, register, logout, authError, clearError }`
- **数据访问**：`repositories/supabase-auth.ts`（`ISupabaseAuthRepository` 接口实现）
  - `signIn(email, password)` / `signUp(email, password, fullName)` / `signOut()` / `getSession()`
- **路由守卫**：未登录→`/login`，已登录→`/workspace`（`AuthGuard` / `AuthLayout`）
- **密码安全**：密码由 Supabase 服务端 bcrypt 处理，永不到达前端业务代码
- **侧边栏用户信息**：`UserSection` 通过 `useAuth().user` 获取真实用户（不再通过 props 传递 mock 数据）

### 3.6 数据库约定

- **唯一建表脚本**：[docs/1.sql](file:///d:/Codex01/01/docs/1.sql)，项目中不再有其他 SQL 文件
- **四表设计**：
  - `public.profiles` — 用户画像（id = auth.users.id）
  - `public.file_tree` — 文件树结构（邻接表，UUID 主键，`ON DELETE CASCADE`）
  - `public.documents` — 文档内容（`file_id` FK 1:1，`JSONB` 存 TipTap DocNode）
  - `public.trash` — 回收站（独立表，`original_id` 关联，30 天自动过期）
- **触发器**：`handle_new_user()` 新用户注册自动创建 profile + 根文件夹"我的文档"；`handle_new_file()` 新建文件自动创建 documents 行
- **RLS**：所有表 `ENABLE ROW LEVEL SECURITY`，按 `user_id` 隔离
- **前端默认根节点**：`store/fileTreeStore.ts` 中 `DEFAULT_ROOT_ID = "__default_root__"`，当 DB 返回空树时前端注入占位根节点，首次创建子节点时自动持久化

### 3.7 代码风格

- 禁止添加不必要的注释
- 保持与现有代码一致的风格（模块导入顺序、JSX 格式化等）
- 使用 `cn()` 工具函数（`lib/utils.ts`）合并 Tailwind 类名
- **组件小而专**：每个组件只做一件事，超过 200 行即考虑拆分

### 3.8 核心原则

| 原则 | 说明 |
|------|------|
| **关注点分离** | UI、状态、业务逻辑、数据访问、数据严格分层，各层独立变化 |
| **依赖单向** | 上层依赖下层，下层绝不依赖上层。UI 层不直接 import 数据层 |
| **Repository 封装** | 数据访问统一通过 `@/repositories`，不直接 import `@/data/` 或 Supabase client |
| **纯函数优先** | 业务逻辑和数据操作尽可能写成纯函数，易于测试和复用 |
| **类型安全** | 全量 TypeScript，禁止 `any`，所有接口使用 `interface` / `type` 定义 |
| **组件小而专** | 每个组件只做一件事，超过 200 行即考虑拆分为更小的子组件 |
| **三表分离** | `file_tree`（结构）+ `documents`（内容）+ `trash`（回收站），FK CASCADE 保证一致性 |
| **RLS 安全** | 所有 Supabase 表 Row Level Security 已启用，按 `user_id` 或间接关联隔离 |
| **UI 零副作用** | UI 组件禁止 `window.prompt`/`confirm`，统一通过 `uiStore.openConfirm()` + `ConfirmDialog` |
| **用户来源统一** | 侧边栏等 UI 通过 `useAuth().user` 获取用户，不再传递 mock 数据 |

---

## 四、工作流程

执行任务时必须遵循以下工作流：

### 步骤 1：审查项目代码

- 分析整体目录结构，确认涉及的文件范围
- 检查现有组件是否存在，避免重复创建
- 确认该复用 `components/ui/` 中的组件而非新建

### 步骤 2：审阅设计文档

- 阅读 `docs/` 下对应的架构/组件拆分文档（如 `05.01应用主页架构.md`、`04.01认证架构.md`、`02架构设计.md`）
- 确认当前唯一数据库脚本为 `docs/1.sql`
- 确保理解设计令牌、页面交互、组件拆分方案

### 步骤 3：制定实现方案

- 确定需要创建/修改的文件列表
- 检查各文件的导入路径是否正确，遵守别名规范
- 确保文档与代码一致性——若发现文档与代码不一致，同时更新文档

### 步骤 4：实现代码

- 按计划创建/修改文件
- 优先复用现有 UI 组件
- 保持设计令牌一致
- Repository 接口不变原则：只改实现类，不改接口

### 步骤 5：更新文档

- 如果实现过程中变更了组件结构、接口或设计，同步更新对应的 `.md` 文档
- 确保 `docs/` 中的拆分文档与代码保持同步
- 避免架构漂移：AGENTS.md + docs/ 双来源互相印证

### 步骤 6：验证

- 运行 `pnpm lint`（ESLint 检查）
- 运行 `pnpm build`（确保无编译错误）
- 两个命令均通过后方可确认任务完成

---

## 五、关键技术决策

| 决策 | 选型 | 原因 |
|------|------|------|
| 状态管理 | Zustand + React Context | 轻量，与 Supabase async 流程良好配合 |
| 路由守卫 | AuthGuard 组件 + proxy.ts | client 路由 + server session 双重保护 |
| 侧边栏布局 | SidebarLayout → SidebarContent + CollapsedTopBar | 组件拆分，单一职责 |
| 数据访问 | Repository 模式 | 解耦 UI/状态层与数据层，切换实现只需改 `repositories/index.ts` |
| 认证 | Supabase Auth | 生产级 Auth，bcrypt 服务端处理，httpOnly Cookie |
| 数据库 | Supabase PostgreSQL | 四表分离 + RLS 安全 + pg_trgm 全文搜索 |
| 编辑器 | TipTap (ProseMirror) | JSONB 内容存储，富文本编辑 |
| 确认对话框 | uiStore + ConfirmDialog | 禁止 `window.confirm`/`prompt`，UI 层零副作用 |
| 架构文档 | AGENTS.md + docs/ 双来源 | 互相印证，防止架构漂移 |
