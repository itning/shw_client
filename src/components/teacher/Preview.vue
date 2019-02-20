<template>
  <div>
    <iframe :src="src" width="100%" :style="{ height: height}"></iframe>
  </div>
</template>

<script>
  export default {
    props: ['url'],
    name: "Preview",
    data: () => ({
      server_url: 'https://view.officeapps.live.com/op/view.aspx?src=',
      src: '',
      height: "0px"
    }),
    methods: {},
    created() {
      this.height = (document.getElementsByClassName('md-app-content')[0].clientHeight - 32) + 'px';
      this.src = this.server_url + this.url;
    }
  }
</script>

<style scoped>

</style>
