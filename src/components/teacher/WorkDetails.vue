<template>

</template>

<script>
  import User from '@/user'

  export default {
    name: "WorkDetails",
    data: () => ({}),
    methods: {},
    beforeRouteEnter(to, from, next) {
      if (User.user_is_teacher) {
        next();
        return;
      }
      next('/');
    }
  }
</script>

<style scoped>

</style>
