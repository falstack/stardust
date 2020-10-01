import http from '~/utils/http'

export default {
  namespaced: true,
  state: () => ({
    userLiveDraft: []
  }),
  mutations: {
    SET_USER_LIVE_DRAFT(store, data) {
      store.userLiveDraft = data
    },
    DEL_USER_LIVE_DRAFT(store, id) {
      store.userLiveDraft.forEach((item, index) => {
        if (item.id === id) {
          store.userLiveDraft.splice(index, 1)
        }
      })
    }
  },
  actions: {
    getUserLiveDraft({ state, commit }) {
      if (state.userLiveDraft.length) {
        return
      }
      http.get('live_room/drafts')
        .then(res => {
          commit('SET_USER_LIVE_DRAFT', res.result)
        })
    },
    delUserLiveDraft({ commit }, { id }) {
      return new Promise((resolve, reject) => {
        http.post('live_room/delete', {
          id
        })
          .then(() => {
            commit('DEL_USER_LIVE_DRAFT', id)
            resolve()
          })
          .catch(reject)
      })
    }
  },
  getters: {

  }
}
