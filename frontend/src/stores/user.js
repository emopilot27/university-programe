/**
 * 用户状态管理 Store
 * 使用 Pinia 管理用户登录状态
 * 包含登录、登出、token管理等功能
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义用户状态管理 Store
export const useUserStore = defineStore('user', () => {
  // 从 localStorage 中读取保存的 token 和用户信息
  // localStorage 用于持久化存储，刷新页面后仍能保持登录状态
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  /**
   * 登录函数
   * @param {string} newToken - 后端返回的 token
   * @param {object} newUser - 用户信息对象（包含 id 和 username）
   */
  const login = (newToken, newUser) => {
    // 更新状态
    token.value = newToken
    user.value = newUser
    
    // 保存到 localStorage，实现持久化
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  /**
   * 登出函数
   * 清除用户状态和 localStorage 中的数据
   */
  const logout = () => {
    // 清空状态
    token.value = ''
    user.value = null
    
    // 清除 localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /**
   * 检查是否已登录
   * @returns {boolean} - 是否已登录
   */
  const isLoggedIn = () => {
    return !!token.value && !!user.value
  }

  // 返回暴露给外部使用的状态和方法
  return {
    token,      // 用户 token
    user,       // 用户信息
    login,      // 登录方法
    logout,     // 登出方法
    isLoggedIn  // 登录状态检查方法
  }
})