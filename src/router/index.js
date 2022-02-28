import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from 'components/login/Login.vue'
import Home from 'components/home/Home.vue'
import Welcome from 'components/home/welcome/Welcome.vue'
import User from 'components/home/user/User.vue'
import Rights from 'components/home/power/rights/Rights.vue'
import Roles from 'components/home/power/roles/Roles.vue'
import Cate from 'components/home/goods/cate/Cate.vue'
import Params from 'components/home/goods/params/Params.vue'
import List from 'components/home/goods/list/List.vue'
import Add from 'components/home/goods/list/children/Add'
import Orders from 'components/home/orders/Orders'
import Report from 'components/home/report/Report'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: User
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }, {
      path: '/goods',
      component: List
    }, {
      path: '/goods/add',
      component: Add
    }, {
      path: '/orders',
      component: Orders
    },{
      path: '/reports',
      component: Report
    }]
  },
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, form, next) => {
  // to 将访问哪一个路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数,表示放行
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login');
  next()
})
export default router
