# BUG 清单总结

> **更新日期**：2026-06-03
> **关联文档**：`docs/1.sql`、`docs/13文件树架构.md`、`docs/02架构设计.md`

---

## BUG #1：根节点初始化失败 — FK 约束断裂导致无法创建子节点

| 属性 | 值 |
|------|-----|
| **风险等级** | 🔴 高（阻塞用户核心功能） |
| **状态** | ✅ 已修复 |
| **发现日期** | 2026-06-03 |
| **影响范围** | `auth.users` 中有记录但 `public.profiles` 中缺失的用户，无法创建任何文件/文件夹 |

### 现象描述

用户在"我的文档"根节点下点击"新建文档"或"新建文件夹"，浏览器控制台报错：

```
POST /rest/v1/file_tree?select=id  409 (Conflict)

响应:
  code: "23503"
  details: "Key is not present in table \"profiles\"."
  message: "insert or update on table \"file_tree\" violates foreign key constraint \"file_tree_user_id_fkey\""
```

前端提示："根节点初始化失败，请刷新页面重试"。

### 根本原因

`file_tree` 表的 `user_id` 列存在外键约束链：
```
file_tree.user_id → profiles.id → auth.users.id
```

`_ensureRealRoot()` 在创建根节点时直接调用 `fileTreeRepo.insertNode()`，未先确保 profiles 表中存在对应该用户的记录。若 `auth.users` 有用户但 `public.profiles` 缺失行（以下场景之一），FK 约束立即触发 `23503` 错误：

| 场景 | 说明 |
|------|------|
| 用户注册早于 `handle_new_user` 触发器安装 | `AFTER INSERT ON auth.users` 在用户注册后才创建，历史用户无 profile |
| 触发器 DROP/CREATE 窗口期注册 | 触发器的幂等重建过程中，处于窗口期的用户可能遗漏 |
| profile 被手动删除 | `ON DELETE CASCADE` 是单向的，删 profile 不影响 auth.users |

### 代码位置

| 层级 | 文件 | 行号 | 问题 |
|------|------|------|------|
| Store | [fileTreeStore.ts#L58-L64](file:///d:/Codex01/01/store/fileTreeStore.ts#L58) | `_ensureRealRoot` | 未确保 profile 存在就直接 `insertNode` |
| Repository | [supabase-fileTree.ts#L23-L42](file:///d:/Codex01/01/repositories/supabase-fileTree.ts#L23) | `insertNode` | 无 profile 存在性校验 |

### 修复方案（已实施）

三层防御：

#### 1. 数据库层 — 新增 `ensure_profile` RPC 函数

```sql
-- docs/1.sql 第 14 节
CREATE OR REPLACE FUNCTION public.ensure_profile(target_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, uid, email, full_name, avatar)
  SELECT
    au.id,
    substring(md5(random()::text), 1, 8),
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', ''),
    COALESCE(NULLIF(left(COALESCE(au.raw_user_meta_data->>'full_name', ''), 1), ''), '用')
  FROM auth.users au
  WHERE au.id = target_user_id
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

该函数幂等：profile 已存在时 `ON CONFLICT DO NOTHING`；不存在时从 `auth.users` 查找用户信息自动创建。

#### 2. Repository 层 — 新增 `ensureProfile` 方法

```typescript
// repositories/supabase-fileTree.ts
async ensureProfile(userId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.rpc('ensure_profile', { target_user_id: userId })
  if (error) throw error
}
```

接口同步更新：[repositories/types.ts](file:///d:/Codex01/01/repositories/types.ts) 中 `IFileTreeRepository` 新增 `ensureProfile(userId: string): Promise<void>`。

#### 3. Store 层 — `_ensureRealRoot` 先确保 profile 再创建根节点

```typescript
// store/fileTreeStore.ts — _ensureRealRoot
try {
  // 确保 profile 存在：修复 auth.users 有记录但 profiles 缺失导致的 FK 约束断裂
  await fileTreeRepo.ensureProfile(userId)

  return await fileTreeRepo.insertNode({
    user_id: userId,
    parent_id: null,
    name: "我的文档",
    type: "folder",
    level: 1,
    sort_order: 0,
  })
} catch { ... }
```

#### 4. 数据回填 — 修复历史用户

```sql
-- docs/1.sql 第 16 节 — 一次性执行，幂等安全
INSERT INTO public.profiles (id, uid, email, full_name, avatar)
SELECT
  au.id, substring(md5(random()::text), 1, 8), au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(NULLIF(left(COALESCE(au.raw_user_meta_data->>'full_name', ''), 1), ''), '用')
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
);
```

### 防御层级

| 层 | 机制 | 触发时机 |
|----|------|---------|
| 1 (SQL) | `ON CONFLICT DO NOTHING` | RPC 调用时，profile 已存在则跳过 |
| 2 (SQL) | 回填迁移脚本 | 修复 `handle_new_user` 遗漏的历史用户 |
| 3 (TS) | `_ensureRealRoot` 调用 `ensureProfile` | 每次创建根节点前 |
| 4 (TS) | 原始错误处理 + `loadTree` 回退 | 所有其他异常兜底 |

### 数据流（修复后）

```
用户点击新建 → _createNode()
  → _ensureRealRoot(parentId, userId)
    → parentId !== DEFAULT_ROOT_ID? → 直接返回（用户已有真实根节点）
    → 本地树已有 realRoot? → 直接返回
    → fileTreeRepo.ensureProfile(userId)  ← 新增：幂等确保 profile 存在
      → Supabase RPC ensure_profile
        → INSERT INTO profiles ... ON CONFLICT DO NOTHING
    → fileTreeRepo.insertNode(...)  ← 此时 FK 约束已满足
```

---

## 修复文件清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `docs/1.sql` | 新增第 14 节 + 第 16 节 | `ensure_profile` RPC 函数 + profile 回填脚本 |
| `repositories/types.ts` | 接口扩展 | `IFileTreeRepository` 新增 `ensureProfile` |
| `repositories/supabase-fileTree.ts` | 方法实现 | `ensureProfile` 调用 RPC |
| `store/fileTreeStore.ts` | 逻辑修复 | `_ensureRealRoot` 先调 `ensureProfile` 再插入根节点 |
