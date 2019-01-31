import Vue from 'vue'
import Router from 'vue-router'
import {Get} from "@/http";
import {Student, Teacher} from "@/api";
import store from "@/store";
import User from '@/user';

Vue.use(Router);

const Welcome = r => require.ensure([], () => r(require('@/components/Welcome')), 'Welcome');
const Group = r => require.ensure([], () => r(require('@/components/Group')), 'Group');
const UnDone = r => require.ensure([], () => r(require('@/components/student/UnDone')), 'UnDone');
const Done = r => require.ensure([], () => r(require('@/components/student/Done')), 'Done');
const Work = r => require.ensure([], () => r(require('@/components/teacher/Work')), 'Work');
const WorkDetails = r => require.ensure([], () => r(require('@/components/teacher/WorkDetails')), 'WorkDetails');
const PersonalCenter = r => require.ensure([], () => r(require('@/components/PersonalCenter')), 'PersonalCenter');

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
      component: Welcome,
      beforeEnter: (to, from, next) => {
        window.localStorage.removeItem('student_groups');

        let info = Vue.toasted.info('检查群组状态', {
          position: "top-right",
          icon: 'hourglass_empty'
        });
        //根据用户角色 99为学生
        if (User.user_is_student) {
          Get(Student().existGroup).withErrorStartMsg('').do(response => {
            if (response.data.data) {
              store.commit('have_groups');
              next('un_done');
            } else {
              store.commit('none_groups');
              next();
            }
          }).doAfter(() => {
            info.goAway(500);
          });
        } else {
          Get(Teacher().existGroup).withErrorStartMsg('').do(response => {
            if (response.data.data) {
              next('group');
            } else {
              next();
            }
          }).doAfter(() => {
            info.goAway(500);
          });
        }
      }
    },
    {
      path: '/un_done',
      name: 'UnDone',
      component: UnDone,
      beforeEnter: (to, from, next) => {
        if (User.user_is_student) {
          next();
          return;
        }
        next('/');
      }
    },
    {
      path: '/done',
      name: 'Done',
      component: Done,
      beforeEnter: (to, from, next) => {
        if (User.user_is_student) {
          next();
          return;
        }
        next('/');
      }
    },
    {
      path: '/group',
      name: 'Group',
      component: Group
    },
    {
      path: '/personal_center',
      name: 'PersonalCenter',
      component: PersonalCenter,
      beforeEnter: (to, from, next) => {
        Vue.toasted.info('这什么都没有', {
          position: "top-right",
          icon: 'web',
          duration: 2000
        });
      }
    },
    {
      path: '/work/:id',
      name: 'Work',
      component: Work,
      props: true,
      beforeEnter: (to, from, next) => {
        if (User.user_is_teacher) {
          next();
          return;
        }
        next('/');
      }
    },
    {
      path: '/work_details/:id',
      name: 'WorkDetails',
      component: WorkDetails,
      props: true,
      beforeEnter: (to, from, next) => {
        if (User.user_is_teacher) {
          next();
          return;
        }
        next('/');
      }
    },
    {
      path: '/token/:id',
      name: 'token',
      component: Welcome,
      beforeEnter: (to, from, next) => {
        window.localStorage.setItem('authorization_token', to.params.id);
        window.location.href = window.location.protocol + '//' + window.location.host;
        next(false);
      }
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/token')) {
    next();
    return;
  }
  let path = window.localStorage.getItem('last_path');
  if (path !== null) {
    window.localStorage.removeItem('last_path');
    next(path);
  } else {
    next();
  }
});
export default router;
