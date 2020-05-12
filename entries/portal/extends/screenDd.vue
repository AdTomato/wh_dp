<template>
  <div class="screen">
    <div class="screen-title">
      <h2>武汉市汉阳区消防救援大队</h2>
      <img src="./assets/images/navbar_bg.png" alt />
    </div>
    <div class="screen-main dd-main">
      <!-- 左边 -->
      <div class="screen-left dd-item">
        <!-- 天气情况 -->
        <div class="screen-item">
          <h3 class="screen-item-title">天气情况</h3>
          <div class="weather-info">
            <span>2020年4月7号</span>
            <span>星期二</span>
            <img src="./assets/images/sun_icon.png" alt />
            <span>7-18℃</span>
          </div>
          <ul class="weather-item">
            <li>
              <span class="weather-item-left weather-item-mid-left">湿度</span>
              <span class="weather-item-right weather-item-mid-right">99%</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-big-left">空气质量</span>
              <span class="weather-item-right weather-item-big-right">良</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-small-left">气温</span>
              <span class="weather-item-right weather-item-small-right">14.1℃</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-mid-left">风力</span>
              <span class="weather-item-right weather-item-mid-right">1级</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-big-left">风向</span>
              <span class="weather-item-right weather-item-big-right">东南风</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-small-left">能见度</span>
              <span class="weather-item-right weather-item-small-right">9.66KM</span>
            </li>
          </ul>
        </div>
        <!-- 通知公告 -->
        <div class="screen-item">
          <h3 class="screen-item-title">通知公告</h3>
          <div class="warn-info">
            <img class="notice-icon" src="./assets/images/notice_icon.png" alt />
            <span>公告：</span>
            <div class="warn-txt">
              <p>关于建设平安武汉</p>
              <p>支队持续推进暑期消防安全宣教活动</p>
              <p>XX大队召开卫健系统消防安全培训会</p>
              <p>XX大队到辖区沿街商铺开展消防宣传活动</p>
            </div>
          </div>
        </div>
        <!-- 本周重点工作 -->
        <div class="screen-item">
          <h3 class="screen-item-title">本周重点工作</h3>
          <ul class="important-work">
            <li>
              <p>1.主题教育要走深走实</p>
              <span>完成</span>
            </li>
            <li>
              <p>2.主题教育要走深走实</p>
              <span>进行中</span>
            </li>
            <li>
              <p>3.主题教育要走深走实</p>
              <span>完成</span>
            </li>
            <li>
              <p>4.主题教育要走深走实</p>
              <span>进行中</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 中间 -->
      <div class="screen-center dd-center">
        <div class="person-move dd-list">
          <h3 class="screen-item-title">人员动态</h3>
          <!-- 人员动态的内容 -->
        </div>
        <!-- 月度警情量分析 -->
        <div class="month-fenxi dd-list">
          <h3 class="screen-item-title">月度警情量分析</h3>
        </div>
        <!-- 生日 -->
        <div class="dd-birthday dd-list">

        </div>
      </div>
      <!-- 右边 -->
      <div class="screen-right dd-item">
        <!-- xsheng 添加 srtat -->
        <!-- 今日警情信息 -->
        <div class="dd-list jq-info">
          <h3 class="screen-item-title">今日警情信息</h3>
        </div>
        <!-- 月度警情类型分析 -->
        <div class="month-type dd-list">
          <h3 class="screen-item-title">月度警情类型分析</h3>
        </div>
        <!-- 双随机一公开数据 -->
        <div class="double-data dd-list">
          <h3 class="screen-item-title">双随机一公开数据</h3>
        </div>
        <!-- 值班信息 -->
        <div class="zhiban-info dd-list">
          <h3 class="screen-item-title">值班信息</h3>
        </div>
        <!-- xsheng 添加 end -->
      </div>
    </div>
  </div>
</template>
<style>

</style>

<script>
import Vue from "vue";
import "./assets/lib/rem.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import vueSeamlessScroll from "vue-seamless-scroll";
Vue.use(ElementUI, axios, vueSeamlessScroll);
export default {
  name: "screen-dd",
  data() {
    return {
      
    };
  },
  components: {
    //组件
    vueSeamlessScroll
  },
  methods: {},
  computed: {
    
  }
};
</script>

<style lang="less">
@import "./assets/styles/screen.less";
@import "./assets/styles/right.less";
</style>