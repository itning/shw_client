<template>
  <div class="page-container height_100">
    <md-app class="height_100" md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title md-xsmall-hide">哈信息学生作业管理系统</span>
        <div class="md-toolbar-section-end">
          <md-badge md-content="1" v-if="isHaveNotifications">
            <md-button class="md-icon-button" @click="showNotificationsList=!showNotificationsList">
              <md-icon>notifications</md-icon>
              <md-tooltip md-delay="300" md-direction="bottom">您有1条新的邀请</md-tooltip>
            </md-button>
          </md-badge>
          <md-button class="md-icon-button" v-if="!isHaveNotifications">
            <md-icon>notifications</md-icon>
            <md-tooltip md-delay="200" md-direction="bottom">没有通知需要处理</md-tooltip>
          </md-button>
          <transition name="fade">
            <md-list class="notifications-list md-elevation-2" v-show="showNotificationsList">
              <md-subheader>群组邀请</md-subheader>
              <md-list-item>
                <span class="md-list-item-text">XX邀请你加入XXXXXXXXXXXX群组</span>
                <md-tooltip md-delay="1000" md-direction="bottom">XX邀请你加入XXXXXXXXXXXX群组</md-tooltip>
                <md-button class="md-icon-button">
                  <md-icon>done</md-icon>
                  <md-tooltip md-delay="300" md-direction="bottom">同意加入</md-tooltip>
                </md-button>
                <md-button class="md-icon-button">
                  <md-icon>clear</md-icon>
                  <md-tooltip md-delay="300" md-direction="bottom">拒绝加入</md-tooltip>
                </md-button>
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

          <md-list-item @click="pushRouter('/group')">
            <md-icon>group</md-icon>
            <span class="md-list-item-text">群组管理</span>
          </md-list-item>

          <md-list-item @click="pushRouter('/personal_center')">
            <md-icon>account_circle</md-icon>
            <span class="md-list-item-text">个人中心</span>
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
  import {BASE_URL} from "@/api";

  export default {
    name: 'App',
    data: () => ({
      menuVisible: false,
      isHaveNotifications: false,
      showNotificationsList: false,
      user: {}
    }),
    methods: {
      pushRouter(path) {
        if (path === 'group') {
          //TODO 判断角色
        }
        this.$router.push(path);
        this.menuVisible = false;
      },
      logout() {
        window.localStorage.removeItem('authorization_token');
        window.location.href = BASE_URL + "/logout";
      }
    },
    created() {
      this.user = this.$user.loginUser;
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
    background-color: #c2c2c2;
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
