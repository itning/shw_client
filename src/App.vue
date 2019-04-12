<template>
  <div class="page-container height_100">
    <md-app class="height_100" md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title md-xsmall-hide">哈信息学生作业管理系统</span>
        <div class="md-toolbar-section-end">
          <md-badge :md-content="notices.length" v-if="isHaveNotifications">
            <md-button class="md-icon-button" @click="showNotificationsList=!showNotificationsList">
              <md-icon>notifications</md-icon>
              <md-tooltip md-delay="300" md-direction="bottom">您有{{notices.length}}条新的通知</md-tooltip>
            </md-button>
          </md-badge>
          <md-button class="md-icon-button" v-if="!isHaveNotifications">
            <md-icon>notifications</md-icon>
            <md-tooltip md-delay="200" md-direction="bottom">没有通知需要处理</md-tooltip>
          </md-button>
          <transition name="fade">
            <md-list v-for="notice in notices" :key="notice.id" class="notifications-list md-elevation-6"
                     v-show="showNotificationsList">
              <md-subheader>{{notice.title}}</md-subheader>
              <md-list-item>
                <span class="md-list-item-text">{{notice.content}}</span>
                <md-tooltip md-delay="1000" md-direction="bottom">{{notice.content}}</md-tooltip>
                <md-button class="md-raised md-primary" @click="showNotificationsList=false">我知道了</md-button>
                <md-button class="md-raised md-accent" @click="clearNotice(notice.id)">清除通知</md-button>
              </md-list-item>
            </md-list>
          </transition>
          <md-menu md-direction="bottom-end">
            <md-button class="md-icon-button" md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="">{{user.name}}</md-menu-item>
              <md-menu-item @click="logout">注销登陆</md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">{{user.name}} {{user.no}}</md-toolbar>

        <md-list>
          <md-list-item @click="pushRouter('/un_done')" v-if="this.$user.user_is_student">
            <md-icon>clear</md-icon>
            <span class="md-list-item-text">未交作业</span>
          </md-list-item>

          <md-list-item @click="pushRouter('/done')" v-if="this.$user.user_is_student">
            <md-icon>done</md-icon>
            <span class="md-list-item-text">已交作业</span>
          </md-list-item>

          <md-list-item @click="pushRouter('/work/all')" v-if="this.$user.user_is_teacher">
            <md-icon>work</md-icon>
            <span class="md-list-item-text">作业管理</span>
          </md-list-item>

          <md-list-item @click="pushRouter('/group')">
            <md-icon>group</md-icon>
            <span class="md-list-item-text">群组管理</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content class="height_100">
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
  import {BASE_URL, Student} from "@/api";
  import {Del, Get} from "@/http";

  export default {
    name: 'App',
    data: () => ({
      menuVisible: false,
      isHaveNotifications: false,
      showNotificationsList: false,
      notices: [],
      user: {}
    }),
    methods: {
      pushRouter(path) {
        this.$router.push(path);
        this.menuVisible = false;
      },
      logout() {
        window.localStorage.removeItem('authorization_token');
        window.location.href = BASE_URL + "/logout";
      },
      initNotices() {
        let that = this;
        Get(Student().notices)
          .do(response => {
            that.notices = response.data.data;
            that.isHaveNotifications = this.notices.length !== 0;
          })
      },
      clearNotice(id) {
        let that = this;
        Del(Student().delNotice + id)
          .withSuccessCode(204)
          .do(response => {
            that.initNotices();
          })
      }
    },
    created() {
      this.user = this.$user.loginUser;
      if ("fundebug" in window) {
        fundebug.silentHttp = true;
        fundebug.setHttpBody = true;
        fundebug.releasestage = "production";
        fundebug.metaData = this.user;
      }
      if (this.$user.user_is_student) {
        this.initNotices();
      }
    }
  }
</script>

<style scoped>
  .md-drawer {
    width: 230px;
  }

  .notifications-list {
    position: absolute;
    top: 70px;
    right: 4%;
    width: 400px;
    border-radius: 6px;
  }

  .notifications-list button {

  }
</style>
<style>
  html, body {
    height: 100%
  }

  .height_100 {
    height: 100%
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
