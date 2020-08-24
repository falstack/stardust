import { createStore } from 'vuex'
import { oAuthLogin, getUserRole, logoutAction } from '~/utils/login'
import toast from '~/utils/toast'
import cache from '~/utils/cache'

const store = createStore({
  state: () => ({
    userInfo: null,
    userRole: []
  }),
  mutations: {
    UPDATE_USER_INFO(state, user) {
      state.userInfo = user
      cache.set('USER_INFO', user)
    },
    UPDATE_USER_ROLE(state, role) {
      state.userRole = role
    }
  },
  actions: {
    async userLogin(ctx) {
      try {
        const user = await oAuthLogin()
        ctx.commit('UPDATE_USER_INFO', user)
        if (user && user.title.length) {
          const roles = await getUserRole()
          ctx.commit('UPDATE_USER_ROLE', roles)
        }
      } catch (e) {
        toast.info('登录失败，请稍后再试~')
        cache.remove('JWT_TOKEN')
        cache.remove('USER_INFO')
      }
    },
    async userLogout(ctx) {
      try {
        await logoutAction()
      } catch (e) {
        // do nothing
      }
      cache.remove('JWT_TOKEN')
      cache.remove('USER_INFO')
      ctx.commit('UPDATE_USER_INFO', null)
    }
  },
  getters: {
    isGuest: (state) => {
      if (!state.userInfo) {
        return true
      }
      return !state.userInfo.providers.bind_phone
    },
    hasRole: (role) => (state) => {
      if (!state.userInfo) {
        return false
      }
      if (state.userInfo.is_admin) {
        return true
      }
      return ~state.userRole.indexOf(role)
    }
  }
})

export default store
