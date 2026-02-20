# ⚡ 快速启动指南

最快速度完成本项目的逐步指导。

## 5分钟快速开始

### 1️⃣ 推送到 GitHub（1分钟）

```bash
cd /workspaces/ai-app-task2

# 如果还没配置Git用户信息
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 添加并提交
git add .
git commit -m "Initial commit: Supabase document management system"

# 如果已有远程地址
git push origin main

# 如果第一次推送
git remote add origin https://github.com/your-username/ai-app-task2.git
git branch -M main
git push -u origin main
```

### 2️⃣ 获取 Supabase 凭证（3分钟）

#### 2.1 创建 Supabase 项目
- 访问 https://supabase.com
- 点击 "New Project"
- 填写项目名、密码、选择地区
- 等待项目创建完成

#### 2.2 创建存储 Bucket
- 在左侧菜单点击 "Storage"
- 点击 "Create a new bucket"
- 名称输入：`documents`
- 勾选 "Public bucket"
- 点击 "Create bucket"

#### 2.3 获取 API 密钥
- 点击左侧 "Settings" → "API"
- 复制以下三个值：
  - Project URL
  - anon (public) key
  - service_role (secret) key

### 3️⃣ 配置环境变量（1分钟）

```bash
cd /workspaces/ai-app-task2/my-app

# 复制示例文件
cp .env.local.example .env.local

# 编辑 .env.local，填入从 Supabase 获取的值
# 使用你喜欢的编辑器编辑 .env.local
```

编辑后的 `.env.local` 应该看起来像：
```env
NEXT_PUBLIC_SUPABASE_URL=https://abc123xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 本地测试（5分钟）

### 启动开发服务器

```bash
cd /workspaces/ai-app-task2/my-app
npm run dev
```

打开浏览器：http://localhost:3000

### 测试功能

✅ **文件上传**
- 随意上传一个文件（PDF、图片、文本等）
- 应该看到"文件上传成功"提示
- 文件应该出现在列表中

✅ **文件列表**
- 查看上传的文件是否在表格中显示
- 检查文件名、大小、上传时间等信息

✅ **文件下载**
- 点击列表中的"下载"按钮
- 文件应该下载到本地

✅ **文件删除**
- 点击"删除"按钮
- 确认删除提示
- 文件应该从列表中消失

✅ **验证 Supabase 存储**
- 在 Supabase 控制面板中转到 Storage
- 点击 `documents` bucket
- 应该看到 `uploads/` 目录中的文件

## 部署到 Vercel（5分钟）

### 1. 推送代码到 GitHub

```bash
cd /workspaces/ai-app-task2

# 确保所有提交都推送
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. 在 Vercel 部署

1. 访问 https://vercel.com
2. 点击"Sign in"，使用 GitHub 账户登录
3. 点击"New Project"
4. 选择 `ai-app-task2` 仓库
5. 在"Root Directory"选择 `./my-app`
6. 点击"Environment Variables"添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
7. 粘贴对应的值
8. 点击"Deploy"

### 3. 配置 Supabase CORS

1. 在 Supabase 中点击 Settings → API → CORS configuration
2. 添加你的 Vercel 部署 URL（形式：`https://your-app.vercel.app`）
3. 点击"Add"

### 4. 测试部署

访问你的 Vercel URL，重复本地测试步骤。

## 常见问题快速修复

### ❌ "CORS 错误"
**解决：** 在 Supabase 中添加你的部署 URL 到 CORS 설정

### ❌ "401 Unauthorized"
**解决：** 检查 `.env.local` 中的 API 密钥是否正确（无额外空格）

### ❌ "找不到 Bucket"
**解决：** 确保 Bucket 名为 `documents`（全小写）

### ❌ "Permission denied"
**解决：** 在 Supabase Storage 中，确保 `documents` bucket 标记为"Public"

### ❌ 文件列表为空
**解决：** 
- 检查浏览器控制台是否有错误
- 确认文件已上传到 Supabase
- 清除浏览器缓存

## 完成清单

在提交作业前，确保：

### 代码部分
- [ ] 项目正确放在 `my-app` 目录
- [ ] API 路由在 `app/api/documents/route.ts`
- [ ] FileUploader 组件在 `app/components/FileUploader.tsx`
- [ ] `.env.local` 已配置（但不要 commit）
- [ ] 所有代码已推送到 GitHub

### 功能测试
- [ ] 本地开发环境中所有功能正常
- [ ] 可以上传文件
- [ ] 可以下载文件
- [ ] 可以删除文件
- [ ] Supabase 存储中可以看到文件

### 文档
- [ ] README.md 已完毕
- [ ] SUPABASE_SETUP.md 已完毕
- [ ] PROJECT_STRUCTURE.md 已完毕
- [ ] DEVELOPMENT_CHECKLIST.md 已完毕

### Vercel 部署
- [ ] 代码已推送到 GitHub
- [ ] 在 Vercel 部署成功
- [ ] 部署 URL 可访问
- [ ] 生产环境功能测试通过
- [ ] Supabase CORS 已配置

### 屏幕截图（放在 `screenshots/` 目录）
- [ ] Supabase 项目设置
- [ ] Bucket 配置
- [ ] 本地应用界面
- [ ] 文件上传成功
- [ ] 文件列表显示
- [ ] Supabase Storage 中的文件
- [ ] Vercel 部署
- [ ] 部署后的应用测试

## 需要帮助？

📖 **查看完整文档**
- README.md - 项目概览
- SUPABASE_SETUP.md - 详细配置指南
- PROJECT_STRUCTURE.md - 项目结构说明
- DEVELOPMENT_CHECKLIST.md - 完整检查清单

🌐 **官方资源**
- https://supabase.com/docs - Supabase 文档
- https://nextjs.org/docs - Next.js 文档
- https://vercel.com/docs - Vercel 文档

💬 **社区支持**
- GitHub Issues: 在仓库中提问
- Supabase Discord: https://discord.supabase.io

---

**预计总时间：15-20 分钟**

开始吧！🚀
