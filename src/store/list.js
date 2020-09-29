import http from '~/utils/http'

export default {
  namespaced: true,
  state: () => ({
    userLiveDraft: []
  }),
  mutations: {
    SET_USER_LIVE_DRAFT(store, data) {
      store.userLiveDraft = data
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
    }
  },
  getters: {

  }
}
