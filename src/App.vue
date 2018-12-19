<template>
  <div class="page-container height_100">
    <md-dialog-alert v-if="isNotChrome"
                     :md-active.sync="isNotChrome"
                     md-content="系统可能不支持您的浏览器，请下载Chrome浏览器！"
                     md-confirm-text="好的"/>
    <md-app class="height_100" md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title md-xsmall-hide">哈信息学生作业管理系统</span>
        <div class="md-toolbar-section-end">
          <md-badge md-content="1" v-if="isHaveNotifications">
            <md-button class="md-icon-button">
              <md-icon>notifications</md-icon>
              <md-tooltip md-delay="300" md-direction="bottom">您有1条新的邀请</md-tooltip>
            </md-button>
          </md-badge>
          <md-button class="md-icon-button" v-if="!isHaveNotifications">
            <md-icon>notifications</md-icon>
            <md-tooltip md-delay="300" md-direction="bottom">没有通知需要处理</md-tooltip>
          </md-button>
          <md-menu md-direction="bottom-end">
            <md-button class="md-icon-button" md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="">My Item 1</md-menu-item>
              <md-menu-item @click="">My Item 2</md-menu-item>
              <md-menu-item @click="">My Item 3</md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">舒露</md-toolbar>

        <md-list>
          <md-list-item @click="pushRouter('un_done')">
            <md-icon>clear</md-icon>
            <span class="md-list-item-text">未交作业</span>
          </md-list-item>

          <md-list-item @click="pushRouter('done')">
            <md-icon>done_all</md-icon>
            <span class="md-list-item-text">已交作业</span>
          </md-list-item>

          <md-list-item @click="pushRouter('group')">
            <md-icon>group</md-icon>
            <span class="md-list-item-text">群组管理</span>
          </md-list-item>

          <md-list-item @click="pushRouter('personal_center')">
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
  export default {
    name: 'App',
    data() {
      return {
        menuVisible: false,
        isNotChrome: true,
        isHaveNotifications: false
      }
    },
    methods: {
      pushRouter(path) {
        this.$router.push(path);
        this.menuVisible = false;
      }
    },
    beforeMount() {
      const USER_AGENT = navigator.userAgent.toLowerCase();
      const isChrome = /.*(chrome)\/([\w.]+).*/;
      this.isNotChrome = !isChrome.test(USER_AGENT);
    },
  }
</script>

<style scoped>
  .md-drawer {
    width: 230px;
  }
</style>
<style>
  html, body {
    height: 100%
  }

  .height_100 {
    height: 100%
  }
</style>
