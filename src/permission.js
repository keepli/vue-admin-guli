import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条相关的组件
import 'nprogress/nprogress.css' // 进度条css样式
import { getToken } from '@/utils/auth' // 从cookie中获取令牌的方法

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 不重定向的白名单，其它路径都会被拦截

router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      // 关闭进度条
      NProgress.done()
    } else {
      // 当store中有角色信息直接放行，没有则获取角色信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户角色信息
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('GetInfo')

          // 将从后端获取的菜单参数构建动态路由所需要的数组形式
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log('将从后端获取的菜单参数构建动态路由所需要的数组形式')
          console.log(accessRoutes)
          // dynamically add accessible routes

          // 设置动态路由的方法
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true })
        } catch (error) {
          // 出现错误时调用登出的方法，移除登录所需信息
          await store.dispatch('FedLogOut')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有令牌时调用的代码

    if (whiteList.indexOf(to.path) !== -1) {
      // 路径是不重定向的白名单中则直接放行
      next()
    } else {
      // 不是不重定向的白名单则进行路径跳转
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 路由守卫最后执行的方法，关闭进度条
  NProgress.done()
})
