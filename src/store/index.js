import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    botInfo: null,
  },
  mutations: {
    setBot(state, botInfo) {
      state.botInfo = botInfo
    },
  },
})
