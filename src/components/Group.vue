<template>
  <div>
    <md-content class="center" v-if="!init_finish">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </md-content>
    <div v-show="init_finish">
      <div v-if="this.$user.user_is_student">
        <welcome-card localStorage="show_welcome_card" title="Hi! 欢迎来到群组管理">
          在这里你可以查看你加入的群组,或者加入新的群组，甚至退出你已经加入的群组。<br>
        </welcome-card>
        <welcome-card localStorage="show_info_card" title="群组详情">
          单击群组条目进行群组详情查看，而且你还可以选择退出该群组！
        </welcome-card>
        <welcome-card localStorage="show_add_info_card" title="想要加入群组？">
          看见右下角的红色按钮了吗？<br>单击它试试！
        </welcome-card>
      </div>
      <div v-if="this.$user.user_is_teacher">
        <welcome-card localStorage="show_welcome_card_" title="Hi! 欢迎来到群组管理">
          在这里你可以查看你创建的群组，甚至解散你已经创建的群组。<br>
        </welcome-card>
        <welcome-card localStorage="show_info_card_panel_" title="群组详情">
          单击群组条目进行群组详情查看，而且你还可以选择解散该群组！
        </welcome-card>
        <welcome-card localStorage="show_add_info_card_panel_" title="想要创建群组？">
          看见右下角的红色按钮了吗？<br>单击它试试！
        </welcome-card>
      </div>
      <md-table v-model="searched" md-sort="gmtCreate" md-sort-order="asc" md-card md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title">群组管理</h1>
          </div>

          <md-field md-clearable class="md-toolbar-section-end">
            <md-input placeholder="键入组名进行搜索..." v-model="search" @input="searchOnTable"/>
          </md-field>
        </md-table-toolbar>

        <md-table-empty-state
          md-label="群组没有找到"
          :md-description="`没有找到名为 '${search}' 的组. 尝试其他关键字进行搜索或者${info_msg.add_msg}新群组`">
          <md-button class="md-primary md-raised" @click="addBtn">{{info_msg.add_msg}}新群组</md-button>
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }" @click.ctrl="routerToWork(item.id)"
                      @click="onItemClick(item.id)">
          <md-table-cell md-label="组名" md-sort-by="groupName">{{ item.groupName }}</md-table-cell>
          <md-table-cell md-label="教师" md-sort-by="teacherName">{{ item.teacherName }}</md-table-cell>
          <md-table-cell :md-label="`${info_msg.add_msg}时间`" md-sort-by="gmtCreate" md-numeric>{{ item.gmtCreate }}
          </md-table-cell>
        </md-table-row>
      </md-table>
      <pagination :page="groups" @last="pageChange('last')" @next="pageChange('next')" @size="sizeChanged"
                  @number="numberChanged"/>
      <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen">
        <md-dialog-title>群组详情</md-dialog-title>
        <md-dialog-content>
          编号：{{selected.id}}<br><br>
          名称：{{selected.groupName}}<br><br>
          邀请码：{{selected.code}}<br><br>
          管理教师：{{selected.teacherName}}<br><br>
          {{info_msg.add_msg}}时间：{{selected.gmtCreate}}<br><br>
          <span v-if="this.$user.user_is_teacher">修改时间：{{selected.gmtModified}}</span>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-accent" @click="showDropOutDialog">{{info_msg.cancel_msg}}群组</md-button>
          <md-button v-if="this.$user.user_is_teacher" class="md-primary" @click="showUpDialog">修改群名
          </md-button>
          <md-button v-if="this.$user.user_is_teacher" class="md-primary" @click="lookWork">查看作业</md-button>
          <md-button class="md-primary" @click="showDialog = false">关闭</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog-prompt
        @md-confirm="addGroup"
        :md-active.sync="add_group_dialog_status"
        v-model="group_code"
        md-title="输入你的群组邀请码"
        md-input-maxlength="32"
        md-input-placeholder="在此输入..."
        md-confirm-text="完成"
        md-cancel-text="取消"/>
      <md-dialog-prompt
        @md-confirm="upGroup"
        :md-active.sync="up_group_dialog_status"
        v-model="new_group_name"
        md-title="输入新的群名称"
        md-input-maxlength="30"
        md-input-placeholder="在此输入..."
        md-confirm-text="完成"
        md-cancel-text="取消"/>
      <md-dialog :md-active.sync="show_drop_out_group_dialog" :md-fullscreen="alert_fullscreen">
        <md-dialog-title>危险！{{info_msg.cancel_msg}}群组确认</md-dialog-title>
        <md-dialog-content>
          确定要{{info_msg.cancel_msg}}名为 {{selected.groupName}} 的群组吗？
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-accent" @click="dropOutGroup">{{info_msg.cancel_msg}}</md-button>
          <md-button class="md-primary" @click="show_drop_out_group_dialog = false">取消</md-button>
        </md-dialog-actions>
      </md-dialog>
      <create-group :show="show_create_dialog" @cancel="show_create_dialog=false" @finish="finish"/>
      <md-button class="md-fab md-fixed md-fab-bottom-right" @click="addBtn">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {Del, Get, Patch, Post} from '@/http';
  import {Student, Teacher} from "@/api";
  import WelcomeCard from "@/components/WelcomeCard";
  import CreateGroup from "@/components/CreateGroup";
  import Pagination from "@/components/Pagination";

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
    name: "Group",
    components: {Pagination, CreateGroup, WelcomeCard},
    data: () => ({
      page_number: 0,
      page_size: 20,
      search: null,
      group_code: "",
      searched: [],
      selected: {},
      info_msg: {},
      add_group_dialog_status: false,
      up_group_dialog_status: false,
      showDialog: false,
      alert_fullscreen: false,
      init_finish: false,
      show_drop_out_group_dialog: false,
      show_create_dialog: false,
      new_group_name: '',
      groups: []
    }),
    watch: {},
    methods: {
      searchOnTable() {
        this.searched = searchByName(this.groups, this.search)
      },
      onItemClick(id) {
        this.selected = this.groups.content.find(item => item.id === id);
        this.showDialog = true;
      },
      setInfoCardDisable(item, localStorageKey) {
        window.localStorage.setItem(localStorageKey, 'false');
      },
      initData() {
        let that = this;
        let url;
        if (this.$user.user_is_student) {
          url = Student().groups;
        } else {
          url = Teacher().groups;
        }
        Get(url + '?page=' + this.page_number + '&size=' + this.page_size).do(response => {
          if (response.data.data.content.length === 0) {
            that.$router.push("welcome");
            that.$store.commit('none_groups');
          } else {
            response.data.data.content = response.data.data.content.map(group => {
              group.gmtCreate = dayjs(group.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
              group.gmtModified = dayjs(group.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
              return group;
            });
            that.groups = response.data.data;
            that.searched = that.groups.content;
            that.init_finish = true;
          }
        });
      },
      addGroup() {
        if (this.group_code === '') {
          return;
        }
        let that = this;
        Post(Student().addGroup)
          .withURLSearchParams({'code': this.group_code})
          .withSuccessCode(201)
          .withErrorStartMsg('加入失败：')
          .do(response => {
            that.$toasted.success('加入成功', {
              position: "top-right",
              icon: 'check',
              duration: 5000
            });
            that.group_code = '';
            that.init_finish = false;
            that.initData();
          });
      },
      showDropOutDialog() {
        this.show_drop_out_group_dialog = true;
        this.showDialog = false;
      },
      showUpDialog() {
        this.new_group_name = this.selected.groupName;
        this.up_group_dialog_status = true;
        this.showDialog = false;
      },
      dropOutGroup() {
        let that = this;
        let url;
        if (this.$user.user_is_student) {
          url = Student().dropOutGroup;
        } else {
          url = Teacher().delGroup;
        }
        Del(url + this.selected.id).withSuccessCode(204).withErrorStartMsg(this.info_msg.cancel_msg + '失败：').do(response => {
          that.$toasted.success(this.info_msg.cancel_msg + '成功', {
            position: "top-right",
            icon: 'check',
            duration: 5000
          });
          that.selected = {};
          that.init_finish = false;
          that.initData();
        }).doAfter(() => {
          that.show_drop_out_group_dialog = false;
        });
      },
      addBtn() {
        if (this.$user.user_is_student) {
          this.add_group_dialog_status = true
        } else {
          this.show_create_dialog = true;
        }
      },
      finish() {
        this.show_create_dialog = false;
        this.initData();
      },
      upGroup() {
        if (this.new_group_name.trim() === '' || this.new_group_name === this.selected.groupName) {
          return;
        }
        let that = this;
        Patch(Teacher().upGroupName + this.selected.id + '/' + this.new_group_name)
          .withSuccessCode(204)
          .withErrorStartMsg('修改失败：')
          .do(response => {
            that.$toasted.success('修改成功', {
              position: "top-right",
              icon: 'check',
              duration: 5000
            });
            that.show_drop_out_group_dialog = false;
            that.selected = {};
            that.init_finish = false;
            that.initData();
          })
      },
      lookWork() {
        this.routerToWork(this.selected.id);
      },
      routerToWork(id) {
        if (this.$user.user_is_student) {
          this.onItemClick(id);
          return;
        }
        this.showDialog = false;
        this.$router.push({name: 'Work', params: {id}});
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
        let key = this.$user.user_is_teacher ? 'size_group_' : 'size_group';
        localStorage.setItem(key, size);
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
      if (this.$user.user_is_student) {
        this.info_msg = {cancel_msg: '退出', add_msg: '加入'};
      } else {
        this.info_msg = {cancel_msg: '删除', add_msg: '创建'};
      }
      let key = this.$user.user_is_teacher ? 'size_group_' : 'size_group';
      let size = Number(localStorage.getItem(key));
      if (isNaN(size)) {
        size = 20;
        localStorage.setItem(key, String(size));
      }
      this.page_size = size;
      this.initData();
    }
  }
</script>

<style scoped>
  .md-card-info {
    max-width: 320px;
    margin-bottom: 4px;
    display: inline-block;
    vertical-align: top;
  }

  .center {
    width: 50px;
    margin: 0 auto;
  }
</style>
