'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  BASE_API: '"http://localhost:9001"', //配置全局路由基础路径
  OSS_PATH: '"https://my-space-keepli.oss-cn-guangzhou.aliyuncs.com"'
  
})
