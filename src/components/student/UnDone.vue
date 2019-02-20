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
    <md-table v-if="have_un_done_work" v-show="init_finish" v-model="searched" md-sort="gmtCreate" md-sort-order="asc"
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
        md-label="作业没有找到"
        :md-description="`没有找到名为 '${search}' 的作业. 尝试其他关键字进行搜索或者加入新群组`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" @click="onItemClick(item.id)">
        <md-table-cell md-label="组名" md-sort-by="groupName">{{ item.groupName }}</md-table-cell>
        <md-table-cell md-label="作业名" md-sort-by="workName">{{ item.workName }}</md-table-cell>
        <md-table-cell md-label="教师" md-sort-by="teacherName">{{ item.teacherName }}</md-table-cell>
        <md-table-cell md-label="创建时间" md-sort-by="gmtCreate" md-numeric>{{ item.gmtCreate }}</md-table-cell>
      </md-table-row>
    </md-table>
    <pagination v-if="have_un_done_work" v-show="init_finish" :page="works" @last="pageChange('last')"
                @next="pageChange('next')"
                @size="sizeChanged"
                @number="numberChanged"/>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen"
               :md-click-outside-to-close="alert_click_outside_to_close">
      <md-dialog-title>{{selected.workName}}</md-dialog-title>
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
  import {Get, Post} from '@/http';
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
    name: "UnDone",
    components: {Pagination},
    data: () => ({
      page_number: 0,
      page_size: 20,
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
    }),
    methods: {
      searchOnTable() {
        this.searched = searchByName(this.works.content, this.search)
      },
      onItemClick(id) {
        this.selected = this.works.content.find(item => item.id === id);
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
        Get(Student().works_undone + '?page=' + this.page_number + '&size=' + this.page_size).do(response => {
          if (response.data.data.content.length === 0) {
            that.have_un_done_work = false;
            that.init_finish = true;
          } else {
            that.have_un_done_work = true;
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
        let that = this;
        Post(Student().uploadWork + this.selected.id)
          .withFormData({'file': this.file, 'name': this.file_name}, true)
          .withSuccessCode(201)
          .withErrorStartMsg('上传失败：')
          .do(response => {
            that.$toasted.success('上传成功', {
              position: "top-right",
              icon: 'check',
              duration: 3000
            });
            that.file = null;
            that.file_name = '';
            that.initData();
          })
          .doAfter(() => {
            that.file = null;
            that.file_name = '';
          });
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
        localStorage.setItem('size_un_done', size);
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
      let size = Number(localStorage.getItem('size_un_done'));
      if (isNaN(size)) {
        size = 20;
        localStorage.setItem('size_un_done', String(size));
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
