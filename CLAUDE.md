# Crimson — HTML 分享平台（主应用）

## 项目概述

HTML 代码片段分享平台的主应用，负责用户管理、分享创建/编辑、数据展示。

## 架构

三服务架构中的**管理端**：

- **crimson**（本项目）：Next.js，用户认证、分享管理、分析数据展示、截图文件存储与服务
- **crimson-render-rs**（独立服务）：Rust/Axum，渲染用户上传的 HTML 内容 + 后台定时刷写浏览数据（单进程 = Web + Worker）
- **crimson-screenshot-rs**（独立服务）：Rust，CDP 截图生成，通过远程 browserless 容器（:3333）

crimson 与 crimson-render-rs 拆分的核心原因是**安全**——用户上传的 HTML 可能包含恶意脚本，渲染服务部署在不同域名，通过浏览器同源策略实现沙箱隔离。两个 Rust 服务均使用 jemalloc + Cortex-A76 优化，Docker 部署在香橙派上。

## 部署

- **运行环境**：香橙派（ARM64）Docker 容器
- **部署脚本**：`deploy.sh`（本地构建镜像 → scp tar → 远端 load + run）
- **Docker 卷映射**：`-v /home/zwg/storage:/app/files`
- **截图文件路径**：容器内 `/app/files/screenshots/`，宿主机 `/home/zwg/storage/screenshots/`

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19
- **运行时**: Bun
- **数据库**: PostgreSQL (Drizzle ORM)
- **缓存**: Redis/Valkey (IORedis)
- **认证**: better-auth
- **UI**: shadcn/ui + Tailwind CSS 4
- **状态管理**: Zustand + React Query
- **表单**: React Hook Form + Zod

## 项目结构

```
app/           → Next.js 页面和 API 路由
components/    → React 组件（ShareDialog, ShareList, Layout 等）
lib/
  db/          → 数据库 schema 和查询
  viewTracking/→ 浏览分析记录
  shareProxy/  → 分享访问处理
  redisCache/  → Redis 缓存
  schemas/     → Zod 验证 schema
  screenshotQueue.ts → 截图任务入队（Redis LPUSH）
providers/     → Theme 和 Context providers
drizzle/       → 数据库迁移文件
files/screenshots/ → 截图文件存储（.jpg）
```

## 核心功能

- 用户注册/登录
- 创建分享（HTML 内容，支持文件上传或直接输入）
- 三种访问控制：公开 / 密码保护 / 私有
- 生成一次性 token 供 crimson-render-rs 验证访问
- 浏览分析数据展示（总浏览量、UV、每日统计）
- Bot/爬虫 OG 标签生成

### 截图预览功能

ShareCard 展示 HTML 内容的截图预览，架构如下：

1. **入队**：创建/更新分享时，`enqueueScreenshot()` fire-and-forget 推送到 Redis List `screenshot:queue`
2. **生成**：`crimson-screenshot-rs` 服务消费队列，通过远程 browserless (CDP) 渲染后 POST 图片回 crimson
3. **接收**：`POST /api/createScreenShot` 校验 `contentUpdatedAt` 防过时，存 .jpg 文件，更新 `coverId`
4. **服务**：`GET /api/screenshot/[base62Id]` 提供图片，支持 ETag 协商缓存（304）
5. **展示**：ShareCard 用 Next.js `<Image>` 组件展示，`coverId` 为空时显示渐变色，`onError` 回退渐变色
6. **清理**：更新内容时删除旧截图文件并置空 `coverId`；删除分享时清理截图文件

**容错**：截图服务挂了不影响主服务。入队用 `.catch()` 忽略错误，前端无截图时优雅降级为渐变色。

## 截图相关 API

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/createScreenShot` | POST | 接收截图（仅 crimson-screenshot-rs 调用，X-Screenshot-Secret 验证） |
| `/api/screenshot/[base62Id]` | GET | 提供截图文件（ETag + 304 协商缓存） |

## 共享基础设施

三个服务共用：
- PostgreSQL 数据库
- Redis/Valkey 实例
- Snowflake ID + Base62 编码体系

## 常用命令

```bash
bun dev       # 开发服务器
bun build     # 构建
bun start     # 生产启动
./deploy.sh   # 部署到香橙派
```
