<template>
  <div>
    <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">已交作业</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="键入作业名进行搜索..." v-model="search" @input="searchOnTable"/>
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="群组没有找到"
        :md-description="`没有找到名为 '${search}' 的组. 尝试其他关键字进行搜索或者加入新群组`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" @click="onItemClick(item.id)">
        <md-table-cell md-label="组名" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="作业名" md-sort-by="title">{{ item.title }}</md-table-cell>
        <md-table-cell md-label="教师" md-sort-by="email">{{ item.teacher }}</md-table-cell>
        <md-table-cell md-label="上交时间" md-sort-by="gender" md-numeric>{{ item.join_data }}</md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen"
               :md-click-outside-to-close="alert_click_outside_to_close">
      <md-dialog-title>{{selected.title}}</md-dialog-title>
      <md-dialog-content>

      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="">下载</md-button>
        <md-button class="md-primary" @click="showDialog = false">关闭</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  const toLower = text => {
    return text.toString().toLowerCase()
  };

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.name).includes(toLower(term)))
    }
    return items
  };
  export default {
    name: "Done",
    data() {
      return {
        search: null,
        searched: [],
        selected: {},
        showDialog: false,
        alert_fullscreen: false,
        alert_click_outside_to_close: false,
        users: [
          {
            id: "1",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "2",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "3",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "4",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "5",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "6",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "7",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "8",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "9",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "10",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
          {
            id: "11",
            name: "群组A群组A群组A群组A群组A",
            teacher: "舒露",
            join_data: "2018/12/19 15:36:25",
            title: "Assistant Media Planner"
          },
        ]
      }
    },
    methods: {
      searchOnTable() {
        this.searched = searchByName(this.users, this.search)
      },
      onItemClick(id) {
        console.log(id);
        this.selected = this.users.find(item => item.id === id);
        this.showDialog = true;
      },
      fileChange(value) {
        console.log(value)
      }
    },
    created() {
      this.searched = this.users
    }
  }
</script>

<style scoped>

</style>
