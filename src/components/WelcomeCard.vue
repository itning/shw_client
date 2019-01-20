<template>
  <transition name="fade">
    <md-card class="md-card-info" v-if="show">
      <md-card-header>
        <div class="md-title">{{title}}</div>
      </md-card-header>
      <md-card-content>
        <slot></slot>
      </md-card-content>
      <md-card-actions>
        <md-button @click="setInfoCardDisable">我知道了</md-button>
      </md-card-actions>
    </md-card>
  </transition>
</template>

<script>
  export default {
    props: ['localStorage', 'title'],
    name: "WelcomeCard",
    data: () => ({
      show: true
    }),
    methods: {
      setInfoCardDisable() {
        this.show = false;
        window.localStorage.setItem(this.localStorage, 'false');
      },
    },
    created() {
      let key = window.localStorage.getItem(this.localStorage);
      if (key != null) {
        this.show = (key === 'true');
      }
    }
  }
</script>

<style scoped>

</style>
