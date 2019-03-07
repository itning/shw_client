<template>
  <div class="review md-elevation-6">
    <p id="p">批阅窗口</p>
    <md-button class="md-accent" @click="save">保存</md-button>
    <md-content style="padding: 0 16px 1px 16px">
      <md-field>
        <label>批阅信息：</label>
        <md-textarea v-model="reviewData" style="height: 166px"></md-textarea>
      </md-field>
    </md-content>
  </div>
</template>

<script>
  import {Get, Patch} from "@/http";
  import {Teacher} from "@/api";

  export default {
    props: ['url'],
    name: "MoveDialog",
    data: () => ({
      studentId: '',
      workId: '',
      reviewData: ''
    }),
    methods: {
      initData() {
        Get(Teacher().getReviewWork + this.studentId + '/' + this.workId)
          .do(response => {
            this.reviewData = response.data.data;
          })
      },
      save() {
        if (this.reviewData === '') {
          return;
        }
        Patch(Teacher().reviewWork + this.studentId + '/' + this.workId)
          .withErrorStartMsg('保存失败: ')
          .withSuccessCode(204)
          .withURLSearchParams({review: this.reviewData})
          .do(response => {
            this.$toasted.success('保存成功', {
              position: "top-right",
              icon: 'check',
              duration: 2000
            });
          })
      }
    },
    created() {
      let urlArray = this.url.split('/');
      if (urlArray.length < 2) {
        this.$toasted.error('批阅窗口数据加载失败', {
          position: "top-right",
          icon: 'clear',
          duration: 5000
        });
        return
      }
      this.workId = urlArray[urlArray.length - 1];
      this.studentId = urlArray[urlArray.length - 2];
      this.initData();
    },
    mounted() {
      let box = document.getElementsByClassName("review")[0];
      let p = document.getElementById("p");
      //鼠标按下
      p.onmousedown = function (e1) {
        let _e1 = window.event || e1;
        let l = _e1.offsetX;//获取鼠标点击位置和p左边缘距离
        let t = _e1.offsetY;//获取鼠标点击位置和p上边缘距离
        document.onmousemove = function (e2) {
          let _e2 = window.event || e2;
          let x = _e2.clientX - l;//box距离页面左边缘距离
          let y = _e2.clientY - t;//box距离页面上边缘距离
          box.style.left = x + "px";
          box.style.top = y + "px";
        };
      };
      //鼠标弹起
      p.onmouseup = function () {
        document.onmousemove = null;
      }
    }
  }
</script>

<style scoped>
  .review {
    margin: 0;
    padding: 0;
    width: 300px;
    height: 300px;
    background-color: #fff;
    position: fixed;
    left: 16px;
    top: 90px;
  }

  #p {
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin: 0;
    padding: 0;
    width: 100%;
    font: bold 20px/40px "宋体";
    text-align: center;
    background-color: #448aff;
    color: #fff;
    cursor: move;
  }
</style>
