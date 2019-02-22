<template>
  <div>
    <welcome-card v-if="showInImmediacy" style="max-width: 250px;margin-bottom: 16px"
                  localStorage="show_preview_encoding_info"
                  title="Hi! 欢迎来到作业预览界面">
      如果预览有乱码，不妨点击右下角按钮试试！<br>
    </welcome-card>
    <md-content>
      <tree :model="zipTree" @preview="onPreview"/>
    </md-content>
    <iframe :src="src" width="100%" :style="{ height: height}" v-if="showFrame"></iframe>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="alert_fullscreen" :md-backdrop="md_backdrop">
      <md-dialog-title>更改预览编码</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label for="encoding">选择文件编码：</label>
          <md-select v-model="encoding" name="encoding">
            <md-option value="UTF-8">UTF-8</md-option>
            <md-option value="GBK">GBK</md-option>
            <md-option value="ANSI">ANSI</md-option>
            <md-option value="ISO-8859-1">ISO-8859-1</md-option>
          </md-select>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="reload">确定</md-button>
        <md-button class="md-primary" @click="showDialog=false">关闭</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-button v-if="showInImmediacy" class="md-fab md-fixed md-fab-bottom-right" @click="showDialog=true">
      <md-icon>build</md-icon>
    </md-button>
  </div>
</template>

<script>
  import WelcomeCard from "@/components/WelcomeCard";
  import {Get} from "@/http";
  import {Teacher} from "@/api";
  import Tree from "@/components/Tree";

  export default {
    components: {Tree, WelcomeCard},
    props: ['url', 'type'],
    name: "Preview",
    data: () => ({
      server_url: 'https://view.officeapps.live.com/op/view.aspx?src=',
      src: '',
      height: "0px",
      showDialog: false,
      alert_fullscreen: false,
      md_backdrop: false,
      encoding: 'UTF-8',
      showInImmediacy: false,
      showFrame: true,
      zipTree: [],
      reloadUrl: ''
    }),
    methods: {
      reload() {
        this.showDialog = false;
        this.$toasted.info('重新加载', {
          position: "top-right",
          icon: 'hourglass_empty',
          duration: 1500
        });
        if (this.reloadUrl.includes("?")) {
          this.src = this.reloadUrl + '&encoding=' + this.encoding;
        } else {
          this.src = this.reloadUrl + '?encoding=' + this.encoding;
        }
      },
      onPreview(name) {
        let ex = '.' + name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2);
        switch (ex) {
          case '.doc':
          case '.docx':
          case '.xls':
          case '.xlsx':
          case '.ppt':
          case '.pptx': {
            this.showInImmediacy = false;
            this.showFrame = true;
            this.src = this.server_url + encodeURIComponent(Teacher().downInZip + this.url + '?name=' + name);
            break;
          }
          case '.bmp':
          case '.gif':
          case '.png':
          case '.jpeg':
          case '.ico':
          case '.jpg':
          case '.pdf':
          case '.htm':
          case '.html':
          case '.cpp':
          case '.c':
          case '.h':
          case '.php':
          case '.java':
          case '.sql':
          case '.bat':
          case '.vue':
          case '.js':
          case '.json':
          case '.cs':
          case '.md':
          case '.log':
          case '.txt': {
            this.showInImmediacy = true;
            this.showFrame = true;
            this.src = Teacher().downInZip + this.url + '?name=' +encodeURIComponent(name) ;
            this.reloadUrl = this.src;
            break;
          }
        }
      }
    },
    created() {
      this.height = (document.getElementsByClassName('md-app-content')[0].clientHeight - 32) + 'px';
      switch (this.type) {
        case 'office': {
          this.src = this.server_url + this.url;
          break;
        }
        case 'immediacy': {
          this.showInImmediacy = true;
          this.src = this.url;
          this.reloadUrl = this.src;
          break;
        }
        case 'zip': {
          this.showFrame = false;
          let that = this;
          Get(Teacher().zipPreview + this.url).do(response => {
            that.zipTree = response.data;
          });
          break;
        }
        default:
      }
    }
  }
</script>

<style scoped>

</style>
