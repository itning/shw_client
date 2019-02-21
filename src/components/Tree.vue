<template>
  <ul>
    <li v-for="m in model">
      <tree-item
        @preview="pre"
        class="item"
        :model="m"/>
    </li>
  </ul>
</template>

<script>
  import TreeItem from "@/components/TreeItem";

  export default {
    name: "Tree",
    components: {TreeItem},
    props: {
      model: Array
    },
    methods: {
      pre(i) {
        this.$emit('preview', i);
      }
    }
  }
</script>

<style scoped>
  .item {
    cursor: pointer;
  }

  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: none;
  }
</style>
