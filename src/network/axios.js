import axios from 'axios'
import Vue from 'vue'

axios.defaults.baseURL ="https://lianghj.top:8888/api/private/v1/";
axios.interceptors.request.use(config=>{
  // console.log(config);
  config.headers.Authorization=window.sessionStorage.getItem('token')
  // 最后必须return 
  return config
})
Vue.prototype.$http=axios;