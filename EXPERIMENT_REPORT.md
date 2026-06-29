# 全栈待办应用 - 实验报告

## 一、项目概述

### 1.1 项目背景
本项目是一个基于 **Vue 3 + Node.js + Express + MySQL** 的全栈待办应用，旨在帮助学习者理解全栈开发的基本流程和核心概念。

### 1.2 项目目标
- 掌握前后端分离架构的基本原理
- 理解 HTTP 请求与响应的流程
- 学习数据库设计与 SQL 操作
- 实践 Vue 3 Composition API 和状态管理
- 理解用户认证与权限控制的基本概念

### 1.3 功能特性
| 功能模块 | 功能描述 |
|---------|---------|
| 用户注册 | 用户可以创建新账号 |
| 用户登录 | 用户可以登录系统 |
| 任务管理 | 添加、查看、切换状态、删除任务 |
| 数据持久化 | 数据存储在 MySQL 数据库中 |

---

## 二、技术栈

### 2.1 前端技术
| 技术 | 版本 | 作用 |
|-----|------|-----|
| Vue 3 | 3.3.4 | 前端框架，用于构建用户界面 |
| Vue Router | 4.2.4 | 路由管理，实现页面导航 |
| Pinia | 2.1.6 | 状态管理，管理全局状态 |
| Axios | 1.5.0 | HTTP 客户端，发送请求 |
| Vite | 4.4.9 | 构建工具，快速开发和构建 |

### 2.2 后端技术
| 技术 | 版本 | 作用 |
|-----|------|-----|
| Node.js | 20.x | 运行时环境，执行 JavaScript |
| Express.js | 4.18.2 | Web 框架，构建 API |
| MySQL 2 | 3.6.0 | MySQL 数据库驱动 |
| CORS | 2.8.5 | 跨域资源共享中间件 |

### 2.3 数据库
| 数据库 | 版本 | 作用 |
|-------|------|-----|
| MySQL | 8.0+ | 关系型数据库，存储用户和任务数据 |

---

## 三、项目架构

### 3.1 架构设计
```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (Browser)                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Login.vue   │    │ TodoList.vue │    │   App.vue    │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                    │               │
│         └───────────────────┼────────────────────┘               │
│                             │                                   │
│                   ┌─────────┴─────────┐                        │
│                   │    Vue Router     │                        │
│                   └─────────┬─────────┘                        │
│                             │                                   │
│                   ┌─────────┴─────────┐                        │
│                   │     Pinia Store   │                        │
│                   │  (user / todos)   │                        │
│                   └─────────┬─────────┘                        │
│                             │                                   │
│                   ┌─────────┴─────────┐                        │
│                   │     Axios API     │                        │
│                   └─────────┬─────────┘                        │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        后端 (Node.js)                           │
│                   ┌───────────────────┐                        │
│                   │   Express Server  │                        │
│                   └─────────┬─────────┘                        │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐              │
│         ▼                   ▼                   ▼              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│  │  /api/login │   │ /api/todos  │   │ /api/todo/  │          │
│  │ /api/reg    │   │             │   │ add/toggle  │          │
│  └──────┬──────┘   └──────┬──────┘   │ /delete     │          │
│         │                 │           └──────┬──────┘          │
│         └─────────────────┼──────────────────┘                  │
│                           │                                     │
│                   ┌───────┴───────┐                            │
│                   │   MySQL DB    │                            │
│                   │ (users/todos) │                            │
│                   └───────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 项目目录结构
```
to do project/
├── backend/                    # 后端代码
│   ├── package.json            # 后端依赖配置
│   ├── server.js               # 后端入口文件（核心）
│   └── init.sql                # 数据库初始化脚本
├── frontend/                   # 前端代码
│   ├── package.json            # 前端依赖配置
│   ├── vite.config.js          # Vite 配置
│   ├── index.html              # HTML 入口
│   └── src/
│       ├── main.js             # 应用入口
│       ├── App.vue             # 根组件
│       ├── router/
│       │   └── index.js        # 路由配置
│       ├── stores/
│       │   ├── user.js         # 用户状态管理（核心）
│       │   └── todos.js        # 任务状态管理（核心）
│       ├── api/
│       │   └── index.js        # API 请求封装（核心）
│       └── views/
│           ├── Login.vue       # 登录/注册页面
│           └── TodoList.vue    # 任务列表页面
├── README.md                   # 运行指南
└── EXPERIMENT_REPORT.md        # 实验报告（本文件）
```

---

## 四、数据库设计

### 4.1 数据库表结构

#### 4.1.1 users 表（用户表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 用户唯一标识 |
| username | VARCHAR(50) | NOT NULL, UNIQUE | 用户名（唯一） |
| password | VARCHAR(100) | NOT NULL | 用户密码 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**DDL 语句：**
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.1.2 todos 表（任务表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 任务唯一标识 |
| user_id | INT | NOT NULL, FOREIGN KEY | 关联用户ID |
| title | VARCHAR(255) | NOT NULL | 任务标题 |
| completed | TINYINT(1) | DEFAULT 0 | 完成状态（0未完成，1已完成） |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**DDL 语句：**
```sql
CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.2 表关系图
```
users        todos
┌─────┐      ┌─────┐
│ id  │◄─────┤user_id│
│username│   │ title │
│password│   │completed│
└─────┘      │created_at│
             └─────┘
```

