<template>
  <div>
    <md-button class="md-primary" @click="pageChangeBtn('last')" :disabled="page.first">上一页</md-button>
    <md-button @click="showChangeNumberDialog">当前第{{(page.number)+1}}页 共{{page.totalPages}}页</md-button>
    <md-button @click="showChangeSizeDialog">每页{{page.size}}条 共{{page.totalElements}}条</md-button>
    <md-button class="md-primary" @click="pageChangeBtn('next')" :disabled="page.last">下一页</md-button>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen">
      <md-dialog-title>设置</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>每页显示条数</label>
          <md-input v-model="size" type="number"></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="changeSize" :disabled="disabledChangeSizeBtn">确定</md-button>
        <md-button @click="cancelChangeSizeDialog">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="showNumberDialog" :md-fullscreen="alert_fullscreen">
      <md-dialog-title>设置</md-dialog-title>
      <md-dialog-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="size">当前页码</label>
              <md-select v-model="number">
                <md-option :value="index" v-for="index in page.totalPages" :key="index">{{index}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="changeNumber">确定</md-button>
        <md-button @click="cancelChangeNumberDialog">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  export default {
    props: ['page'],
    name: "Pagination",
    data: () => ({
      showDialog: false,
      showNumberDialog: false,
      alert_fullscreen: false,
      size: 20,
      number: 1
    }),
    computed: {
      disabledChangeSizeBtn: function () {
        return (this.size < 1 || this.size === '');
      }
    },
    methods: {
      pageChangeBtn(type) {
        switch (type) {
          case 'last':
          case 'next': {
            this.$emit(type);
            break;
          }
        }
      },
      showChangeSizeDialog() {
        this.size = this.page.size;
        this.showDialog = true;
      },
      showChangeNumberDialog() {
        this.number = this.page.number + 1;
        this.showNumberDialog = true;
      },
      changeSize() {
        if (this.size < 1 || this.size === '') {
          this.size = 20;
        }
        if (this.size === this.page.size) {
          this.showDialog = false;
          return;
        }
        this.$emit('size', this.size);
        this.showDialog = false;
      },
      changeNumber() {
        if (this.number - 1 === this.page.number) {
          this.showNumberDialog = false;
          return;
        }
        this.$emit('number', this.number - 1);
        this.showNumberDialog = false;
      },
      cancelChangeNumberDialog() {
        this.showNumberDialog = false;
        this.number = this.page.number;
      },
      cancelChangeSizeDialog() {
        this.showDialog = false;
        this.size = this.page.size;
      }
    }
  }
</script>

<style scoped>

</style>
