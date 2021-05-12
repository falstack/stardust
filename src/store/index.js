import { createStore } from 'vuex'
import { logoutAction } from '~/utils/login'
import cache from '~/utils/cache'
import live from './live'
import model from './model'
import list from './list'
import * as api from '~/utils/api'

const store = createStore({
  state: () => ({
    userInfo: null,
    userRole: [],
    authCode: ''
  }),
  mutations: {
    UPDATE_USER_INFO(state, user) {
      state.userInfo = user
      cache.set('USER_INFO', user)
    },
    UPDATE_USER_ROLE(state, role) {
      state.userRole = role
    },
    SET_AUTH_CODE(state, code) {
      state.authCode = code
    }
  },
  actions: {
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

      if (!state.userInfo.providers.bind_phone) {
        return true
      }

      if (!state.userInfo.providers.bind_email) {
        return true
      }

      // return Object.values(state.userInfo.providers).filter(_ => _).length < 2
      return false
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
  },
  modules: {
    live,
    model,
    list: list({ api })
  }
})

export default store
