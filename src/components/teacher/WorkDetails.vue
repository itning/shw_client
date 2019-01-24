<template>
  <div>
    <md-content class="center" v-if="!init_finish">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </md-content>
    <md-empty-state v-if="show_empty"
                    md-icon="work_outline"
                    md-label="没有作业信息"
                    md-description="目前还没有同学加入这个群组，请先邀请同学加入群组吧">
    </md-empty-state>
    <md-table v-if="have_work" v-show="init_finish" v-model="searched" md-sort="student.no" md-sort-order="asc" md-card
              md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">{{workName}}作业管理</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="键入姓名进行搜索..." v-model="search" @input="searchOnTable"/>
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="作业信息没有找到"
        :md-description="`没有找到名为 '${search}' 的学生信息. 尝试其他关键字进行搜索`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" @click="onItemClick(item.student.no)">
        <md-table-cell md-label="姓名" md-sort-by="student.name">{{ item.student.name }}</md-table-cell>
        <md-table-cell md-label="学号" md-sort-by="student.no" md-numeric>{{ item.student.no }}</md-table-cell>
        <md-table-cell md-label="班级" md-sort-by="student.clazzId" md-numeric>{{ item.student.clazzId }}</md-table-cell>
        <md-table-cell md-label="上传时间" md-sort-by="uploadDate" md-numeric>{{item.uploadDate}}</md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen">
      <md-dialog-title>作业详情</md-dialog-title>
      <md-dialog-content>
        学生姓名：{{(selected.student.name)}}<br><br>
        学生学号：{{selected.student.no}}<br><br>
        所属班级：{{selected.student.clazzId}}<br><br>
        <span v-if="selected.up">
        文件大小：{{selected.upload.size}}<br><br>
        文件类型：{{selected.upload.mime}}<br><br>
        创建时间：{{selected.upload.gmtCreate}}<br><br>
        修改时间：{{selected.upload.gmtModified}}<br><br>
        </span>
        作业名称：{{selected.workName}}<br><br>
        所属群组：{{selected.groupName}}
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" v-if="selected.up" @click="down(selected.student.no)">下载作业</md-button>
        <md-button class="md-primary" @click="showDialog = false">关闭</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="showDownAllDialog" :md-fullscreen="alert_fullscreen"
               :md-click-outside-to-close="alert_fullscreen" :md-close-on-esc="alert_fullscreen">
      <md-dialog-title>下载所有</md-dialog-title>
      <md-dialog-content>
        {{down_all_msg}}
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="startDownAll" :disabled="disableDownAllBtn">下载</md-button>
        <md-button class="md-primary" @click="showDownAllDialog = false" :disabled="disableDownAllBtn">关闭</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-button class="md-fab md-fixed md-fab-bottom-right" @click="downAll" :disabled="disable_down_all_btn">
      <md-icon>cloud_download</md-icon>
    </md-button>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {Get} from "@/http";
  import {Student, Teacher} from "@/api";

  const toLower = text => {
    return text.toString().toLowerCase()
  };

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.student.name).includes(toLower(term)))
    }
    return items
  };

  export default {
    props: ['id'],
    name: "WorkDetails",
    data: () => ({
      init_finish: false,
      show_empty: false,
      alert_fullscreen: false,
      showDialog: false,
      disable_down_all_btn: false,
      down_all_msg: '',
      showDownAllDialog: false,
      disableDownAllBtn: true,
      have_work: true,
      search: null,
      searched: [],
      selected: {upload: {}, student: {}},
      work_details: [],
      workName: ''
    }),
    methods: {
      initData(workId = this.id) {
        let that = this;
        Get(Teacher().workDetail + workId)
          .do(response => {
            if (response.data.data.length === 0) {
              that.have_work = false;
              that.show_empty = true;
            } else {
              that.work_details = response.data.data.map(work_detail => {
                if (work_detail.upload !== null) {
                  work_detail.upload.gmtCreate = dayjs(work_detail.upload.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
                  work_detail.upload.gmtModified = dayjs(work_detail.upload.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
                  work_detail.uploadDate = work_detail.upload.gmtCreate;
                  work_detail.upload.size = that.getFormatFileSize(work_detail.upload.size);
                } else {
                  work_detail.uploadDate = '未上传';
                }
                return work_detail;
              });
              that.searched = that.work_details;
              that.workName = that.searched[0].workName;
              that.have_work = true;
              that.show_empty = false;
            }
          })
          .doAfter(() => {
            that.init_finish = true;
          })
      },
      searchOnTable() {
        this.searched = searchByName(this.work_details, this.search)
      },
      onItemClick(id) {
        this.selected = this.work_details.find(item => item.student.no === id);
        this.showDialog = true;
      },
      getFormatFileSize(size) {
        let number = Number(size);
        if (number < 1048576) {
          return (number / 1024).toFixed(2) + ' KB';
        } else if (number < 1073741824) {
          return (number / 1024 / 1024).toFixed(2) + ' MB';
        } else {
          return (number / 1024 / 1024 / 1024).toFixed(2) + ' GB';
        }
      },
      down(no) {
        window.open(Student().downWork + no + '/' + this.id, "_blank");
      },
      startDownAll() {
        window.open(Teacher().downAll + this.id, "_blank");
      },
      downAll() {
        this.disable_down_all_btn = true;
        this.showDownAllDialog = true;
        this.disableDownAllBtn = true;
        this.down_all_msg = '准备中...';
        let that = this;
        let interval = window.setInterval(pong, 2000);

        function pong() {
          Get(Teacher().pack + that.id).do(response => {
            switch (response.data.data) {
              case "START":
                that.down_all_msg = '开始打包...';
                break;
              case "OK":
                window.clearInterval(interval);
                that.down_all_msg = '打包完成';
                that.disable_down_all_btn = false;
                that.disableDownAllBtn = false;
                break;
              case "ERROR":
                that.down_all_msg = '打包错误';
                break;
              default:
                that.down_all_msg = dayjs().format("YYYY-MM-DD HH:mm:ss") + ' 正在打包：' + response.data.data;
            }
          });
        }
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
