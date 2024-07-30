import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import socket from './modules/socket'
import report from './modules/report'
import setting from './modules/setting'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    socket,
    report,
    setting
  },
  getters
})

export default store
