import Vue from 'vue'
import Router from 'vue-router'
import {Get} from "@/http";
import {Student, Teacher} from "@/api";
import store from "@/store";
import User from '@/user';

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
      component: () => import(/* webpackChunkName: "welcome" */ '@/components/Welcome.vue'),
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
      component: () => import(/* webpackChunkName: "un_done" */ '@/components/student/UnDone.vue'),
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
      component: () => import(/* webpackChunkName: "done" */ '@/components/student/Done.vue'),
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
      component: () => import(/* webpackChunkName: "group" */ '@/components/Group.vue'),
    },
    {
      path: '/work/:id',
      name: 'Work',
      component: () => import(/* webpackChunkName: "work" */ '@/components/teacher/Work.vue'),
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
      component: () => import(/* webpackChunkName: "work_details" */ '@/components/teacher/WorkDetails.vue'),
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
      path: '/preview/:type/:url',
      name: 'Preview',
      component: () => import(/* webpackChunkName: "preview" */ '@/components/teacher/Preview.vue'),
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
      component: () => import(/* webpackChunkName: "welcome" */ '@/components/Welcome.vue'),
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
