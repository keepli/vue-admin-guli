import { constantRoutes } from '@/router'
import { getMenu } from '@/api/login'
import Layout from '@/views/layout/Layout'

function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  try {
    console.log('permission/filterAsyncRouter方法执行..拼装成动态路由所需要的数组形式')
    const accessedRouters = asyncRouterMap.filter(route => {
      if (route.component) {
        if (route.component === 'Layout') { // Layout组件特殊处理
          route.component = Layout
        } else {
          const component = route.component
          route.component = resolve => {
            require(['@/views' + component + '.vue'], resolve)// 引入组件(将route.component变成模块)
          }
        }
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    })
    return accessedRouters
  } catch (e) {
    console.log(e)
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes({ commit }, roles) {
    // 取后台路由
    console.log('permission/generateRoutes方法执行..获取菜单列表')
    const asyncRouter = await getMenu()

    return new Promise(resolve => {
      const tmp = asyncRouter.data.permissionList
      console.log(tmp)
      const accessedRoutes = filterAsyncRouter(tmp)

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)// 执行成功返回accessedRoutes
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
