# 📝 快速参考卡

快速查找常用命令和关键信息。

## 🔧 项目命令

```bash
# 项目初始化
npm install            # 安装依赖
npm run dev           # 启动开发服务器 (localhost:3000)
npm run build         # 生产构建
npm start             # 运行生产服务器
npm run lint          # 代码 lint 检查

# Git 命令
git add .             # 添加所有文件
git commit -m "msg"   # 提交代码
git push origin main  # 推送到 GitHub
git status            # 查看更改状态
```

## 📁 关键文件位置

| 文件 | 位置 | 用途 |
|------|------|------|
| 主页面 | `my-app/app/page.tsx` | 应用首页 |
| 上传组件 | `my-app/app/components/FileUploader.tsx` | 文件管理 UI |
| API 路由 | `my-app/app/api/documents/route.ts` | 后端端点 |
| Supabase 配置 | `my-app/lib/supabase.ts` | SDK 初始化 |
| 环境变量 | `my-app/.env.local` | 配置凭证 |
| 项目配置 | `my-app/package.json` | 依赖和脚本 |

## 🔑 环境变量名

```env
NEXT_PUBLIC_SUPABASE_URL          # Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # 公开 API 密钥
SUPABASE_SERVICE_ROLE_KEY         # 私密 API 密钥（服务器）
```

## 🌐 关键 URL

| URL | 说明 |
|-----|------|
| http://localhost:3000 | 本地开发 |
| https://supabase.com | Supabase 官网 |
| https://vercel.com | Vercel 部署平台 |
| https://github.com | GitHub 代码仓库 |

## 📊 API 端点

```bash
# 上传文件
POST /api/documents
Content-Type: multipart/form-data
- file: File
- fileName: string

# 获取文件列表
GET /api/documents

# 删除文件
DELETE /api/documents
Content-Type: application/json
{ "fileName": "string" }
```

## ✅ Supabase 设置步骤

```
1. 创建项目 (https://supabase.com)
   → Project Settings → 记下 URL

2. 创建 Storage Bucket
   → Storage → New Bucket
   → Name: documents
   → Public: ✅

3. 获取 API 密钥
   → Settings → API
   → 复制 URL, anon key, service_role key

4. 配置 CORS
   → Settings → API → CORS Configuration
   → 添加本地和部署 URL
```

## 🚀 Vercel 部署步骤

```
1. GitHub: 推送代码
   git add .
   git commit -m "msg"
   git push origin main

2. Vercel: 导入项目
   https://vercel.com
   → New Project
   → 选择仓库
   → Root Directory: ./my-app

3. 环境变量: 添加三个 Supabase 密钥

4. 部署: 点击 Deploy

5. CORS: 在 Supabase 添加部署 URL
```

## 🐛 常见问题速查

| 问题 | 解决方案 |
|------|--------|
| `Cannot find module` | `npm install` |
| `Port 3000 in use` | `npm run dev -- -p 3001` 或 `kill -9 $(lsof -t -i:3000)` |
| `.env.local` not found | `cp .env.local.example .env.local` |
| CORS 错误 | 在 Supabase 中添加 URL 到 CORS |
| 401 Unauthorized | 检查 API 密钥是否正确 |
| 文件未显示 | Bucket 名称必须为 `documents` |

## 📚 文档导航

```
快速入手:
├── QUICK_START.md              # 5-15分钟快速指南
└── IMPLEMENTATION_MANUAL.md    # 完整实现手册

详细配置:
├── SUPABASE_SETUP.md           # Supabase 详细配置
├── PROJECT_STRUCTURE.md        # 项目结构说明
└── DEVELOPMENT_CHECKLIST.md    # 完整检查清单

项目文档:
├── README.md                   # 项目概览
└── PROJECT_COMPLETION_SUMMARY.md # 完成总结
```

## 📱 文件类型图标

| 类型 | 图标 |
|------|------|
| PDF | 📄 |
| Word | 📝 |
| 文本 | 📋 |
| 图片 | 🖼️ |
| 压缩包 | 📦 |
| 其他 | 📎 |

## 🔐 安全检查清单

- [ ] `.env.local` 在 `.gitignore` 中
- [ ] 没有 hardcode 秘钥
- [ ] 服务密钥仅在服务器端使用
- [ ] HTTPS 用于生产环境
- [ ] 定期轮换 API 密钥

## 🎯 测试清单

### 本地测试
- [ ] 单个文件上传
- [ ] 多个文件上传
- [ ] 文件列表显示
- [ ] 文件下载
- [ ] 文件删除
- [ ] 页面刷新后数据保存
- [ ] 错误消息显示
- [ ] 在 Supabase 中看到文件

### 生产环境测试
- [ ] 重复本地测试
- [ ] 跨浏览器测试
- [ ] 网络缓慢测试
- [ ] 大文件上传

## 💾 备份关键信息

记录以下信息（妥善保管）：

```
Supabase 项目 URL: _________________
匿名密钥: _________________  
服务密钥: _________________
Bucket 名称: documents
GitHub 仓库: _________________
Vercel URL: _________________
```

## 📞 快速联系

- **Supabase Support**: https://supabase.io/support
- **GitHub Issues**: [Your repo]/issues
- **Next.js Discord**: https://discord.gg/bUG7V3W
- **Vercel Support**: https://vercel.com/support

## 🕐 时间参考

| 任务 | 时间 |
|------|------|
| 项目初始化 | 5 分钟 |
| Supabase 设置 | 10 分钟 |
| 本地测试 | 10 分钟 |
| 代码提交 | 5 分钟 |
| Vercel 部署 | 5 分钟 |
| **总计** | **35 分钟** |

---

**保存此文档以便快速参考！** 📌

最后更新：2024 年 2 月
