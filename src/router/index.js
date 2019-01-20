import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Group from '@/components/Group'
import UnDone from '@/components/student/UnDone'
import Done from '@/components/student/Done'
import PersonalCenter from '@/components/PersonalCenter'
import Work from '@/components/teacher/Work'
import WorkDetails from '@/components/teacher/WorkDetails'

Vue.use(Router);

let router = new Router({
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
      path: '/work/:id',
      name: 'Work',
      component: Work,
      props: true
    },
    {
      path: '/work_details/:id',
      name: 'WorkDetails',
      component: WorkDetails,
      props: true
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
router.beforeEach((to, from, next) => {
  let path = window.localStorage.getItem('last_path');
  if (path !== null) {
    window.localStorage.removeItem('last_path');
    next(path);
  } else {
    next();
  }
});
export default router;