---

## 五、API 接口设计

### 5.1 接口列表

| 接口路径 | HTTP 方法 | 功能描述 | 所属文件 |
|---------|----------|---------|---------|
| `/api/register` | POST | 用户注册 | server.js |
| `/api/login` | POST | 用户登录 | server.js |
| `/api/todos` | POST | 获取任务列表 | server.js |
| `/api/todo/add` | POST | 添加新任务 | server.js |
| `/api/todo/toggle` | POST | 切换任务状态 | server.js |
| `/api/todo/delete` | POST | 删除任务 | server.js |

### 5.2 接口详细说明

#### 5.2.1 用户注册 - POST /api/register

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |

**成功响应（200）：**
```json
{
  "success": true,
  "message": "注册成功",
  "token": "TOKEN_1234567890_0",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

**失败响应（400）：**
```json
{
  "success": false,
  "message": "用户名已存在"
}
```

#### 5.2.2 用户登录 - POST /api/login

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |

**成功响应（200）：**
```json
{
  "success": true,
  "message": "登录成功",
  "token": "TOKEN_1234567890_1",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

**失败响应（401）：**
```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

#### 5.2.3 获取任务列表 - POST /api/todos

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| user_id | Number | 是 | 用户ID |

**成功响应（200）：**
```json
{
  "success": true,
  "todos": [
    {
      "id": 1,
      "user_id": 1,
      "title": "学习全栈开发",
      "completed": 0,
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

#### 5.2.4 添加任务 - POST /api/todo/add

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| user_id | Number | 是 | 用户ID |
| title | String | 是 | 任务标题 |

**成功响应（200）：**
```json
{
  "success": true,
  "id": 1
}
```

#### 5.2.5 切换任务状态 - POST /api/todo/toggle

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Number | 是 | 任务ID |

**成功响应（200）：**
```json
{
  "success": true,
  "changedRows": 1
}
```

#### 5.2.6 删除任务 - POST /api/todo/delete

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Number | 是 | 任务ID |

**成功响应（200）：**
```json
{
  "success": true,
  "deletedRows": 1
}
```

---

## 六、前端组件设计

### 6.1 组件架构

| 组件 | 文件路径 | 功能说明 |
|-----|---------|---------|
| App.vue | src/App.vue | 根组件，路由出口 |
| Login.vue | src/views/Login.vue | 登录/注册页面 |
| TodoList.vue | src/views/TodoList.vue | 任务列表页面 |

### 6.2 状态管理（Pinia）

#### 6.2.1 user Store（用户状态）

| 属性/方法 | 类型 | 说明 |
|----------|------|------|
| token | String | 用户认证 token |
| user | Object | 用户信息（id, username） |
| login(newToken, newUser) | Function | 登录，保存状态 |
| logout() | Function | 登出，清除状态 |
| isLoggedIn() | Function | 检查是否已登录 |

**核心代码逻辑：**
```javascript
// 从 localStorage 读取持久化数据
const token = ref(localStorage.getItem('token') || '')
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

// 登录时保存到 localStorage
const login = (newToken, newUser) => {
  token.value = newToken
  user.value = newUser
  localStorage.setItem('token', newToken)
  localStorage.setItem('user', JSON.stringify(newUser))
}
```

#### 6.2.2 todos Store（任务状态）

| 属性/方法 | 类型 | 说明 |
|----------|------|------|
| todos | Array | 任务列表 |
| fetchTodos(userId) | Function | 获取任务列表 |
| addTodo(userId, title) | Function | 添加任务 |
| toggleTodo(id) | Function | 切换任务状态 |
| deleteTodo(id) | Function | 删除任务 |

### 6.3 路由配置

| 路径 | 组件 | 说明 |
|------|------|------|
| / | Login.vue | 登录/注册页面 |
| /todos | TodoList.vue | 任务列表页面 |

---

## 七、数据流向分析

### 7.1 添加任务数据流向

```
用户点击"添加"按钮
   ↓
【前端】TodoList.vue → handleAdd()
   ↓
【前端】todosStore.addTodo(userId, title)
   ↓
【前端】Axios POST /api/todo/add {user_id, title}
   ↓
─────────────── HTTP 请求 ───────────────
   ↓
【后端】server.js → /api/todo/add 路由
   ↓
【后端】解析 req.body → {user_id, title}
   ↓
【后端】执行 SQL: INSERT INTO todos (...)
   ↓
【后端】res.json({success: true, id: insertId})
   ↓
─────────────── HTTP 响应 ───────────────
   ↓
【前端】收到响应 → 调用 fetchTodos() 更新列表
   ↓
【前端】Vue 响应式更新 → 页面刷新显示新任务
```

### 7.2 关键技术点

| 技术点 | 说明 |
|-------|------|
| `req.body` | Express 通过 `express.json()` 中间件解析 JSON 请求体 |
| `res.json()` | Express 向客户端返回 JSON 格式响应 |
| Axios | 前端 HTTP 客户端，处理异步请求 |
| Pinia | Vue 3 状态管理，集中管理应用状态 |
| localStorage | 浏览器本地存储，实现登录状态持久化 |

---

## 八、运行说明

### 8.1 环境要求

| 软件 | 版本 | 说明 |
|-----|------|-----|
| Node.js | 18.x+ | 运行时环境 |
| MySQL | 8.0+ | 数据库 |

### 8.2 启动步骤

**步骤1：启动 MySQL 服务**
```bash
# 确保 MySQL 服务已启动
```

**步骤2：初始化数据库**
```bash
mysql -u root -p < backend/init.sql
```

**步骤3：启动后端服务**
```bash
cd backend
npm install
npm run dev
# 运行在 http://localhost:3000
```

**步骤4：启动前端服务**
```bash
cd frontend
npm install
npm run dev
# 运行在 http://localhost:5173
```

### 8.3 测试验证

| 测试项 | 操作步骤 | 预期结果 |
|-------|---------|---------|
| 注册 | 进入首页，切换到注册，输入用户名密码 | 注册成功，跳转到任务页 |
| 登录 | 输入正确的用户名密码 | 登录成功，跳转到任务页 |
| 添加任务 | 在输入框输入内容，按回车 | 任务添加到列表 |
| 切换状态 | 点击任务前的复选框 | 任务状态切换，文字加删除线 |
| 删除任务 | 点击删除按钮，确认 | 任务从列表中移除 |
| 数据持久化 | 添加任务后关闭浏览器，重新登录 | 任务仍然存在 |

---

## 九、学习要点总结

### 9.1 前端核心概念
1. **Vue 3 Composition API**：使用 `ref`、`reactive` 创建响应式数据
2. **Pinia 状态管理**：集中管理全局状态，支持持久化
3. **Vue Router**：实现单页应用路由跳转
4. **Axios**：发送 HTTP 请求，处理异步数据

### 9.2 后端核心概念
1. **Express 中间件**：`cors()`、`express.json()` 处理请求
2. **路由设计**：RESTful API 设计原则
3. **数据库操作**：SQL 语句编写，参数化查询
4. **错误处理**：统一的错误响应格式

### 9.3 全栈协作要点
1. **前后端分离**：前端负责展示，后端负责数据处理
2. **接口契约**：明确的请求参数和响应格式
3. **跨域处理**：使用 CORS 中间件解决跨域问题
4. **状态管理**：前端状态与后端数据的同步

---

## 十、扩展建议

### 10.1 功能扩展
- [ ] 添加任务分类功能
- [ ] 添加截止日期字段
- [ ] 添加任务搜索功能
- [ ] 添加用户头像上传
- [ ] 实现密码加密（bcrypt）
- [ ] 实现 JWT 认证

### 10.2 技术扩展
- [ ] 使用 TypeScript 重构
- [ ] 添加单元测试
- [ ] 实现 API 文档（Swagger）
- [ ] 部署到云服务器
- [ ] 使用 Docker 容器化

---

## 附录

### A. 项目配置文件

**后端 package.json 关键依赖：**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5"
  }
}
```

**前端 package.json 关键依赖：**
```json
{
  "dependencies": {
    "vue": "^3.3.4",
    "vue-router": "^4.2.4",
    "pinia": "^2.1.6",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "vite": "^4.4.9",
    "@vitejs/plugin-vue": "^4.3.4"
  }
}
```

### B. 常见问题排查

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 数据库连接失败 | 密码错误或服务未启动 | 检查密码配置，启动 MySQL 服务 |
| 端口被占用 | 端口 3000 被其他程序占用 | 杀死占用进程或修改端口 |
| 跨域错误 | 未配置 CORS | 确保后端启用 `cors()` 中间件 |
| 前端请求失败 | 后端未启动 | 先启动后端服务 |

---

**报告完成时间**：2026年6月24日  
**项目版本**：v1.0.0  
**作者**：全栈开发学习者