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
    },
    user_is_teacher: state => {
      return state.user.userType === '13'
    },
    user_is_student: state => {
      return state.user.userType === '99'
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
