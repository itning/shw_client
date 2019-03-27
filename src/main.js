// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import Toasted from 'vue-toasted';
import User from '@/user'
import * as fundebug from "fundebug-javascript";
import fundebugVue from "fundebug-vue";
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
fundebug.apikey = "2a7ca23266214f8be244652a3d19751ec83e802f16606d4b875f9815eb104327";
fundebugVue(fundebug, Vue);

Vue.config.productionTip = false;

Vue.use(VueMaterial);
Vue.use(Toasted);
Vue.use(User);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
