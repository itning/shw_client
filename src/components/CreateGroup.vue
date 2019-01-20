<template>
  <md-dialog :md-active.sync="show" :md-close-on-esc="auto_close_dialog"
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
      </md-step>

      <md-step id="third" md-label="第三步" md-description="获取邀请码" :md-editable="false" :md-done.sync="third">
        <p>您创建的群组邀请码：</p>
        <p class="text_important">{{new_group_code}}</p>
        <p>请将邀请码发送给你想要邀请加入群的学生</p>
        <p>您可以在群管理页面中的群详情，找到邀请码</p>
        <md-button class="md-raised md-primary" @click="copy">复制到粘贴板</md-button>
        <md-button class="md-raised md-primary" @click="allDone">完成</md-button>
      </md-step>
    </md-steppers>

    <md-dialog-actions>
      <md-button class="md-primary" @click="cancel" :disabled="cancel_btn_disabled">取消</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import {Post} from "@/http";
  import {Teacher} from "@/api";

  export default {
    props: ['show'],
    name: "CreateGroup",
    data: () => ({
      auto_close_dialog: false,
      active: 'first',
      first: false,
      second: false,
      third: false,
      new_group_name: '',
      new_group_code: '',
      cancel_btn_disabled: false,
      secondStepError: null
    }),
    watch: {
      active(now, old) {
        if (now === 'third') {
          this.cancel_btn_disabled = true;
        }
      },
      new_group_name(now, old) {
        this.secondStepError = null;
      },
      show(now, old) {
        if (!now) {
          this.active = 'first';
          this.first = false;
          this.second = false;
          this.third = false;
          this.cancel_btn_disabled = false;
        }
      }
    },
    methods: {
      createGroup() {
        if (this.new_group_name.trim() === '') {
          this.secondStepError = "请输入群组名";
          return;
        }
        this.secondStepError = null;
        this.setDone('second', 'third');
        let that = this;
        Post(Teacher().createGroup)
          .withErrorStartMsg('创建失败: ')
          .withSuccessCode(201)
          .withURLSearchParams({'groupName': this.new_group_name})
          .do(response => {
            that.new_group_code = response.data.code;
          })
          .doAfter(() => {

          })
      },
      setDone(id, index) {
        this[id] = true;
        this.secondStepError = null;
        if (index) {
          this.active = index
        }
      },
      allDone() {
        this.setDone('third');
        this.$emit('finish');
      },
      copy() {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', this.new_group_code);
        input.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
          this.$toasted.success('复制成功', {
            position: "top-right",
            icon: 'check',
            duration: 1000,
          });
        }
        document.body.removeChild(input);
      },
      cancel() {
        this.$emit('cancel');
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
