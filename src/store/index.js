import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    botInfo: null,
  },
  mutations: {
    setBot(state, botInfo) {
      state.botInfo = botInfo
    },
  },
})
