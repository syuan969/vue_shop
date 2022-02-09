import axios from 'axios'
import Vue from 'vue'

axios.defaults.baseURL ="http://82.157.53.213:8886/api/private/v1/";
axios.interceptors.request.use(config=>{
  // console.log(config);
  config.headers.Authorization=window.sessionStorage.getItem('token')
  // 最后必须return 
  return config
})
Vue.prototype.$http=axios;