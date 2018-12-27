<template>
  <div>
    <md-empty-state
      md-icon="cloud_upload"
      md-label="提交你的第一份作业"
      md-description="点击下方按钮，输入你的群组邀请码并进行群组确认来提交你的第一份作业">
      <md-button class="md-primary md-raised" @click="add_group_dialog_status = true">加入群组</md-button>
    </md-empty-state>
    <md-dialog-prompt
      :md-active.sync="add_group_dialog_status"
      v-model="group_id"
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
        group_id: ''
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
