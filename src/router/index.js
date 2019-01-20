import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Group from '@/components/student/Group'
import UnDone from '@/components/student/UnDone'
import Done from '@/components/student/Done'
import PersonalCenter from '@/components/PersonalCenter'
import Work from '@/components/teacher/Work'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/welcome'
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
      path: '/work',
      name: 'Work',
      component: Work
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
})
