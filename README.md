# ClarityNotes — 心智笔记

> **认知清晰，轻量至上** — 新一代笔记工具，为深度思考者设计。

ClarityNotes（心智笔记）是一款面向知识工作者的现代化笔记应用，聚焦于**认知减负**与**思维组织**。不同于功能堆砌的笔记工具，ClarityNotes 坚持"少即是多"的设计哲学，让用户将注意力回归内容本身，而非工具操作。

---

## 产品理念

> 笔记的本质不是记录，而是思考。

传统笔记工具容易陷入两个极端：要么过于简陋（纯文本），要么过于复杂（数据库、图谱、模板引擎）。ClarityNotes 找到了中间地带——**心智笔记**：

- **心智化** — 以文件夹+文档的树形结构组织知识，符合人类认知的层级分类本能
- **轻量优先** — 即开即用，零学习成本，不为"可能用得上的功能"牺牲核心体验
- **专注导向** — 沉浸式编辑环境，减少 UI 干扰，让思考流动起来
- **持久可靠** — 基于 Supabase 的企业级存储，内容自动保存，无需操心

> 认知科学家 Herbert Simon 说过："信息的丰富意味着注意力的贫乏。" ClarityNotes 的每一个设计决策都在保护用户的注意力资源。

---

## 核心功能

| 功能 | 描述 |
|------|------|
| **文件树导航** | 层级文件夹 + 文档，拖拽式管理知识结构 |
| **富文本编辑器** | 基于 TipTap/ProseMirror，支持标题、列表、代码块等常见格式 |
| **自动保存** | 2 秒防抖自动持久化，告别 Ctrl+S 的肌肉记忆 |
| **全文搜索** | 实时搜索文档标题和正文内容，支持拼音/模糊匹配 |
| **回收站** | 30 天保留期，误删可恢复 |
| **账户体系** | 邮箱注册/登录，会员管理，设备会话管理 |
| **通知偏好** | 细粒度的通知开关，不被无关信息打扰 |
| **暗色主题** | 薄荷绿护眼色系，降低长时间使用的视觉疲劳 |

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16 (App Router) + React 19 |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS v4 + Material Symbols |
| 状态 | Zustand + React Context |
| 富文本 | TipTap (ProseMirror) |
| 后端 | Supabase (PostgreSQL + Auth + Storage) |
| 包管理 | pnpm |

### 架构特色

项目采用**七层单向依赖**的严格分层架构：

```
UI 层 → 状态层 → 业务逻辑层 → 数据访问层 → 数据层
                                              ↑
基础设施层 ─────────────────────────────────────┘
类型定义层 ─────────────────────────────────────┘
```

每一层只依赖下层，绝不反向依赖。这种架构带来了：

- **可测试性** — 业务逻辑层是纯函数，无需 mock 即可测试
- **可替换性** — 数据访问层通过 Repository 接口注入，可在 Supabase / Mock / LocalStorage 间切换
- **可维护性** — 关注点严格分离，新功能只需在对应层级添加代码，不会牵一发而动全身

---

## 快速开始

```bash
# 1. 克隆仓库
git clone <repo-url>
cd claritynotes

# 2. 安装依赖（仅限 pnpm）
pnpm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 填入 Supabase URL 和 Anon Key（见下方说明）

# 4. 启动开发服务器
pnpm dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可体验。

### 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 数据库初始化

在 Supabase Dashboard 的 SQL Editor 中依次执行：

1. [`docs/1.sql`](docs/1.sql) — 核心表结构（profiles, file_tree, documents, trash + RLS + 触发器）
2. [`docs/2.sql`](docs/2.sql) — 补充功能（notification_preferences, storage bucket, 会话管理 RPC）

---

## 项目结构

```
├── app/                  # Next.js App Router 页面
│   ├── (auth)/           # 认证路由组（登录页）
│   ├── (main)/           # 受保护路由组（工作区、回收站）
│   └── layout.tsx        # 根布局
│
├── components/           # UI 组件
│   ├── ui/               # 原子组件（Button, Switch, Modal, Toast...）
│   ├── landing/          # 官网首页
│   ├── auth/             # 认证页
│   ├── workspace/        # 工作区（侧边栏、编辑器、文件夹视图）
│   └── layout/           # 布局组件
│
├── store/                # Zustand 状态管理
├── hooks/                # 自定义 Hooks
├── lib/                  # 工具函数 & 业务逻辑
│   ├── services/         # 业务逻辑层（纯函数）
│   └── supabase/         # Supabase 客户端工厂
├── repositories/         # 数据访问层（Repository 模式）
├── types/                # TypeScript 类型定义
├── constants/            # 常量配置
├── docs/                 # 设计文档 & SQL 脚本
└── public/               # 静态资源
```

---

## 联系与社区

| 方式 | 链接 |
|------|------|
| 项目主页 | [ClarityNotes](#) |
| 问题反馈 | [Issues](#) |
| 功能建议 | [Discussions](#) |
| 邮件联系 | [developer@claritynotes.app](mailto:developer@claritynotes.app) |

---

## 关于作者

ClarityNotes 是一个独立开发者的个人项目，源于对现有笔记工具的不满和"要有更好的工具"的信念。

> 我相信工具应该适应人的思维，而不是反过来。ClarityNotes 是我对"好工具"的一次实践——当一个工具足够简单时，它就不再是工具，而是思维的延伸。
>
> 这个项目从架构到视觉，从数据库到编辑器，全部亲手构建。技术选择服务于理念：Supabase 负责后端，让我专注于前端体验；Zustand 管理状态，保持逻辑纯粹；TipTap 处理富文本，提供 ProseMirror 的可靠性。

如果你认同这些理念，欢迎通过 Issues 或邮件交流。每一个反馈都是让 ClarityNotes 变得更好的契机。

---

## License

MIT © 2026 ClarityNotes
