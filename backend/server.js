/**
 * 待办应用后端服务器
 * 使用 Node.js + Express + MySQL 构建
 * 提供用户注册、登录、任务管理等 API 接口
 */

// 引入所需的依赖模块
const express = require('express'); // Express 框架，用于构建 Web 服务器
const cors = require('cors'); // CORS 中间件，解决跨域问题
const mysql = require('mysql2'); // MySQL 数据库驱动

// 创建 Express 应用实例
const app = express();
const port = 3000; // 服务器监听端口

// 配置中间件
app.use(cors()); // 启用跨域资源共享
app.use(express.json()); // 解析 JSON 格式的请求体

/**
 * 数据库连接配置
 * 创建与 MySQL 数据库的连接
 */
const db = mysql.createConnection({
  host: '127.0.0.1',           // 数据库主机地址（本地）
  user: 'root',                 // 数据库用户名
  password: '656327',           // 数据库密码
  database: 'todo_db',          // 数据库名称
  authPlugins: {
    mysql_native_password: true // MySQL 8.0+ 认证插件兼容性配置
  }
});

/**
 * 连接数据库
 */
db.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('数据库连接成功');
});

/**
 * Token 生成器
 * 用于模拟 JWT Token，简单生成唯一标识字符串
 */
let tokenCounter = 0;
const generateToken = () => {
  return 'TOKEN_' + Date.now() + '_' + tokenCounter++;
};

/**
 * 用户注册接口
 * POST /api/register
 * 参数: username (用户名), password (密码)
 */
app.post('/api/register', (req, res) => {
  // 从请求体中获取用户名和密码
  const { username, password } = req.body;
  
  // 参数校验：用户名和密码不能为空
  if (!username || !password) {
    return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
  }

  // 检查用户名是否已存在
  const checkSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    
    // 如果用户名已存在，返回错误
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    // 用户名不存在，插入新用户
    const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertSql, [username, password], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: '注册失败' });
      }
      
      // 生成 Token 并返回成功信息
      const token = generateToken();
      res.json({
        success: true,
        message: '注册成功',
        token,
        user: { id: result.insertId, username }
      });
    });
  });
});

/**
 * 用户登录接口
 * POST /api/login
 * 参数: username (用户名), password (密码)
 */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // 参数校验
  if (!username || !password) {
    return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
  }

  // 查询用户是否存在且密码正确
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    
    // 如果没有找到用户，返回错误
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 用户存在，生成 Token 并返回
    const user = results[0];
    const token = generateToken();
    res.json({
      success: true,
      message: '登录成功',
      token,
      user: { id: user.id, username: user.username }
    });
  });
});

/**
 * 获取任务列表接口
 * POST /api/todos
 * 参数: user_id (用户ID)
 */
app.post('/api/todos', (req, res) => {
  const { user_id } = req.body;
  
  // 参数校验
  if (!user_id) {
    return res.status(400).json({ success: false, message: '用户ID不能为空' });
  }

  // 查询该用户的所有任务，按创建时间降序排列
  const sql = 'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC';
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    res.json({ success: true, todos: results });
  });
});

/**
 * 添加任务接口
 * POST /api/todo/add
 * 参数: user_id (用户ID), title (任务标题)
 */
app.post('/api/todo/add', (req, res) => {
  const { user_id, title } = req.body;
  
  // 参数校验
  if (!user_id || !title) {
    return res.status(400).json({ success: false, message: '用户ID和任务标题不能为空' });
  }

  // 插入新任务，completed 默认 0（未完成），created_at 使用当前时间
  const sql = 'INSERT INTO todos (user_id, title, completed, created_at) VALUES (?, ?, 0, NOW())';
  db.query(sql, [user_id, title], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '添加失败' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

/**
 * 切换任务状态接口
 * POST /api/todo/toggle
 * 参数: id (任务ID)
 */
app.post('/api/todo/toggle', (req, res) => {
  const { id } = req.body;
  
  // 参数校验
  if (!id) {
    return res.status(400).json({ success: false, message: '任务ID不能为空' });
  }

  // 将 completed 字段取反（0变1，1变0）
  const sql = 'UPDATE todos SET completed = 1 - completed WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '更新失败' });
    }
    res.json({ success: true, changedRows: result.changedRows });
  });
});

/**
 * 删除任务接口
 * POST /api/todo/delete
 * 参数: id (任务ID)
 */
app.post('/api/todo/delete', (req, res) => {
  const { id } = req.body;
  
  // 参数校验
  if (!id) {
    return res.status(400).json({ success: false, message: '任务ID不能为空' });
  }

  // 删除指定任务
  const sql = 'DELETE FROM todos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '删除失败' });
    }
    res.json({ success: true, deletedRows: result.affectedRows });
  });
});

/**
 * 启动服务器
 */
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});