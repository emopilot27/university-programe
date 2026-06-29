/**
 * API 请求封装
 * 使用 Axios 封装 HTTP 请求
 * 统一配置 baseURL 和请求头
 */
import axios from 'axios'

/**
 * 创建 Axios 实例
 * 配置基础 URL 和请求头
 */
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // 后端 API 基础地址
  headers: {
    'Content-Type': 'application/json'    // 设置请求内容类型为 JSON
  }
})

/**
 * 用户注册接口
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} - 请求 Promise
 */
export const register = async (username, password) => {
  return await api.post('/register', { username, password })
}

/**
 * 用户登录接口
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} - 请求 Promise
 */
export const login = async (username, password) => {
  return await api.post('/login', { username, password })
}