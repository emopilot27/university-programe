<template>
  <div class="todo-container">
    <header class="header">
      <h1 class="welcome">欢迎, {{ userStore.user?.username }}</h1>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </header>

    <div class="add-section">
      <input 
        v-model="newTodo" 
        type="text" 
        placeholder="添加新任务..."
        class="add-input"
        @keyup.enter="handleAdd"
      />
      <button class="add-btn" @click="handleAdd">添加</button>
    </div>

    <div class="todo-list">
      <div 
        v-for="todo in todosStore.todos" 
        :key="todo.id" 
        class="todo-item"
      >
        <input 
          type="checkbox" 
          :checked="todo.completed === 1"
          class="checkbox"
          @change="handleToggle(todo.id)"
        />
        <span class="todo-title" :class="{ completed: todo.completed === 1 }">
          {{ todo.title }}
        </span>
        <button class="delete-btn" @click="handleDelete(todo.id)">删除</button>
      </div>

      <div v-if="todosStore.todos.length === 0" class="empty-state">
        暂无任务，添加一个吧！
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useTodosStore } from '../stores/todos'

const router = useRouter()
const userStore = useUserStore()
const todosStore = useTodosStore()

const newTodo = ref('')

onMounted(() => {
  if (!userStore.isLoggedIn()) {
    router.push('/')
    return
  }
  fetchTodos()
})

const fetchTodos = async () => {
  await todosStore.fetchTodos(userStore.user.id)
}

const handleAdd = async () => {
  console.log('【前端 第1步】用户点击了添加按钮')
  const title = newTodo.value.trim()
  console.log('【前端 第1步】输入框内容:', title)
  
  if (!title) {
    console.log('【前端 第1步】标题为空，不发送请求')
    return
  }
  
  console.log('【前端 第2步】准备调用 todosStore.addTodo')
  console.log('【前端 第2步】用户ID:', userStore.user.id)
  console.log('【前端 第2步】任务标题:', title)
  
  const result = await todosStore.addTodo(userStore.user.id, title)
  console.log('【前端 第5步】收到后端返回结果:', result)
  
  newTodo.value = ''
  console.log('【前端 第5步】清空输入框')
}

const handleToggle = async (id) => {
  await todosStore.toggleTodo(id)
}

const handleDelete = async (id) => {
  if (confirm('确定要删除这个任务吗？')) {
    await todosStore.deleteTodo(id)
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.todo-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto 30px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.welcome {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: #f5f5f5;
  border-color: #000;
}

.add-section {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto 30px;
}

.add-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.add-input:focus {
  border-color: #333;
}

.add-btn {
  padding: 12px 24px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #000;
}

.todo-list {
  max-width: 600px;
  margin: 0 auto;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.todo-title {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.todo-title.completed {
  text-decoration: line-through;
  color: #999;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #fff;
  color: #d9534f;
  border: 1px solid #d9534f;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover {
  background-color: #d9534f;
  color: #fff;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>