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
  export default {
    name: 'Welcome',
    data() {
      return {
        add_group_dialog_status: false,
        group_id: ''
      }
    }
  }
</script>

<style scoped>

</style>
