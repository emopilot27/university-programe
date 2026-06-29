# 全栈待办应用

一个基于 Vue 3 + Node.js + Express + MySQL 的全栈待办应用。

## 项目结构

```
to do project/
├── backend/           # 后端代码
│   ├── package.json   # 后端依赖配置
│   ├── server.js      # 后端入口文件
│   └── init.sql       # 数据库初始化脚本
├── frontend/          # 前端代码
│   ├── package.json   # 前端依赖配置
│   ├── vite.config.js # Vite 配置
│   ├── index.html     # HTML 入口
│   └── src/           # 前端源码
│       ├── main.js    # 应用入口
│       ├── App.vue    # 根组件
│       ├── router/    # 路由配置
│       ├── stores/    # Pinia 状态管理
│       ├── api/       # API 请求封装
│       └── views/     # 页面组件
└── README.md          # 运行指南
```

## 技术栈

### 前端
- Vue 3 (Composition API)
- Vue Router
- Pinia
- Axios
- Vite

### 后端
- Node.js
- Express.js
- MySQL 2
- CORS

## 运行步骤

### 1. 启动 MySQL 服务

确保你的本地 MySQL 服务已经启动。

### 2. 初始化数据库

打开 MySQL 客户端，执行 `backend/init.sql` 文件：

```bash
mysql -u root -p < backend/init.sql
```

或者在 MySQL 客户端中执行：
```sql
source /path/to/backend/init.sql;
```

### 3. 启动后端服务

```bash
cd backend
npm install
npm run dev
```

后端服务将在 http://localhost:3000 运行。

### 4. 启动前端服务

打开新的终端窗口：

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 http://localhost:5173 运行。

## API 接口

| 接口 | 方法 | 参数 | 说明 |
|------|------|------|------|
| /api/register | POST | username, password | 注册新用户 |
| /api/login | POST | username, password | 用户登录 |
| /api/todos | POST | user_id | 获取任务列表 |
| /api/todo/add | POST | user_id, title | 新增任务 |
| /api/todo/toggle | POST | id | 切换任务状态 |
| /api/todo/delete | POST | id | 删除任务 |

## 数据库结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 自增主键 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(100) | 密码 |
| created_at | TIMESTAMP | 创建时间 |

### todos 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 自增主键 |
| user_id | INT | 用户ID（外键） |
| title | VARCHAR(255) | 任务标题 |
| completed | TINYINT(1) | 完成状态（0未完成，1已完成） |
| created_at | DATETIME | 创建时间 |

## 功能说明

1. **登录/注册页**：合并界面，支持切换登录和注册标签
2. **任务主界面**：
   - 顶部显示欢迎信息和退出按钮
   - 中间输入框添加新任务（支持回车添加）
   - 任务列表显示所有任务
   - 点击复选框切换任务状态
   - 点击删除按钮弹出确认框后删除任务
3. **样式**：纯黑白灰极简风格