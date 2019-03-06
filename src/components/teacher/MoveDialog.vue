<template>
  <div class="review md-elevation-6">
    <p id="p">批阅窗口</p>
    <md-button class="md-accent">保存</md-button>
    <md-button class="md-primary">关闭</md-button>
    <md-content style="padding: 0 16px 1px 16px">
      <md-field>
        <label>批阅信息：</label>
        <md-textarea v-model="reviewData" md-autogrow></md-textarea>
      </md-field>
    </md-content>
  </div>
</template>

<script>
  export default {
    name: "MoveDialog",
    data: () => ({
      reviewData: ''
    }),
    methods: {},
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
