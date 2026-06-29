<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">待办应用</h1>
      
      <div class="tabs">
        <button 
          class="tab" 
          :class="{ active: isLogin }"
          @click="isLogin = true"
        >
          登录
        </button>
        <button 
          class="tab" 
          :class="{ active: !isLogin }"
          @click="isLogin = false"
        >
          注册
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="input-group">
          <input 
            v-model="username" 
            type="text" 
            placeholder="用户名"
            class="input"
            required
          />
        </div>
        <div class="input-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="密码"
            class="input"
            required
          />
        </div>
        <button type="submit" class="submit-btn">
          {{ isLogin ? '登录' : '注册' }}
        </button>
      </form>

      <p v-if="message" class="message" :class="{ error: isError }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { register, login } from '../api'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const username = ref('')
const password = ref('')
const message = ref('')
const isError = ref(false)

const handleSubmit = async () => {
  message.value = ''
  isError.value = false

  try {
    let response
    if (isLogin.value) {
      response = await login(username.value, password.value)
    } else {
      response = await register(username.value, password.value)
    }

    if (response.data.success) {
      userStore.login(response.data.token, response.data.user)
      router.push('/todos')
    } else {
      isError.value = true
      message.value = response.data.message
    }
  } catch (error) {
    isError.value = true
    message.value = '网络错误，请稍后重试'
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  font-family: sans-serif;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
}

.tab {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.tab:hover {
  color: #333;
}

.tab.active {
  color: #000;
  font-weight: 600;
  border-bottom: 2px solid #000;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input {
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  background: transparent;
}

.input:focus {
  border-bottom-color: #333;
}

.input::placeholder {
  color: #999;
}

.submit-btn {
  padding: 12px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #000;
}

.message {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #333;
}

.message.error {
  color: #d9534f;
}
</style>