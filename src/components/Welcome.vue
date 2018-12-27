<template>
  <div>
    <md-empty-state
      md-icon="cloud_upload"
      md-label="提交你的第一份作业"
      md-description="点击下方按钮，输入你的群组邀请码并进行群组确认来提交你的第一份作业">
      <md-button class="md-primary md-raised" @click="add_group_dialog_status = true">加入群组</md-button>
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
  </div>
</template>

<script>
  import {CAS_LOGIN_URL, Student} from "@/api";
  import axios from 'axios'

  export default {
    name: 'Welcome',
    data() {
      return {
        add_group_dialog_status: false,
        group_code: ''
      }
    },
    methods: {
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
              that.$router.push("un_done");
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
      }
    },
    beforeRouteEnter(to, from, next) {
      window.localStorage.removeItem('student_groups');
      axios.get(Student().groups, {withCredentials: true})
        .then(function (response) {
          if (response.status === 200) {
            if (response.data.data.length !== 0) {
              window.localStorage.setItem('student_groups', JSON.stringify(response.data.data));
              next('/un_done');
            } else {
              doNext();
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

      function doNext() {
        next(vm => {
          vm.$store.commit('none_groups');
        });
      }
    }
  }
</script>

<style scoped>

</style>
