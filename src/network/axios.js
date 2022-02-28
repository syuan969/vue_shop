import axios from 'axios'
import Vue from 'vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL ="https://lianghj.top:8888/api/private/v1/";
axios.interceptors.request.use(config=>{
  // console.log(config);
  NProgress.start()
  config.headers.Authorization=window.sessionStorage.getItem('token')
  // 最后必须return 
  return config
})
// 在reponse拦截器中,隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http=axios;