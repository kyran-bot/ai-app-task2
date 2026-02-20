# 📁 Supabase 文档管理系统

由 Supabase 支持的全栈文档上传和管理系统。本项目使用 Next.js、React、TypeScript 和 Tailwind CSS 构建。

## 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户

### 安装和运行

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，添加你的 Supabase 凭证

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 核心功能

✅ **文件上传** - 支持所有文件类型，拖拽或点击上传  
✅ **文件列表** - 显示所有已上传文件的详细信息  
✅ **文件下载** - 一键下载任何已上传的文件  
✅ **文件删除** - 安全删除不需要的文件  
✅ **自动刷新** - 每5秒自动同步文件列表  
✅ **现代化 UI** - 使用 Tailwind CSS 和图标库  

## 项目结构

```
my-app/
├── app/
│   ├── api/documents/     # 后端 API 端点
│   ├── components/        # React 组件
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── lib/
│   └── supabase.ts        # Supabase 配置
├── public/                # 静态资源
└── package.json
```

## 可用的命令

```bash
npm run dev         # 启动开发服务器
npm run build       # 生产构建
npm start           # 启动生产服务器
npm run lint        # 代码 lint 检查
```

## 完整文档

- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - 详细项目结构
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Supabase 配置步骤
- **[../README.md](../README.md)** - 主项目文档
- **[../QUICK_START.md](../QUICK_START.md)** - 快速启动指南

## API 端点

### POST /api/documents
上传文件到 Supabase 存储

### GET /api/documents
获取已上传文件列表

### DELETE /api/documents
删除指定文件

## 技术栈

- **Next.js** - React 全栈框架
- **React** - UI 库
- **TypeScript** - 类型安全
- **Supabase** - 后端和存储
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 部署

参考 [../README.md](../README.md) 中的 Vercel 部署说明。

## 许可证

MIT

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
