import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    existGroup: false,
    user: {}
  },
  getters: {
    exist_group: state => {
      return state.existGroup;
    },
    user_type: state => {
      return state.user === {} ? '' : state.user.userType;
    }
  },
  mutations: {
    have_groups(state) {
      state.existGroup = true;
    },
    none_groups(state) {
      state.existGroup = false;
    },
    set_user(state, user) {
      state.user = user;
    },
    clear_user(state) {
      state.user = {};
    },
  }
})
