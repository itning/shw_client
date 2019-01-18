<template>
  <div>
    <md-empty-state
      :md-icon="state_msg.icon"
      :md-label="state_msg.label"
      :md-description="state_msg.description">
      <md-button class="md-primary md-raised" @click="doBtn">{{state_msg.btn_info}}</md-button>
    </md-empty-state>
    <md-dialog-prompt
      @md-confirm="addGroup"
      :md-active.sync="add_group_dialog_status"
      v-model="group_code"
      md-title="输入你的群组邀请码"
      md-input-maxlength="30"
      md-input-placeholder="在此输入..."
      md-confirm-text="完成"
      md-cancel-text="取消"/>
    <md-dialog :md-active.sync="show_create_dialog" :md-close-on-esc="auto_close_dialog"
               :md-click-outside-to-close="auto_close_dialog">
      <md-dialog-title>创建群组</md-dialog-title>
      <md-steppers :md-active-step.sync="active" md-vertical md-linear>
        <md-step id="first" md-label="第一步" md-description="简介" :md-editable="false" :md-done.sync="first">
          <p>创建群组后您可以将邀请码通知给学生，让学生加入进来。</p>
          <p>您可以在群组中创建一份作业，作业创建完成后，学生可以将自己的作业上传，并汇总。</p>
          <md-button class="md-raised md-primary" @click="setDone('first', 'second')">我了解</md-button>
        </md-step>

        <md-step id="second" md-label="第二步" md-description="创建群组" :md-error="secondStepError" :md-editable="false"
                 :md-done.sync="second">
          <md-field>
            <label>请输入您要创建的群组名</label>
            <md-input v-model="new_group_name" md-counter="30"></md-input>
          </md-field>
          <md-button class="md-raised md-primary" @click="createGroup">创建</md-button>
          <md-button class="md-raised md-primary" @click="setError()">Set error!</md-button>
        </md-step>

        <md-step id="third" md-label="第三步" md-description="获取邀请码" :md-editable="false" :md-done.sync="third">
          <p>您创建的群组邀请码：</p>
          <p class="text_important">{{new_group_code}}</p>
          <p>请将邀请码发送给你想要邀请加入群的学生</p>
          <p>您可以在群管理页面中的群详情，找到邀请码</p>
          <md-button class="md-raised md-primary" @click="copy">复制到粘贴板</md-button>
          <md-button class="md-raised md-primary" @click="setDone('third')">完成</md-button>
        </md-step>
      </md-steppers>

      <md-dialog-actions>
        <md-button class="md-primary" @click="show_create_dialog = false">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {Student, Teacher} from "@/api";
  import {Get, Post} from '@/http';
  import store from "@/store";
  import Vue from 'vue'

  export default {
    name: 'Welcome',
    data: () => ({
      auto_close_dialog: false,
      add_group_dialog_status: false,
      group_code: '',
      show_create_dialog: false,
      state_msg: {},
      active: 'first',
      first: false,
      second: false,
      third: false,
      secondStepError: null,
      new_group_name: '',
      new_group_code: ''
    }),
    methods: {
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
            that.$store.commit('have_groups');
            that.group_code = '';
            that.$router.push("un_done");
          });
      },
      createGroup() {
        this.setDone('second', 'third');
        let that = this;
        Post(Teacher().createGroup)
          .withErrorStartMsg('创建失败: ')
          .withSuccessCode(201)
          .withURLSearchParams({'groupName': this.new_group_name})
          .do(response => {
            that.new_group_code = response.data.code;
            that.$router.push('group_panel');
          })
          .doAfter(() => {

          })
      },
      doBtn() {
        if (this.$store.getters.user_is_student) {
          this.add_group_dialog_status = true
        } else {
          this.show_create_dialog = true;
        }
      },
      setDone(id, index) {
        this[id] = true;
        this.secondStepError = null;
        if (index) {
          this.active = index
        }
      },
      setError() {
        this.secondStepError = 'This is an error!'
      },
      copy() {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', this.new_group_code);
        input.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
          Vue.toasted.success('复制成功', {
            position: "top-right",
            icon: 'check',
            duration: 1000,
          });
        }
        document.body.removeChild(input);
      }
    },
    created() {
      if (this.$store.getters.user_is_student) {
        this.state_msg = {
          icon: 'cloud_upload',
          label: '提交你的第一份作业',
          description: '点击下方按钮，输入你的群组邀请码并进行群组确认来提交你的第一份作业',
          btn_info: '加入群组'
        };
      } else {
        this.state_msg = {
          icon: 'group_add',
          label: '创建你的第一个群组',
          description: '欢迎您，' + this.$store.state.user.name + '。点击下方按钮，创建第一个群组。',
          btn_info: '创建群组'
        };
      }
    },
    beforeRouteEnter(to, from, next) {
      window.localStorage.removeItem('student_groups');
      if (store.getters.user_type !== undefined) {
        d();
      } else {
        let subscribe = store.subscribe((mutation, state) => {
          if (mutation.type === 'set_user') {
            subscribe();
            d();
          }
        });
      }

      function d() {
        let info = Vue.toasted.info('检查群组状态', {
          position: "top-right",
          icon: 'hourglass_empty'
        });
        //根据用户角色 99为学生
        if (store.getters.user_type === '99') {
          Get(Student().existGroup).withErrorStartMsg('').do(response => {
            if (response.data.data) {
              store.commit('have_groups');
              next('un_done');
            } else {
              store.commit('none_groups');
              next();
            }
          }).doAfter(() => {
            info.goAway(500);
          });
        } else {
          Get(Teacher().existGroup).withErrorStartMsg('').do(response => {
            if (response.data.data) {
              next('group_panel');
            } else {
              next();
            }
          }).doAfter(() => {
            info.goAway(500);
          });
        }
      }
    }
  }
</script>

<style scoped>
  .text_important {
    color: #ff1f1f;
    font-size: large;
  }

  .md-steppers {
    overflow-y: auto;
  }
</style>
