import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welome" */ 'components/login/Login')
const Home = () => import(/* webpackChunkName: "login_home_welome" */ 'components/home/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welome" */ 'components/home/welcome/Welcome')


const User = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/home/user/User')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/home/power/rights/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/home/power/roles/Roles')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ 'components/home/goods/cate/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ 'components/home/goods/params/Params')


const List = () => import(/* webpackChunkName: "GoodsList_Add" */ 'components/home/goods/list/List')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ 'components/home/goods/list/children/Add')

const Orders = () => import(/* webpackChunkName: "Order_Report" */ 'components/home/orders/Orders')
const Report = () => import(/* webpackChunkName: "Order_Report" */ 'components/home/report/Report')
Vue.use(VueRouter)

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
