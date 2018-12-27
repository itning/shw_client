<template>
  <div>
    <md-empty-state v-if="!have_done_work"
                    md-icon="done_all"
                    md-label="没有已经上交作业"
                    md-description="点击下方按钮你可以查看还没有上交的作业">
      <md-button class="md-primary md-raised" @click="routerToUnDonePage">查看未交作业</md-button>
    </md-empty-state>
    <md-content class="center" v-if="!init_finish">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </md-content>
    <md-table v-if="have_done_work" v-show="init_finish" v-model="searched" md-sort="name" md-sort-order="asc" md-card
              md-fixed-header>
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
        <md-table-cell md-label="组名" md-sort-by="name">{{ item.groupName }}</md-table-cell>
        <md-table-cell md-label="作业名" md-sort-by="title">{{ item.workName }}</md-table-cell>
        <md-table-cell md-label="教师" md-sort-by="email">{{ item.teacherName }}</md-table-cell>
        <md-table-cell md-label="创建时间" md-sort-by="gender" md-numeric>{{ item.gmtCreate }}</md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen"
               :md-click-outside-to-close="alert_click_outside_to_close">
      <md-dialog-title>{{selected.workName}}</md-dialog-title>
      <md-dialog-content>
        组名：{{selected.workName}}<br><br>
        作业名：{{selected.workName}}<br><br>
        教师：{{selected.teacherName}}<br><br>
        创建时间：{{selected.gmtCreate}}<br><br>
        上传时间：{{selected_upload.gmtCreate}}<br><br>
        文件大小：{{selected_upload.size}}<br><br>
        文件类型：{{selected_upload.mime}}<br><br>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="">下载</md-button>
        <md-button class="md-primary" @click="closeDialog">关闭</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import dayjs from 'dayjs'
  import {CAS_LOGIN_URL, Student} from "@/api";

  const toLower = text => {
    return text.toString().toLowerCase()
  };

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.workName).includes(toLower(term)))
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
        selected_upload: {},
        showDialog: false,
        alert_fullscreen: false,
        alert_click_outside_to_close: false,
        have_done_work: true,
        init_finish: false,
        works: []
      }
    },
    methods: {
      searchOnTable() {
        this.searched = searchByName(this.works, this.search)
      },
      onItemClick(id) {
        this.selected = this.works.find(item => item.id === id);
        this.selected_upload = {gmtCreate: '加载中...', size: '加载中...', mime: '加载中...'};
        this.showDialog = true;
        let that = this;
        axios.get(Student().upload + id, {withCredentials: true})
          .then(function (response) {
            if (response.status === 200) {
              let temp = response.data.data;
              temp.gmtCreate = dayjs(temp.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
              temp.gmtModified = dayjs(temp.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
              that.selected_upload = temp;
            } else {
              alert('服务端错误，请稍后再试。状态码：' + response.status);
            }
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            if (typeof error.response === 'undefined') {
              window.location = CAS_LOGIN_URL;
            } else {
              return Promise.reject(error)
            }
          })
          .then(function () {
            // always executed
          });
      },
      fileChange(value) {
        console.log(value)
      },
      routerToUnDonePage() {
        this.$router.push('un_done');
      },
      closeDialog() {
        this.showDialog = false;
        this.selected_upload = {};
      }
    },
    created() {
      let that = this;
      axios.get(Student().works_done, {withCredentials: true})
        .then(function (response) {
          if (response.status === 200) {
            if (response.data.data.length === 0) {
              that.have_done_work = false;
              that.init_finish = true;
            } else {
              that.have_done_work = true;
              that.works = response.data.data.map(work => {
                work.gmtCreate = dayjs(work.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
                work.gmtModified = dayjs(work.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
                return work;
              });
              that.searched = that.works;
              that.init_finish = true;
            }
          } else {
            alert('服务端错误，请稍后再试。状态码：' + response.status);
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          if (typeof error.response === 'undefined') {
            window.location = CAS_LOGIN_URL;
          } else {
            return Promise.reject(error)
          }
        })
        .then(function () {
          // always executed
        });
    }
  }
</script>

<style scoped>
  .center {
    width: 50px;
    margin: 0 auto;
  }
</style>
