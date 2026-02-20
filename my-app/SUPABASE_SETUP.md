# 🚀 Supabase 配置指南

本指南将指导你完整地配置 Supabase 项目以支持文档管理系统。

## 第一步：创建 Supabase 账户

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Sign Up" 使用邮箱或 GitHub 账户注册
3. 验证你的邮箱

## 第二步：创建新项目

1. 登录后点击 "New Project"
2. 填写项目信息：
   - **Project Name**: `doc-management-system` （或自定义名称）
   - **Database Password**: 设置强密码（保存好）
   - **Region**: 选择离你最近的地区
3. 点击 "Create new project"
4. 等待项目初始化完成（通常需要 1-2 分钟）

## 第三步：获取 API 密钥

1. 在 Supabase 控制面板中，点击左侧的 "Settings" → "API"
2. 你会看到两个密钥：
   - **Project URL**: 复制此 URL
   - **anon (public)**: 复制此公钥
   - **service_role (secret)**: 复制此密钥（保密）

### 在 `.env.local` 中配置

创建或编辑 `my-app/.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-code.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-string
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-string
```

## 第四步：创建对象存储 Bucket

### 4.1 创建 Bucket

1. 在 Supabase 控制面板左侧，点击 "Storage"
2. 点击 "Create a new bucket"
3. 填写信息：
   - **Bucket Name**: `documents` （必须使用此名称）
   - **Public bucket**: 勾选此选项（允许公开访问文件）
4. 点击 "Create bucket"

### 4.2 设置 Bucket 权限

1. 进入 `documents` bucket
2. 点击右上角的 "Policies" 按钮
3. 为以下操作添加策略（如果未自动添加）：
   - SELECT (允许读取)
   - INSERT (允许上传)
   - DELETE (允许删除)
   - UPDATE (允许更新)

### 手动设置策略（如果需要）

如果 UI 中没有预设策略，可以手动创建。点击 "New Policy" 并选择：

#### 允许公开读取
- **Operation**: SELECT
- **For**: Authenticated and Anonymous users
- **Success**: All rows

#### 允许上传（匿名）
- **Operation**: INSERT
- **For**: Authenticated and Anonymous users  
- **With check**: True

#### 允许删除（匿名）
- **Operation**: DELETE
- **For**: Authenticated and Anonymous users
- **Using**: True

## 第五步：测试连接

### 在项目中运行测试

cd 到 `my-app` 目录并运行开发服务器：

```bash
cd my-app
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 测试步骤

1. 尝试上传一个文件
2. 检查浏览器控制台是否有错误
3. 如果上传成功，检查 Supabase 存储中是否出现文件

### 常见错误排查

#### 错误：CORS 问题

如果看到 CORS 错误，需要在 Supabase 中配置 CORS：

1. 访问 Settings → API → CORS configuration
2. 添加你的本地和部署域：
   - 本地：`http://localhost:3000`
   - Vercel：`https://your-app.vercel.app`

#### 错误：401 Unauthorized

- 检查 API 密钥是否正确
- 确保 `.env.local` 中没有额外的空格

#### 错误：找不到 Bucket

- 确保 bucket 名为 `documents`（全小写）
- 检查 bucket 是否已创建

#### 错误：Permission denied

- 检查 bucket 是否标记为"公开"
- 检查存储策略是否正确配置

## 第六步：生产环境配置

### 在 Vercel 中设置环境变量

1. 在 Vercel 中打开你的项目
2. 进入 "Settings" → "Environment Variables"
3. 添加以下变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

### 配置生产 CORS

在 Supabase 中添加你的 Vercel 域到 CORS 配置：
- `https://your-app.vercel.app`

## 第七步：验证完整性

在网站上传一个测试文件，检查：

1. ✅ 文件成功上传
2. ✅ 文件出现在文件列表中
3. ✅ 可以从存储中下载文件
4. ✅ 可以删除文件
5. ✅ 可以在 Supabase Storage UI 中看到文件

## 常用 Supabase 命令（CLI）

### 安装 Supabase CLI
```bash
npm install -g supabase
```

### 获取项目信息
```bash
supabase projects list
```

### 同步本地变更
```bash
supabase db push
```

## 有用的 Supabase 资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Storage API 文档](https://supabase.com/docs/guides/storage)
- [Supabase 社区论坛](https://github.com/supabase/supabase/discussions)

## 下一步

完成配置后，你可以：

1. 测试本地应用
2. 提交代码到 GitHub
3. 部署到 Vercel
4. 添加用户认证
5. 实现更多高级功能

---

**需要帮助？** 检查 PROJECT_STRUCTURE.md 和 README.md 获取更多信息。
