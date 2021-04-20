import { createStore } from "vuex";

export default createStore({
  state: {
    token: null,
    userID: null,
    discordName: null,
    movies: [],
  },
  mutations: {
    setToken(state, value) {
      state.token = value;
    },
    setUserDetails(state, value) {
      state.userID = value.userID;
      state.token = value.token;
      state.discordName = value.discordName;
    },
    setMovies(state, value) {
      state.movies = value;
    },
  },
  actions: {},
  modules: {},
});
