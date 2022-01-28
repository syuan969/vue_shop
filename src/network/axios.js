import axios from 'axios'
import Vue from 'vue'

axios.defaults.baseURL ="http://82.157.53.213:8886/api/private/v1/"
Vue.prototype.$http=axios;