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
    getModelData({ state, commit }, { type, id }) {
      if (state.user && state.user.id === +id) {
        return
      }

      http.get('user/show', {
        slug: id
      })
        .then(data => {
          commit('SET_MODEL_DATA', { type, data })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  getters: {
    current: (state) => ({ type, id }) => {
      if (!state[type] || state[type].id !== +id) {
        return null
      }

      return state[type]
    }
  }
}
