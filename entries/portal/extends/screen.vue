<template>
  <div class="screen">
    <div class="screen-title">
      <h2>武汉市汉阳区消防救援大队</h2>
      <img src="./assets/images/navbar_bg.png" alt="">
    </div>
    <div class="screen-main">
      <!-- 左边 -->
      <div class="screen-left">
        <div class="screen-item">
          <h3>天气情况</h3>
          <div class="weather-info">
            <span>2020年4月7号</span>
            <span>星期二</span>
            <img src="./assets/images/sun_icon.png" alt="">
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
        <div class="screen-item">
          <h3>通知公告</h3>
        </div>
        <div class="screen-item">
          <h3>本周重点工作</h3>
        </div>
      </div>
      <!-- 中间 -->
      <div class="screen-center">
        
      </div>
      <!-- 右边 -->
      <div class="screen-right">
        
      </div>
    </div>
    <!-- <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>

    <el-row>
      <el-button plain>朴素按钮</el-button>
      <el-button type="primary" plain>主要按钮</el-button>
      <el-button type="success" plain>成功按钮</el-button>
      <el-button type="info" plain>信息按钮</el-button>
      <el-button type="warning" plain>警告按钮</el-button>
      <el-button type="danger" plain>危险按钮</el-button>
    </el-row>

    <el-row>
      <el-button round>圆角按钮</el-button>
      <el-button type="primary" round>主要按钮</el-button>
      <el-button type="success" round>成功按钮</el-button>
      <el-button type="info" round>信息按钮</el-button>
      <el-button type="warning" round>警告按钮</el-button>
      <el-button type="danger" round>危险按钮</el-button>
    </el-row>

    <el-row>
      <el-button icon="el-icon-search" circle></el-button>
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
      <el-button type="success" icon="el-icon-check" circle></el-button>
      <el-button type="info" icon="el-icon-message" circle></el-button>
      <el-button type="warning" icon="el-icon-star-off" circle></el-button>
      <el-button type="danger" icon="el-icon-delete" circle></el-button>
    </el-row> -->
  </div>
</template>
<style>
</style>

<script>
import Vue from "vue";
import './assets/lib/rem.js'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
Vue.use(ElementUI, axios);
export default {
  name: "hello",
  data() {
    return {
      url: "https://kp.ctce.com.cn:10088/api"
    };
  },
  methods: {}
};
</script>

<style lang="less">
  @import "./assets/styles/screen.less";
</style>