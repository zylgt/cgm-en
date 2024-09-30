import axios from 'axios'
import {Message, MessageBox, Notification} from 'element-ui'
import signature from '@/utils/signature'
import {getToken} from '@/utils/auth'
import router from '@/router'

let messageFlag = false //弹窗开关

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const request = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env['VUE_APP_API_ROOT'],
  // 超时
  timeout: 60000
})
// request拦截器
request.interceptors.request.use(config => {
  let token = getToken()
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  config.headers['timezone'] = 8
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?'
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName]
      var part = encodeURIComponent(propName) + '='
      if (value !== null && typeof (value) !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            url += subPart + encodeURIComponent(value[key]) + '&'
          }
        } else {
          url += part + encodeURIComponent(value) + '&'
        }
      }
    }
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  config.headers = {...config.headers,...signature(config.data)}
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(async res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 1000
    const msg = res.data.msg
    if (code === 2002) {
     
      if(!messageFlag){
        messageFlag = true
        MessageBox.confirm('Please log in again', 'System prompt', {
            confirmButtonText: 'Login again',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          messageFlag = false
          router.replace('/login')
        }).catch(() => {
          messageFlag = false
        })
      }
     
      return Promise.reject(msg)
    } else if (code === 2005) {
      if(!messageFlag){
        messageFlag = true
        MessageBox.confirm('Please note that your account has already been logged in on another device. If you wish to continue using, please re verify your login. If not operated by myself, please change your password in a timely manner.', 'Account logout reminder', {
            confirmButtonText: 'Confirm',
            showCancelButton:false,
          }
        ).then(() => {
          messageFlag = false
          router.replace('/login')
        }).catch(() => {
          messageFlag = false
        })
      }
     
      return Promise.reject(msg)
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let {message} = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default request
