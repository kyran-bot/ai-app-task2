# 🔧 Supabase 文档管理系统

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

## 📋 项目简介

这是第 6 节课程的实现项目 - 构建一个由 Supabase 支持的文档上传和文件管理系统。

**核心功能：**
- 📤 文件上传（支持任何文件类型）
- 📋 文件列表管理
- 📥 文件下载
- 🗑️ 文件删除
- 🔒 安全的 S3 兼容对象存储
- 🎨 现代化 UI 界面

## 🏗️ 项目结构

```
ai-app-task2/
├── my-app/                    # Next.js 项目主目录
│   ├── app/
│   │   ├── api/documents/     # 后端 API 端点
│   │   ├── components/        # 前端组件
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 主页面
│   ├── lib/
│   │   └── supabase.ts        # Supabase 配置
│   ├── package.json
│   ├── tsconfig.json
│   ├── PROJECT_STRUCTURE.md   # 详细结构说明
│   └── SUPABASE_SETUP.md      # Supabase 配置指南
└── .git/                      # Git 仓库
```

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户

### 1. 克隆仓库（如果从 GitHub）
```bash
git clone https://github.com/kyran-bot/ai-app-task2.git
cd ai-app-task2/my-app
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置 Supabase

详见 `my-app/SUPABASE_SETUP.md` 获取完整的步骤。

简要步骤：
1. 在 https://supabase.com 创建项目
2. 获取 Project URL 和 API 密钥
3. 创建名为 `documents` 的对象存储 Bucket
4. 配置 `my-app/.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. 启动本地开发
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📝 核心 API 端点

### POST /api/documents
上传文件到 Supabase 存储

**请求：**
```
Content-Type: multipart/form-data
Body:
  - file: File
  - fileName: string
```

**响应：**
```json
{
  "success": true,
  "fileUrl": "https://...",
  "fileName": "timestamp-random-filename",
  "originalName": "original-file-name.pdf",
  "uploadedAt": "2024-02-20T07:30:00Z"
}
```

### GET /api/documents
获取所有已上传的文件列表

**响应：**
```json
{
  "success": true,
  "files": [
    {
      "name": "timestamp-random-filename",
      "publicUrl": "https://...",
      "created_at": "2024-02-20T07:30:00Z"
    }
  ],
  "total": 5
}
```

### DELETE /api/documents
删除指定文件

**请求：**
```json
{
  "fileName": "timestamp-random-filename"
}
```

**响应：**
```json
{
  "success": true,
  "message": "文件已删除"
}
```

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| **Next.js** | React 全栈框架 |
| **React** | UI 库 |
| **TypeScript** | 类型安全 |
| **Supabase** | 后端服务（PostgreSQL + Storage） |
| **Tailwind CSS** | 样式框架 |
| **Lucide React** | 图标库 |

## 📦 npm 脚本

```bash
npm run dev         # 启动开发服务器 (port 3000)
npm run build       # 生产构建
npm start           # 启动生产服务器
npm run lint        # 运行 ESLint 检查
npm run type-check  # 运行 TypeScript 检查
```

## 🌐 部署到 Vercel

### 步骤 1：推送到 GitHub

```bash
git add .
git commit -m "Initial commit: Supabase document management system"
git branch -M main
git push -u origin main
```

### 步骤 2：连接 Vercel

1. 访问 [https://vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击 "Import Project"
4. 选择 `ai-app-task2` 仓库
5. 在"Root Directory"选择 `my-app`
6. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
7. 点击 "Deploy"

### 步骤 3：验证生产环境

1. 访问你的 Vercel 部署 URL
2. 测试文件上传、下载、删除功能
3. 在 Supabase 存储中验证文件

## 📸 功能演示

### 上传文件
- 拖拽文件到上传区域
- 或点击"选择文件"按钮
- 支持多文件同时上传

### 管理文件
- 查看完整的文件列表
- 下载任何已上传的文件
- 一键删除文件

### 实时同步
- 文件列表每 5 秒自动刷新
- 立即看到新上传的文件

## 🔒 安全特性

1. **环境变量分离**
   - 公开密钥在客户端
   - 服务密钥仅在服务器端

2. **CORS 配置**
   - 本地开发
   - 生产 Vercel 部署

3. **Supabase 行级安全**
   - 存储权限策略
   - 公开 Bucket 访问

## 🐛 故障排查

### 文件上传失败
- 检查 `.env.local` 配置
- 验证 Supabase API 密钥
- 查看浏览器控制台错误信息

### CORS 错误
- 在 Supabase 添加你的域到 CORS
- 清除浏览器缓存

### 找不到文件
- 确保 Bucket 名为 `documents`
- 检查存储策略权限

详见 `my-app/SUPABASE_SETUP.md` 获取完整的故障排查指南。

## 📚 文档

- [PROJECT_STRUCTURE.md](my-app/PROJECT_STRUCTURE.md) - 详细项目结构
- [SUPABASE_SETUP.md](my-app/SUPABASE_SETUP.md) - Supabase 完整配置
- [README.md](my-app/README.md) - Next.js 项目说明

## 🔗 有用的链接

- [Supabase 官方网站](https://supabase.com)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 📄 许可证

MIT License

## 👨‍💻 作者

- GitHub: [@kyran-bot](https://github.com/kyran-bot)

## 🙏 致谢

- Supabase 提供的开源后端服务
- Next.js 和 React 社区
- Tailwind CSS 框架

---

**开始使用：** 按照"快速开始"章节中的步骤，你将在几分钟内运行这个应用。

**有问题？** 检查文档或在 GitHub Issues 中提问。
