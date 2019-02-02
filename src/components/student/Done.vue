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
    <md-table v-if="have_done_work" v-show="init_finish" v-model="searched" md-sort="gmtCreate" md-sort-order="asc"
              md-card
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
        md-label="作业没有找到"
        :md-description="`没有找到名为 '${search}' 的作业. 尝试其他关键字进行搜索或者加入新群组`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" @click="onItemClick(item.id)">
        <md-table-cell md-label="组名" md-sort-by="groupName">{{ item.groupName }}</md-table-cell>
        <md-table-cell md-label="作业名" md-sort-by="workName">{{ item.workName }}</md-table-cell>
        <md-table-cell md-label="教师" md-sort-by="teacherName">{{ item.teacherName }}</md-table-cell>
        <md-table-cell md-label="上传时间" md-sort-by="gmtCreate" md-numeric>{{ item.gmtCreate }}</md-table-cell>
      </md-table-row>
    </md-table>
    <pagination v-if="have_done_work" v-show="init_finish" :page="works" @last="pageChange('last')"
                @next="pageChange('next')"
                @size="sizeChanged"
                @number="numberChanged"/>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen"
               :md-click-outside-to-close="alert_click_outside_to_close">
      <md-dialog-title>{{selected.workName}}</md-dialog-title>
      <md-dialog-content>
        组名：{{selected.workName}}<br><br>
        作业名：{{selected.workName}}<br><br>
        教师：{{selected.teacherName}}<br><br>
        创建时间：{{selected.gmtCreate}}<br><br>
        上传时间：{{selected_upload.gmtCreate}}<br><br>
        文件大小：{{getFormatFileSize(selected_upload.size)}}<br><br>
        文件类型：{{selected_upload.mime}}<br><br>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="showDelUploadDialog" :disabled="!selected.enabled">删除</md-button>
        <md-button @click="down">下载</md-button>
        <md-button class="md-primary" @click="closeDialog">关闭</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="show_del_upload_dialog" :md-fullscreen="alert_fullscreen">
      <md-dialog-title>危险！删除文件确认</md-dialog-title>
      <md-dialog-content>
        确定要删除 {{selected.workName}} 吗？
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="delUpload">删除</md-button>
        <md-button class="md-primary" @click="show_del_upload_dialog = false">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {Del, Get} from '@/http';
  import dayjs from 'dayjs'
  import {Student} from "@/api";
  import Pagination from "@/components/Pagination";

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
    components: {Pagination},
    data: () => ({
      page_number: 0,
      page_size: 20,
      search: null,
      searched: [],
      selected: {},
      selected_upload: {},
      showDialog: false,
      alert_fullscreen: false,
      alert_click_outside_to_close: false,
      have_done_work: true,
      init_finish: false,
      show_del_upload_dialog: false,
      works: []
    }),
    methods: {
      searchOnTable() {
        this.searched = searchByName(this.works, this.search)
      },
      showDelUploadDialog() {
        this.show_del_upload_dialog = true;
        this.showDialog = false;
      },
      onItemClick(id) {
        this.selected = this.works.content.find(item => item.id === id);
        this.selected_upload = {gmtCreate: '加载中...', size: '加载中...', mime: '加载中...'};
        this.showDialog = true;
        let that = this;
        Get(Student().upload + id).withSuccessCode(200).withErrorStartMsg('加载失败：').do(response => {
          let temp = response.data.data;
          temp.gmtCreate = dayjs(temp.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
          temp.gmtModified = dayjs(temp.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
          that.selected_upload = temp;
        });
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
      initData() {
        this.init_finish = false;
        let that = this;
        Get(Student().works_done + '?page=' + this.page_number + '&size=' + this.page_size).do(response => {
          if (response.data.data.content.length === 0) {
            that.have_done_work = false;
            that.init_finish = true;
          } else {
            that.have_done_work = true;
            response.data.data.content = response.data.data.content.map(work => {
              work.gmtCreate = dayjs(work.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
              work.gmtModified = dayjs(work.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
              return work;
            });
            that.works = response.data.data;
            that.searched = that.works.content;
            that.init_finish = true;
          }
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
      },
      delUpload() {
        this.show_del_upload_dialog = false;
        let that = this;
        Del(Student().deleteUpload + this.selected.id).withSuccessCode(204).withErrorStartMsg('删除失败：').do(response => {
          that.$toasted.success('删除成功', {
            position: "top-right",
            icon: 'check',
            duration: 2000,
          });
          that.init_finish = false;
          that.initData();
        });
      },
      down() {
        window.open(Student().downWork + this.$user.loginUser.no + '/' + this.selected.id, "_blank");
      },
      pageChange(type) {
        switch (type) {
          case 'last': {
            this.page_number -= 1;
            break;
          }
          case 'next': {
            this.page_number += 1;
            break;
          }
        }
        this.selected = {};
        this.init_finish = false;
        this.initData();
      },
      sizeChanged(size) {
        localStorage.setItem('size_done', size);
        this.page_number = 0;
        this.page_size = size;
        this.selected = {};
        this.init_finish = false;
        this.initData();
      },
      numberChanged(number) {
        this.page_number = number;
        this.selected = {};
        this.init_finish = false;
        this.initData();
      }
    },
    created() {
      let size = Number(localStorage.getItem('size_done'));
      if (isNaN(size)) {
        size = 20;
        localStorage.setItem('size_done', String(size));
      }
      this.page_size = size;
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
