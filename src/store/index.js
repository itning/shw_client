import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    existGroup: false
  },
  getters: {
    exist_group: state => {
      return state.existGroup;
    }
  },
  mutations: {
    have_groups(state) {
      state.existGroup = true;
    },
    none_groups(state) {
      state.existGroup = false;
    }
  }
})
