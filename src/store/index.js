import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //用户有群组？
    have_groups: false
  },
  mutations: {
    none_groups(state) {
      state.have_groups = false;
    },
    have_groups(state) {
      state.have_groups = true;
    }
  }
})
