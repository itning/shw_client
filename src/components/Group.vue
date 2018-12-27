<template>
  <div>
    <md-content class="center" v-if="!init_finish">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </md-content>
    <div v-show="init_finish">
      <transition name="fade">
        <md-card class="md-card-info" v-if="show_welcome_card">
          <md-card-header>
            <div class="md-title">Hi! 欢迎来到群组管理</div>
          </md-card-header>
          <md-card-content>
            在这里你可以查看你加入的群组,或者加入新的群组，甚至退出你已经加入的群组。<br>
          </md-card-content>
          <md-card-actions>
            <md-button @click="setInfoCardDisable(show_welcome_card=false,'show_welcome_card')">我知道了
            </md-button>
          </md-card-actions>
        </md-card>
      </transition>
      <transition name="fade">
        <md-card class="md-card-info" v-if="show_info_card">
          <md-card-header>
            <div class="md-title">群组详情</div>
          </md-card-header>
          <md-card-content>
            单击群组条目进行群组详情查看，而且你还可以选择退出该群组！
          </md-card-content>
          <md-card-actions>
            <md-button @click="setInfoCardDisable(show_info_card=false,'show_info_card')">我知道了</md-button>
          </md-card-actions>
        </md-card>
      </transition>
      <transition name="fade">
        <md-card class="md-card-info" v-if="show_add_info_card">
          <md-card-header>
            <div class="md-title">想要加入群组？</div>
          </md-card-header>
          <md-card-content>
            看见右下角的红色按钮了吗？<br>单击它试试！
          </md-card-content>
          <md-card-actions>
            <md-button @click="setInfoCardDisable(show_add_info_card=false,'show_add_info_card')">我知道了</md-button>
          </md-card-actions>
        </md-card>
      </transition>
      <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
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
          :md-description="`没有找到名为 '${search}' 的组. 尝试其他关键字进行搜索或者加入新群组`">
          <md-button class="md-primary md-raised" @click="add_group_dialog_status=true">加入新群组</md-button>
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }" @click="onItemClick(item.id)">
          <md-table-cell md-label="组名" md-sort-by="name">{{ item.groupName }}</md-table-cell>
          <md-table-cell md-label="教师" md-sort-by="email">{{ item.teacherName }}</md-table-cell>
          <md-table-cell md-label="加入时间" md-sort-by="gender" md-numeric>{{ item.gmtCreate }}</md-table-cell>
        </md-table-row>
      </md-table>
      <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen">
        <md-dialog-title>群组详情</md-dialog-title>
        <md-dialog-content>
          编号：{{selected.id}}<br><br>
          名称：{{selected.groupName}}<br><br>
          邀请码：{{selected.code}}<br><br>
          管理教师：{{selected.teacherName}}<br><br>
          加入时间：{{selected.gmtCreate}}<br><br>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-accent" @click="showDropOutDialog">退出群组</md-button>
          <md-button class="md-primary" @click="showDialog = false">关闭</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog-prompt
        @md-confirm="addGroup"
        :md-active.sync="add_group_dialog_status"
        v-model="group_code"
        md-title="输入你的群组邀请码"
        md-input-maxlength="30"
        md-input-placeholder="在此输入..."
        md-confirm-text="完成"
        md-cancel-text="取消"/>
      <md-dialog :md-active.sync="show_drop_out_group_dialog" :md-fullscreen="alert_fullscreen">
        <md-dialog-title>危险！退出群组确认</md-dialog-title>
        <md-dialog-content>
          确定要退出名为 {{selected.groupName}} 的群组吗？
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-accent" @click="dropOutGroup">退出</md-button>
          <md-button class="md-primary" @click="show_drop_out_group_dialog = false">取消</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-button class="md-fab md-fixed md-fab-bottom-right" @click="add_group_dialog_status=true">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import axios from 'axios'
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
    name: "Group",
    data() {
      return {
        search: null,
        group_code: "",
        searched: [],
        selected: {},
        add_group_dialog_status: false,
        show_add_info_card: true,
        show_welcome_card: true,
        show_info_card: true,
        showDialog: false,
        alert_fullscreen: false,
        init_finish: false,
        show_drop_out_group_dialog: false,
        groups: []
      }
    },
    watch: {},
    methods: {
      searchOnTable() {
        this.searched = searchByName(this.groups, this.search)
      },
      onItemClick(id) {
        this.selected = this.groups.find(item => item.id === id);
        this.showDialog = true;
      },
      setInfoCardDisable(item, localStorageKey) {
        window.localStorage.setItem(localStorageKey, 'false');
      },
      initData() {
        let that = this;
        axios.get(Student().groups, {withCredentials: true})
          .then(function (response) {
            if (response.status === 200) {
              if (response.data.data.length === 0) {
                that.$router.push("welcome");
              } else {
                that.groups = response.data.data.map(group => {
                  group.gmtCreate = dayjs(group.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
                  group.gmtModified = dayjs(group.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
                  return group;
                });
                that.searched = that.groups;
                that.init_finish = true;
                that.$store.commit('have_groups');
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
      addGroup() {
        if (this.group_code === '') {
          return;
        }
        let that = this;
        let params = new URLSearchParams();
        params.append('code', this.group_code);
        axios.post(Student().addGroup, params, {withCredentials: true})
          .then(response => {
            if (response.status === 201) {
              that.$toasted.success('加入成功', {
                position: "top-right",
                icon: 'check',
                duration: 5000
              });
              that.group_code = '';
              that.init_finish = false;
              that.initData();
            } else {
              that.$toasted.error('加入失败：' + response.data.msg, {
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
              that.$toasted.error('加入失败：' + error.response.data.msg, {
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
      },
      showDropOutDialog() {
        this.show_drop_out_group_dialog = true;
        this.showDialog = false;
      },
      dropOutGroup() {
        let that = this;
        axios.delete(Student().dropOutGroup + this.selected.id, {withCredentials: true})
          .then(response => {
            if (response.status === 204) {
              that.$toasted.success('退出成功', {
                position: "top-right",
                icon: 'check',
                duration: 5000
              });
              that.show_drop_out_group_dialog = false;
              that.selected = {};
              that.init_finish = false;
              that.initData();
            } else {
              that.$toasted.error('退出失败：' + response.data.msg, {
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
              that.show_drop_out_group_dialog = false;
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
              that.show_drop_out_group_dialog = false;
              setTimeout(function () {
                window.location = CAS_LOGIN_URL;
              }, 2000);
            } else {
              that.$toasted.error('退出失败：' + error.response.data.msg, {
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
              that.show_drop_out_group_dialog = false;
            }
          })
          .then(function () {
            // always executed
          });
      }
    },
    created() {
      let show_add_info_card = window.localStorage.getItem('show_add_info_card');
      let show_welcome_card = window.localStorage.getItem('show_welcome_card');
      let show_info_card = window.localStorage.getItem('show_info_card');
      if (show_add_info_card != null) {
        this.show_add_info_card = (show_add_info_card === 'true');
      }
      if (show_welcome_card != null) {
        this.show_welcome_card = (show_welcome_card === 'true');
      }
      if (show_info_card != null) {
        this.show_info_card = (show_info_card === 'true');
      }
      let studentGroups = window.localStorage.getItem('student_groups');
      if (studentGroups !== null) {
        try {
          this.groups = JSON.parse(studentGroups).map(group => {
            group.gmtCreate = dayjs(group.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
            group.gmtModified = dayjs(group.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
            return group;
          });
          this.init_finish = true;
        } catch (e) {
          console.error(e);
          this.groups = [];
          this.initData();
        } finally {
          window.localStorage.removeItem('student_groups');
        }
      } else {
        this.initData();
      }
      this.searched = this.groups;
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
