<template>
  <div>
    <md-content class="center" v-if="!init_finish">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </md-content>
    <md-empty-state v-if="show_empty"
                    md-icon="work_off"
                    md-label="没有作业"
                    md-description="该群组没有已经创建的作业，点击下方按钮来创建第一个作业">
      <md-button class="md-primary md-raised" @click="addBtn">创建作业</md-button>
    </md-empty-state>
    <md-table v-if="have_work" v-show="init_finish" v-model="searched" md-sort="gmtCreate" md-sort-order="asc" md-card
              md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">{{groupName}}群组作业管理</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="键入作业名进行搜索..." v-model="search" @input="searchOnTable"/>
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="群组没有找到"
        :md-description="`没有找到名为 '${search}' 的作业. 尝试其他关键字进行搜索或者创建新作业`">
        <md-button class="md-primary md-raised" @click="addBtn">创建新作业</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" @click="onItemClick(item.id)">
        <md-table-cell md-label="作业名" md-sort-by="workName">{{ item.workName }}</md-table-cell>
        <md-table-cell md-label="创建时间" md-sort-by="gmtCreate" md-numeric>{{ item.gmtCreate }}</md-table-cell>
        <md-table-cell md-label="状态" md-sort-by="enabled" md-numeric>{{ item.enabled?'开启':'关闭' }}</md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog-prompt
      @md-confirm="createWork"
      :md-active.sync="show_work_dialog"
      v-model="new_work_name"
      md-title="创建作业"
      md-input-maxlength="30"
      md-input-placeholder="键入作业名"
      md-confirm-text="完成"
      md-cancel-text="取消"/>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen">
      <md-dialog-title>作业详情</md-dialog-title>
      <md-dialog-content>
        编号：{{selected.id}}<br><br>
        名称：{{selected.workName}}<br><br>
        文件名规范：{{selected.fileNameFormat}}<br><br>
        开启状态：{{selected.enabled?'已开启':'已关闭'}}<br><br>
        创建时间：{{selected.gmtCreate}}<br><br>
        修改时间：{{selected.gmtModified}}<br><br>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="showDelDialog">删除</md-button>
        <md-button class="md-accent" @click="showModifyDialog">修改</md-button>
        <md-button class="md-primary" @click="showDetails">查看作业上交情况</md-button>
        <md-button class="md-primary" @click="showDialog = false">关闭</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="show_modify_dialog" :md-fullscreen="alert_fullscreen">
      <md-dialog-title>修改作业信息</md-dialog-title>
      <md-dialog-content>
        <md-checkbox v-model="selected.enabled">{{selected.enabled?'作业开启':'作业关闭'}}</md-checkbox>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="modify">保存</md-button>
        <md-button class="md-primary" @click="show_modify_dialog = false">关闭</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="show_del_work_dialog" :md-fullscreen="alert_fullscreen">
      <md-dialog-title>危险！删除作业确认</md-dialog-title>
      <md-dialog-content>
        确定要删除名为 {{selected.workName}} 的作业吗？
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="delWork">删除</md-button>
        <md-button class="md-primary" @click="show_del_work_dialog = false">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-button class="md-fab md-fixed md-fab-bottom-right" @click="addBtn">
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {Del, Get, Patch, Post} from "@/http";
  import {Teacher} from "@/api";

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
    props: ['id'],
    name: "Work",
    data: () => ({
      searched: [],
      search: null,
      selected: {},
      groupName: '',
      init_finish: false,
      have_work: true,
      show_work_dialog: false,
      alert_fullscreen: false,
      show_empty: false,
      showDialog: false,
      show_del_work_dialog: false,
      show_modify_dialog: false,
      new_work_name: '',
    }),
    watch: {},
    methods: {
      initData(groupId = this.id) {
        let that = this;
        Get(Teacher().work + groupId)
          .do(response => {
            if (response.data.data.length === 0) {
              that.have_work = false;
              that.show_empty = true;
            } else {
              that.searched = response.data.data.map(work => {
                work.gmtCreate = dayjs(work.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
                work.gmtModified = dayjs(work.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
                return work;
              });
              that.groupName = that.searched[0].groupName;
              that.have_work = true;
              that.show_empty = false;
            }
          })
          .doAfter(() => {
            that.init_finish = true;
          })
      },
      searchOnTable() {
        this.searched = searchByName(this.groups, this.search)
      },
      onItemClick(id) {
        this.selected = this.searched.find(item => item.id === id);
        this.showDialog = true;
      },
      addBtn() {
        this.show_work_dialog = true;
      },
      createWork() {
        if (this.new_work_name.trim() === '') {
          return;
        }
        this.show_empty = false;
        this.init_finish = false;
        let that = this;
        Post(Teacher().createWork)
          .withSuccessCode(201)
          .withErrorStartMsg('创建失败：')
          .withURLSearchParams({groupId: this.id, workName: this.new_work_name})
          .do(response => {

          })
          .doAfter(() => {
            that.initData();
          })
      },
      showDetails() {
        this.showDialog = false;
        let id = this.selected.id;
        this.$router.push({name: 'WorkDetails', params: {id}});
      },
      showDelDialog() {
        this.showDialog = false;
        this.show_del_work_dialog = true;
      },
      delWork() {
        this.show_del_work_dialog = false;
        let that = this;
        Del(Teacher().delWork + this.selected.id).withSuccessCode(204).withErrorStartMsg('删除失败：').do(response => {
          that.$toasted.success('删除成功', {
            position: "top-right",
            icon: 'check',
            duration: 5000
          });
          that.selected = {};
          that.init_finish = false;
          that.initData();
        });
      },
      showModifyDialog() {
        this.showDialog = false;
        this.show_modify_dialog = true;
      },
      modify() {
        this.show_modify_dialog = false;
        let that = this;
        Patch(Teacher().upWork + this.selected.id + '/' + this.selected.enabled)
          .withSuccessCode(204)
          .withErrorStartMsg('修改失败：')
          .do(response => {
            that.$toasted.success('修改成功', {
              position: "top-right",
              icon: 'check',
              duration: 5000
            });
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
