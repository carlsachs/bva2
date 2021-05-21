//import { createStore, useStore } from "vuex"
import axios from "axios"

export default createStore({
  state: {
    //userid: 0,
    rows: [],
    /*
    socket: {
      isConnected: false,
      message: "",
      reconnectError: false,
    }
    */
  },
  mutations: {
    /*
    SOCKET_ONOPEN(state, event) {
      console.log("SOCKET_ONOPEN")
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE(state, event) {
      console.log("SOCKET_ONCLOSE")
      state.socket.isConnected = false
      //console.log("SOCKET_ONCLOSE: " + new Date())
      console.log(event)
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    SOCKET_ONMESSAGE(state, message) {
      console.log("SOCKET_ONMESSAGE ::: ", message)
      state.socket.message = message
      state.rows = [...state.rows, message]
    },
    SOCKET_RECONNECT(state, count) {
      console.info("RECONNECT...", count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true
    },
    */
    SET_ITEMS(state, payload) {
      state.rows = payload.rows
      console.log("==SET_ITEMS==>", state.rows.length)
    },
    ADD_ITEMS(state, item) {
      state.rows = [...state.rows, ...item]
      console.log("==ADD_ITEMS==>", item)
    },
  },
  actions: {
    /*
    getItems({ commit }, term) {
      console.log("getItems...")
      return axios
        .get("https://bitcoinvsaltcoins.com/api/signals")
        .then((response) => {
          const data = response.data
          console.log("GET_ITEMS LENGTH", data.rows.length)
          commit('SET_ITEMS', { rows: data.rows })
        })
        .catch((err) => {
          console.log("ERRR)R)R)R")
        })
    },
    */
  },
  modules: {}
});


export function getStore() {
  return {
    store: useStore()
  }
}