import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Group from '@/components/student/Group'
import UnDone from '@/components/student/UnDone'
import Done from '@/components/student/Done'
import PersonalCenter from '@/components/PersonalCenter'
import WorkPanel from '@/components/teacher/WorkPanel'
import GroupPanel from '@/components/teacher/GroupPanel'

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
      path: '/group_panel',
      name: 'GroupPanel',
      component: GroupPanel
    },
    {
      path: '/work_panel',
      name: 'WorkPanel',
      component: WorkPanel
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
})
