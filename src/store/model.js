import http from '~/utils/http'

export default {
  namespaced: true,
  state: () => ({
    user: null
  }),
  mutations: {
    SET_MODEL_DATA(state, { type, data }) {
      state[type] = data
    }
  },
  actions: {
    getModelData({ state, commit }, { type, slug }) {
      if (state.user && state.user.slug === slug) {
        return
      }

      http.get('user/show', { slug })
        .then(data => {
          commit('SET_MODEL_DATA', { type, data })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  getters: {
    current: (state) => ({ type, slug }) => {
      if (!state[type] || state[type].slug !== slug) {
        return null
      }

      return state[type]
    }
  }
}
