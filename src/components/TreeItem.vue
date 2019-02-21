<template>
  <li>
    <div :class="{bold: isFolder}" @click="toggle">
      <span v-if="isFolder"><md-icon>{{ open ? 'folder_open' : 'folder' }}</md-icon></span>
      <span v-else><md-icon>attachment</md-icon></span>
      {{ model.text }}
    </div>
    <ul v-show="open" v-if="isFolder">
      <tree-item @preview="upEvent" v-for="(m,i) in model.children" :key="i" :model="m"/>
    </ul>
  </li>
</template>

<script>
  export default {
    name: "TreeItem",
    props: {
      model: Object
    },
    data: () => {
      return {
        open: false
      }
    },
    computed: {
      isFolder: function () {
        return !this.model.isFile
      }
    },
    methods: {
      toggle() {
        if (this.isFolder) {
          this.open = !this.open
        } else {
          this.$emit('preview', this.model.filePath);
        }
      },
      upEvent(i) {
        this.$emit('preview', i);
      }
    }
  }
</script>

<style scoped>
  .bold {
    font-weight: bold;
  }

  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: none;
  }
</style>
