import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/student/Welcome'
import Group from '@/components/student/Group'
import UnDone from '@/components/student/UnDone'
import Done from '@/components/student/Done'
import PersonalCenter from '@/components/student/PersonalCenter'

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
    }
  ]
})
