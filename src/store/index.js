import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    botInfo: null,
    chatObj: {}, // 聊天ws信息存储
    _chatId: null,
  },
  mutations: {
    SET_BOT(state, botInfo) {
      state.botInfo = botInfo
    },
    SET_CHAT_ID(state, chatId) {
      state._chatId = chatId
    },
    ADD_CHAT_MSG(state, data) {
      const chatObj = { ...state.chatObj }
      if (!chatObj[data.chatId]) {
        chatObj[data.chatId] = {
          unreadCount: 0,
          msgList: [],
          time: 0,
        }
      }
      if (data.obj) {
        chatObj[data.chatId].msgList.push(data.obj)
        chatObj[data.chatId].time = Date.now()

        if (data.chatId != state._chatId) {
          chatObj[data.chatId].unreadCount += 1
        }
        if (chatObj[data.chatId].msgList.length > 50) {
          chatObj[data.chatId].msgList.splice(0, 1)
        }
      }
      state.chatObj = chatObj
    },
    READ_CHAT(state, chatId) {
      let chatObj = { ...state.chatObj }
      if (chatObj[chatId]) {
        chatObj[chatId].unreadCount = 0
        state.chatObj = chatObj
      }
    },
    CLEAR_CHAT(state, chatId) {
      let chatObj = { ...state.chatObj }
      if (chatId) {
        chatObj[chatId] = []
      } else {
        chatObj = {}
      }
      state.chatObj = chatObj
    },
  },
})
