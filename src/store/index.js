import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    logoutUser(state) {
      state.user = null;
    },
  },
  actions: {
    // opsional: kalau kamu pakai async login via action
    loginUser({ commit }, user) {
      commit('setUser', user);
    }
  },
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => !!state.user,
  },
});
