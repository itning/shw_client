<template>
  <div>
    <md-empty-state v-if="!have_un_done_work"
                    md-icon="done_all"
                    md-label="没有需要上交的作业"
                    md-description="太棒了，你已上交全部作业，点击下方按钮你可以查看以往上交的作业">
      <md-button class="md-primary md-raised" @click="routerToDonePage">查看已交作业</md-button>
    </md-empty-state>
    <md-content class="center" v-if="!init_finish">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </md-content>
    <md-table v-if="have_un_done_work" v-show="init_finish" v-model="searched" md-sort="name" md-sort-order="asc"
              md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">未交作业</h1>
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
      <md-dialog-title>{{selected.title}}</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>上传文件</label>
          <md-file @md-change="value => fileChange(value)" v-model="file_name"
                   placeholder="点击图标选择文件..."/>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="startUpload">开始上传</md-button>
        <md-button class="md-primary" @click="showDialog = false">关闭</md-button>
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
      return items.filter(item => toLower(item.groupName).includes(toLower(term)))
    }
    return items
  };
  export default {
    name: "UnDone",
    data() {
      return {
        file: null,
        search: null,
        searched: [],
        selected: {},
        file_name: '',
        showDialog: false,
        alert_fullscreen: false,
        alert_click_outside_to_close: false,
        have_un_done_work: true,
        init_finish: false,
        progress: '0%',
        works: []
      }
    },
    methods: {
      searchOnTable() {
        this.searched = searchByName(this.works, this.search)
      },
      onItemClick(id) {
        this.selected = this.works.find(item => item.id === id);
        this.showDialog = true;
      },
      fileChange(value) {
        this.file = value[0];
      },
      routerToDonePage() {
        this.$router.push('done');
      },
      initData() {
        let that = this;
        this.$store.commit('have_groups');
        axios.get(Student().works_undone, {withCredentials: true})
          .then(function (response) {
            if (response.status === 200) {
              if (response.data.data.length === 0) {
                that.have_un_done_work = false;
                that.init_finish = true;
              } else {
                that.have_un_done_work = true;
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
      },
      startUpload() {
        if (this.file === null) {
          this.$toasted.info('请选择文件', {
            position: "top-right",
            icon: 'clear',
            duration: 1000
          });
          return;
        }
        this.showDialog = false;
        let uploadToast = this.$toasted.info('正在上传：0%', {
          position: "top-right",
          icon: 'hourglass_empty'
        });
        const formData = new FormData();
        const config = {
          headers: {'content-type': 'multipart/form-data'},
          withCredentials: true,
          onUploadProgress: progressEvent => {
            this.progress = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
            uploadToast.text("正在上传：" + this.progress);
            if (this.progress === '100%') {
              uploadToast.goAway(100);
            }
          }
        };
        formData.append('file', this.file);
        formData.append('name', this.file_name);
        let that = this;
        axios.post(Student().uploadWork + this.selected.id, formData, config)
          .then(function (response) {
            if (response.status === 201) {
              that.$toasted.success('上传成功', {
                position: "top-right",
                icon: 'check',
                duration: 3000
              });
              that.file = null;
              that.file_name = '';
              that.initData();
            } else {
              that.file = null;
              that.file_name = '';
              that.$toasted.error('上传失败：' + response.data.msg, {
                position: "top-right",
                icon: 'clear',
                duration: 30000,
                action: {
                  text: '我知道了',
                  onClick: (e, toastObject) => {
                    toastObject.goAway(0);
                  }
                }
              });
            }
          })
          .catch(function (error) {
            if (typeof error.response === 'undefined') {
              that.$toasted.error('登陆超时，请重新登陆', {
                position: "top-right",
                icon: 'clear',
                duration: 2000,
                action: {
                  text: '我知道了',
                  onClick: (e, toastObject) => {
                    toastObject.goAway(0);
                  }
                }
              });
              setTimeout(function () {
                window.location = CAS_LOGIN_URL;
              }, 2000);
            } else {
              that.$toasted.error('上传失败：' + error.response.data.msg, {
                position: "top-right",
                icon: 'clear',
                duration: 30000,
                action: {
                  text: '我知道了',
                  onClick: (e, toastObject) => {
                    toastObject.goAway(0);
                  }
                }
              });
            }
          })
          .then(function () {
            // always executed
          });
      }
    },
    created() {
      this.initData();
    }
  }
</script>

<style scoped>
  .center {
    width: 50px;
    margin: 0 auto;
  }
</style>
