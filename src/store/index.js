import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
// 该插件用来做vuex数据的持久化存储，否则关闭浏览器之后又需要重新登录
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
// 此方法会将modules目录下的js加入到store中
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  // 解决刷新vuex状态丢失问题
  plugins: [createPersistedState({
    storage: window.sessionStorage // 当前会话持久化存储，如果关闭浏览器则需要重新登录
    // ,reducer(val) {
    //   return {
    //     // 只储存state中的assessmentData
    //     dict: val.dict
    //   }
    // }
  })]
})

export default store
