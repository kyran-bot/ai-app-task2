# 📁 Supabase 文档管理系统 - 项目结构

## 项目概览

这是一个由 Supabase 支持的全栈文档上传和管理系统。使用 Next.js 构建，支持文件的上传、下载、删除和管理功能。

## 🏗️ 项目目录结构

```
ai-app-task2/
├── .git/                    # Git 版本控制仓库
├── my-app/                  # Next.js 项目根目录
│   ├── app/                 # Next.js App Router（前端和后端）
│   │   ├── api/             # 后端 API 路由（无服务器函数）
│   │   │   ├── documents/
│   │   │   │   └── route.ts # 文档上传、列表、删除 API
│   │   │   └── ...          # 其他 API 路由
│   │   ├── components/      # React 组件
│   │   │   ├── FileUploader.tsx  # 文件上传组件
│   │   │   └── ...          # 其他组件
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 主页面
│   │   ├── globals.css      # 全局样式
│   │   └── favicon.ico      # 网站图标
│   ├── lib/                 # 工具库和配置
│   │   ├── supabase.ts      # Supabase 客户端初始化
│   │   └── ...              # 其他工具函数
│   ├── public/              # 静态资源
│   ├── node_modules/        # 依赖包
│   ├── package.json         # 项目依赖和脚本
│   ├── tsconfig.json        # TypeScript 配置
│   ├── next.config.ts       # Next.js 配置
│   ├── tailwind.config.ts   # Tailwind CSS 配置
│   ├── postcss.config.mjs   # PostCSS 配置
│   ├── eslint.config.mjs    # ESLint 配置
│   ├── .env.local.example   # 环境变量模板
│   ├── .gitignore           # Git 忽略文件
│   ├── .next/               # Next.js 构建输出
│   └── README.md            # 项目说明文档

### 前端结构（Front-end）

- **app/page.tsx** - 主页面，展示文文件上传和管理界面
- **app/layout.tsx** - 根布局，全局样式和元数据
- **app/components/** - 可复用的 React 组件
  - **FileUploader.tsx** - 文件上传管理组件

### 后端结构（Back-end API Routes）

- **app/api/documents/route.ts** - 文档管理 API 端点
  - `POST /api/documents` - 上传文件到 Supabase 存储
  - `GET /api/documents` - 获取已上传文件列表
  - `DELETE /api/documents` - 删除指定文件

### 工具库（Utilities）

- **lib/supabase.ts** - Supabase 客户端和服务器端初始化

## 🚀 快速开始

### 1. 安装依赖
```bash
cd my-app
npm install
```

### 2. 配置 Supabase

#### 2.1 创建 Supabase 项目
1. 访问 [https://supabase.com](https://supabase.com)
2. 创建新项目并获取项目 URL 和 API 密钥

#### 2.2 设置对象存储
1. 在 Supabase 控制面板中，转到 "Storage"
2. 创建一个名为 `documents` 的新 bucket
3. 设置权限为公开读取（允许公开访问文件）

#### 2.3 配置环境变量
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 并填入你的 Supabase 凭证：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 本地开发

启动本地开发服务器：
```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📝 核心文件说明

### app/api/documents/route.ts
处理文档相关的 RESTful API 操作：
- **POST** - 文件上传，返回文件 URL 和元数据
- **GET** - 列出所有已上传文件
- **DELETE** - 删除指定文件

### app/components/FileUploader.tsx
提供用户界面的主要组件：
- 文件拖拽和点击上传
- 文件列表显示
- 文件下载和删除功能
- 实时文件列表刷新

### lib/supabase.ts
初始化 Supabase 客户端：
- 浏览器客户端用于前端操作
- 服务器端客户端用于 API 路由

## 🔧 主要依赖

- **Next.js** - 全栈框架
- **React** - UI 库
- **Supabase** - 后端服务（数据库和对象存储）
- **Tailwind CSS** - 样式框架
- **TypeScript** - 类型安全

## 📦 可用的 npm 脚本

```bash
npm run dev        # 启动本地开发服务器
npm run build      # 构建生产版本
npm start          # 启动生产服务器
npm run lint       # 运行 ESLint 检查
```

## 🌐 部署到 Vercel

### 1. 推送到 GitHub
```bash
git add .
git commit -m "Initial commit: Supabase document management system"
git push origin main
```

### 2. 部署到 Vercel
1. 访问 [https://vercel.com](https://vercel.com)
2. 连接你的 GitHub 账户和仓库
3. 配置环境变量（SUPABASE_URL, SUPABASE_ANON_KEY 等）
4. 点击部署

## 🔒 安全考虑

- 服务角色密钥 (`SUPABASE_SERVICE_ROLE_KEY`) 只在服务器端使用
- 匿名密钥 (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) 在客户端使用，可安全公开
- 文件存储使用 Supabase 的行级安全策略

## 📚 参考资源

- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 📄 许可证

MIT
