import { createStore } from 'vuex'

const store = createStore({
  state: () => ({
    numbers: [1, 2, 3]
  }),
  mutations: {
    ADD_NUMBER(state, payload) {
      state.numbers.push(payload)
    }
  },
  actions: {
    addNumber(context, number) {
      context.commit('ADD_NUMBER', number)
    }
  },
  getters: {
    getNumbers(state) {
      return state.numbers
    }
  }
})

export default store
