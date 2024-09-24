import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import '@/assets/theme/element-variables.scss'
import '@/assets/theme/index.scss'
import router from './router'
import store from './store'
import md5 from 'js-md5'
import websocket from './utils/socket/webSocket';
import {eventBus} from './utils/eventBus'

import Print from 'vue-print-nb'
Vue.use(Print)


import { i18n } from '@/i18n/index.js'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
Vue.prototype.$md5 = md5;
Vue.prototype.$websocket = websocket
Vue.prototype.$bus = eventBus

new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')
