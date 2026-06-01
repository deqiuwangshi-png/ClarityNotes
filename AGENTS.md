# 心智笔记（ClarityNotes）— 项目规则

<!-- 本文件定义了 AI 助手在执行任务时必须遵守的项目规范。 -->

---

## 一、项目基本信息

| 属性 | 值 |
|------|-----|
| 项目名称 | 心智笔记（ClarityNotes） |
| 包管理器 | **pnpm**（禁止使用 npm/yarn） |
| 技术栈 | Next.js 16（App Router）+ React 19 + TypeScript 5 |
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
├── app/                  # Next.js App Router 页面路由
│   ├── layout.tsx        # 根布局（AuthProvider + 字体 + 图标）
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
│   ├── ui/               # 基础 UI 原子组件（Button, Input, Modal, Toast...）
│   ├── layout/           # 布局组件（Header, SidebarLayout, AuthGuard...）
│   ├── landing/          # 官网模块组件
│   ├── auth/             # 认证模块组件
│   ├── workspace/        # 工作区模块组件（按功能分子目录）
│   │   ├── file-tree/    # 文件树
│   │   ├── dropdown/     # 下拉菜单
│   │   ├── editor/       # 编辑器
│   │   ├── breadcrumb/   # 面包屑导航
│   │   └── folder/       # 文件夹浏览
│   ├── trash/            # 回收站模块组件
│   └── user-menu/        # 用户菜单模块组件
│
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具函数与共享逻辑
├── data/                 # Mock 数据与模拟 API
├── types/                # TypeScript 类型定义
├── docs/                 # 组件拆分文档与 HTML 原型
└── public/               # 静态资源
```

### 2.2 组件分类原则

- **UI 原子组件**（`components/ui/`）：Button, Input, Checkbox, Modal, Toast, DropdownMenu 等通用组件
- **模块组件**（`components/{module}/`）：按业务模块划分，如 auth、landing、workspace、trash、user-menu
- **布局组件**（`components/layout/`）：Header, SidebarLayout, AuthGuard 等页面框架组件
- 模块内按功能分子目录，如 `workspace/editor/`、`workspace/file-tree/`、`workspace/folder/`

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
┌─────────────────────────────────────────────┐
│               UI 层                          │  ← 组件：只负责展示、派发事件
│     components/ (FileTree, Editor, ...)      │
└─────────────────────────────────────────────┘
                      ↓ 调用
┌─────────────────────────────────────────────┐
│              状态层                          │  ← Zustand stores：存储全局状态 + 调用服务
│              store/ (useFileTreeStore)       │
└─────────────────────────────────────────────┘
                      ↓ 调用
┌─────────────────────────────────────────────┐
│            业务逻辑层                        │  ← 纯函数：实现所有业务规则
│          services/ (fileTreeService)         │
└─────────────────────────────────────────────┘
                      ↓ 调用
┌─────────────────────────────────────────────┐
│              数据层                          │  ← mock / localStorage 存取
│            data/ (mockData, storage)         │
└─────────────────────────────────────────────┘
                      ↓ 使用
┌─────────────────────────────────────────────┐
│           基础设施层                          │  ← 工具函数、常量、类型定义
│       utils/ / constants/ / types/           │
└─────────────────────────────────────────────┘
```

| 层级 | 目录 | 职责 | 依赖 |
|------|------|------|------|
| **UI 层** | `components/` | 纯展示组件，只负责渲染和派发事件，不包含业务逻辑 | 依赖状态层 |
| **状态层** | `hooks/` / `store/` | 全局状态管理（React Context / Zustand），调用服务层方法 | 依赖业务逻辑层 |
| **业务逻辑层** | `lib/services/` | 纯函数，实现所有业务规则（校验、计算、去重等） | 依赖数据层 |
| **数据层** | `data/` | Mock 数据、localStorage 存取、模拟 API | 依赖基础设施层 |
| **基础设施层** | `lib/` / `types/` / 工具文件 | 类型定义、工具函数、常量、cn() 等 | 无依赖 |

### 3.3 组件编写约定

- **纯前端项目**：所有组件均为前端组件，不涉及后端、数据库、API 服务器等复杂概念。数据通过 Mock 模拟，所有逻辑在浏览器中完成
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

- 认证上下文：`lib/auth-context.tsx`（唯一）
- 提供 `useAuth()` → `{ user, isLoading, isAuthenticated, login, register, logout, authError, clearError }`
- Mock 数据：`data/users-mock.ts`（预设 3 个账号）+ `data/auth-mock.ts`（模拟登录/注册）
- 路由守卫：未登录→`/login`，已登录→`/workspace`（`AuthGuard` / `AuthLayout`）

### 3.6 代码风格

- 禁止添加不必要的注释
- 保持与现有代码一致的风格（模块导入顺序、JSX 格式化等）
- 使用 `cn()` 工具函数（`lib/utils.ts`）合并 Tailwind 类名
- **组件小而专**：每个组件只做一件事，超过 200 行即考虑拆分

### 3.7 核心原则

| 原则 | 说明 |
|------|------|
| **关注点分离** | UI、状态、业务逻辑、数据、基础设施严格分层，各层独立变化 |
| **依赖单向** | 上层依赖下层，下层绝不依赖上层。UI 层不直接 import 数据层 |
| **纯函数优先** | 业务逻辑和数据操作尽可能写成纯函数，易于测试和复用 |
| **类型安全** | 全量 TypeScript，禁止 `any`，所有接口使用 `interface` / `type` 定义 |
| **组件小而专** | 每个组件只做一件事，超过 200 行即考虑拆分为更小的子组件 |

---

## 四、工作流程

执行任务时必须遵循以下工作流：

### 步骤 1：审查项目代码

- 分析整体目录结构，确认涉及的文件范围
- 检查现有组件是否存在，避免重复创建
- 确认该复用 `components/ui/` 中的组件而非新建

### 步骤 2：审阅设计文档

- 阅读 `docs/` 下对应的组件拆分文档（如 `04认证组件.md`）
- 阅读对应的 HTML 原型文件（如 `认证.html`）
- 确保理解设计令牌、页面交互、组件拆分方案

### 步骤 3：制定实现方案

- 确定需要创建/修改的文件列表
- 检查各文件的导入路径是否正确，遵守别名规范
- 确保文档与代码一致性——若发现文档与代码不一致，同时更新文档

### 步骤 4：实现代码

- 按计划创建/修改文件
- 优先复用现有 UI 组件
- 保持设计令牌一致

### 步骤 5：更新文档

- 如果实现过程中变更了组件结构、接口或设计，同步更新对应的 `.md` 文档
- 确保 `docs/` 中的拆分文档与代码保持同步

### 步骤 6：验证

- 运行 `pnpm lint`（ESLint 检查）
- 运行 `pnpm build`（确保无编译错误）
- 两个命令均通过后方可确认任务完成

---

## 五、关键技术决策

| 决策 | 选型 | 原因 |
|------|------|------|
| 状态管理 | React Context + Hooks | 纯前端 Mock 阶段无需外部状态库 |
| 路由守卫 | 自定义 AuthGuard 组件 | 简单可控，与 App Router 深度集成 |
| 侧边栏布局 | SidebarLayout 组件 | 统一 workspace/trash 的布局结构 |
| 模拟数据 | 手动 Mock | 前期开发不接入后端数据库 |
