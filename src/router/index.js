import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from 'components/login/Login.vue'
import Home from 'components/home/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, form, next)=>{
  // to 将访问哪一个路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数,表示放行
  // next() 放行 next('/login') 强制跳转
  if(to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login');
  next()
})
export default router
