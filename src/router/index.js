import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Group from '@/components/Group'
import UnDone from '@/components/UnDone'
import Done from '@/components/Done'
import PersonalCenter from '@/components/PersonalCenter'
import AllGroup from '@/components/AllGroup'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/un_done'
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/un_done',
      name: 'UnDone',
      component: UnDone
    },
    {
      path: '/done',
      name: 'Done',
      component: Done
    },
    {
      path: '/group',
      name: 'Group',
      component: Group
    },
    {
      path: '/personal_center',
      name: 'PersonalCenter',
      component: PersonalCenter
    },
    {
      path: '/all_group',
      name: 'AllGroup',
      component: AllGroup
    }
  ]
})
