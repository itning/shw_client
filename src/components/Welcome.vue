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
  import {Student} from "@/api";
  import {Get, Post} from '@/http';

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
        Post(Student().addGroup, params)
          .withURLSearchParams({'code': this.group_code})
          .withSuccessCode(201)
          .withErrorStartMsg('加入失败：')
          .do(function (response) {
            that.$toasted.success('加入成功', {
              position: "top-right",
              icon: 'check',
              duration: 5000
            });
            that.group_code = '';
            that.$router.push("un_done");
          });
      }
    },
    beforeRouteEnter(to, from, next) {
      window.localStorage.removeItem('student_groups');
      Get(Student().groups).do(function (response) {
        if (response.data.data.length !== 0) {
          window.localStorage.setItem('student_groups', JSON.stringify(response.data.data));
          next('/un_done');
        } else {
          next(vm => {
            vm.$store.commit('none_groups');
          });
        }
      });
    }
  }
</script>

<style scoped>

</style>
