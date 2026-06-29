/**
 * 任务状态管理 Store
 * 使用 Pinia 管理任务列表
 * 包含任务的增删改查功能
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../api'

// 定义任务状态管理 Store
export const useTodosStore = defineStore('todos', () => {
  // 任务列表，响应式数据
  const todos = ref([])

  /**
   * 获取任务列表
   * @param {number} userId - 用户ID
   * @returns {object} - 接口返回的数据
   */
  const fetchTodos = async (userId) => {
    // 发送 POST 请求到后端接口
    const response = await api.post('/todos', { user_id: userId })
    
    // 如果请求成功，更新任务列表
    if (response.data.success) {
      todos.value = response.data.todos
    }
    
    return response.data
  }

  /**
   * 添加新任务
   * @param {number} userId - 用户ID
   * @param {string} title - 任务标题
   * @returns {object} - 接口返回的数据
   */
  const addTodo = async (userId, title) => {
    // 发送 POST 请求添加任务
    const response = await api.post('/todo/add', { user_id: userId, title })
    
    // 如果成功，重新获取任务列表以更新界面
    if (response.data.success) {
      await fetchTodos(userId)
    }
    
    return response.data
  }

  /**
   * 切换任务完成状态
   * @param {number} id - 任务ID
   * @returns {object} - 接口返回的数据
   */
  const toggleTodo = async (id) => {
    // 发送 POST 请求切换状态
    const response = await api.post('/todo/toggle', { id })
    
    // 如果成功，直接更新本地状态（无需重新请求列表）
    if (response.data.success) {
      const todo = todos.value.find(t => t.id === id)
      if (todo) {
        todo.completed = todo.completed ? 0 : 1
      }
    }
    
    return response.data
  }

  /**
   * 删除任务
   * @param {number} id - 任务ID
   * @returns {object} - 接口返回的数据
   */
  const deleteTodo = async (id) => {
    // 发送 POST 请求删除任务
    const response = await api.post('/todo/delete', { id })
    
    // 如果成功，从本地列表中移除该任务
    if (response.data.success) {
      todos.value = todos.value.filter(t => t.id !== id)
    }
    
    return response.data
  }

  // 返回暴露给外部使用的状态和方法
  return {
    todos,       // 任务列表
    fetchTodos,  // 获取任务列表方法
    addTodo,     // 添加任务方法
    toggleTodo,  // 切换任务状态方法
    deleteTodo   // 删除任务方法
  }
})