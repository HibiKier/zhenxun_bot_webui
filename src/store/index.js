import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    botInfo: null,
    chatObj: {}, // 聊天ws信息存储
  },
  mutations: {
    SET_BOT(state, botInfo) {
      state.botInfo = botInfo
    },
    ADD_CHAT_MSG(state, data) {
      const chatObj = { ...state.chatObj }
      if (!chatObj[data.chatId]) {
        chatObj[data.chatId] = []
      }

      chatObj[data.chatId].push(data.obj)
      if (chatObj[data.chatId].length > 50) {
        chatObj[data.chatId].splice(0, 1)
      }
      state.chatObj = chatObj
    },
    CLEAR_CHAT(state, chatId) {
      const chatObj = { ...state.chatObj }
      chatObj[chatId] = []
      state.chatObj = chatObj
    },
  },
})
