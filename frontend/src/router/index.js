import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import TodoList from '../views/TodoList.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/todos',
    name: 'TodoList',
    component: TodoList
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router