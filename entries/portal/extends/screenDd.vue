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
        <weather></weather>
        <!-- <div class="screen-item">
          <h3 class="screen-item-title">天气情况</h3>
          <div class="weather-info">
            <span>{{currentDate[0]}}</span>
            <span>{{currentDate[1]}}</span>
            <img src="./assets/images/sun_icon.png" alt />
            <span>7-18℃</span>
          </div>
          <ul class="weather-item">
            <li>
              <span class="weather-item-left weather-item-mid-left">湿度</span>
              <span class="weather-item-right weather-item-mid-right">{{humidity}}%</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-big-left">空气质量</span>
              <span class="weather-item-right weather-item-big-right">{{airQuality}}</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-small-left">气温</span>
              <span class="weather-item-right weather-item-small-right">{{airTemperature}}℃</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-mid-left">风力</span>
              <span class="weather-item-right weather-item-mid-right">{{windSpeed}}级</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-big-left">风向</span>
              <span class="weather-item-right weather-item-big-right">{{windDirection}}</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-small-left">能见度</span>
              <span class="weather-item-right weather-item-small-right">{{weatherVisible}}KM</span>
            </li>
          </ul>
        </div> -->
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
          <div class="total_num">
            <ul class="tel_ul">
              <li>
                总指挥
                <div class="commander mt">(*人)</div>
              </li>
              <li>
                指挥员
                <div class="controller mt">(*人)</div>
              </li>
              <li>
                消防员
                <div class="fireman mt">(*人)</div>
              </li>
              <li>
                在岗
                <div class="on_work mt">(*人)</div>
              </li>
              <li style="color: #129D1D;">
                公差
                <div class="out_work mt">(*人)</div>
              </li>
              <li style="color: #BDA100">
                休假
                <div class="no_work mt">(*人)</div>
              </li>
            </ul>
          </div>
          <div class="detail_num">
            <ul class="commander_list">
              <li class="commander_detail">
                大队主管:
                <span>巴荣兵</span>
                <span>郑灿灿</span>
              </li>
            </ul>
            <ul class="commander_list">
              <li class="commander_detail">
                大队干部:
                <span>李斌</span>
                <span>宁成伟</span>
                <span>邓彪</span>
                <span>黄磊</span>
                <span>王晶</span>
                <span>张娟</span>
                <span>黄玲</span>
                <span>廖志龙</span>
                <span>潘华</span>
                <span>凡超</span>
              </li>
            </ul>
            <ul class="commander_list">
              <li class="commander_detail">
                大队文员:
                <span>刘若男</span>
                <span>郭春霞</span>
                <span>程关</span>
                <span>彭梦媛</span>
                <span>江倩</span>
                <span>丁婷婷</span>
                <span>朱丹</span>
                <span>张聪</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 月度警情量分析 -->
        <div class="month-fenxi dd-list">
          <h3 class="screen-item-title">月度警情量分析</h3>
          <div class="columnar" style="width: 100%; height: 80%">
            <div id="month-data" style="width: 100%; height: 100%"></div>
          </div>
        </div>
        <!-- 生日 -->
        <div class="dd-birthday dd-list">
          <vue-seamless-scroll :data="birthday_data" class="seamless" :class-option="center_option">
              <ul class="center_item">
                <li v-for="item in birthday_data">
                  <span class="birthday_text" v-text="item.text"></span>
                </li>
              </ul>
            </vue-seamless-scroll>
        </div>
      </div>
      <!-- 右边 -->
      <div class="screen-right dd-item">
        <!-- xsheng 添加 srtat -->
        <!-- 今日警情信息 -->
        <div class="dd-list jq-info">
          <h3 class="screen-item-title">今日警情信息</h3>

          <div class="num">接处警总量(8起)</div>
          <div class="info info1">
            <ul>
              <li>
                <div class="round1"></div>警情信息
              </li>
            </ul>
          </div>
          <div class="info">
            <ul class="tel_ul">
              <li>
                火灾扑救
                <div class="color_r mt">(1起)</div>
              </li>
              <li>
                抢险救援
                <div class="color_b mt">(2起)</div>
              </li>
              <li>
                社会救助
                <div class="color_y mt">(3起)</div>
              </li>
              <li>
                虚假报警
                <div class="color_g mt">(5起)</div>
              </li>
              <li>
                其他警情
                <div class="color_o mt">(0起)</div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 月度警情类型分析 -->
        <div class="month-type dd-list">
          <h3 class="screen-item-title">月度警情类型分析</h3>
          <div class="Echarts">
            <div id="main" style="width: 100%;height:2rem;"></div>
          </div>
        </div>
        <!-- 双随机一公开数据 -->
        <div class="double-data dd-list">
          <h3 class="screen-item-title">双随机一公开数据</h3>
          <div class="progress">
            <div class="pro-div">
              <span>本月应检查</span>
              <el-progress
                :format="format"
                :percentage="50"
                :stroke-width="12"
                :color="customColor1"
                class="pro"
                style="width: 3.5rem;"
              ></el-progress>
            </div>
            <div class="pro-div">
              <span>本月已检查</span>
              <el-progress
                :format="format"
                :percentage="100"
                :stroke-width="12"
                :color="customColor2"
                class="pro"
                style="width: 3.5rem;"
              ></el-progress>
            </div>
            <div class="pro-div">
              <span>本月剩余检查</span>
              <el-progress
                :format="format"
                :percentage="100"
                :stroke-width="12"
                :color="customColor3"
                class="pro"
                style="width: 3.5rem;"
              ></el-progress>
            </div>
          </div>
        </div>
        <!-- 值班信息 -->
        <div class="zhiban-info dd-list">
          <h3 class="screen-item-title">值班信息</h3>
          <div class="duty-main">
            <div class="duty">
              <ul class="duty_ul">
                <li class="size17 duty_ul_li">指挥长:</li>
                <li class="duty_ul_li">巴荣兵</li>
              </ul>
            </div>

            <div class="duty">
              <ul class="duty_ul">
                <li class="size17 duty_ul_li">指挥助理:</li>
                <li class="duty_ul_li">巴荣兵</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- xsheng 添加 end -->
      </div>
    </div>
  </div>
</template>
<style>
.seamless{
  height: 100%;
  overflow: hidden;
  z-index: 999;
  float: left;
  padding-left: 10%;
}
</style>

<script>
import Vue from "vue";
import "./assets/lib/rem.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import vueSeamlessScroll from "vue-seamless-scroll";
import weather from './components/weather';
import request from './api/request';
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI, axios, vueSeamlessScroll);
export default {
  name: "screen-dd",
  data() {
    return {
      orgOptions: {},
      customColor1: "#EE6B77",
      customColor2: "#EDD300",
      customColor3: "#F588FE",

      url: "https://kp.ctce.com.cn:10088/api",
      dialogFormVisible: false,
      dialogFormVisibleType: false,
      birthday_data: [{
          'text': '祝陈飞同志生日快乐'
        }, {
          'text': '祝飞儿同志生日快乐'
        }]
    };
  },
  components: {
    //组件
    vueSeamlessScroll,
    weather
  },
  methods: {
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          align: "left",
          itemWidth: 15, // 设置宽度
          itemHeight: 15, // 设置高度
          right: 10,
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
          y: "center", //延Y轴居中
          x: "right", //居右显示
          padding: [0, 100, 0, 0],
          textStyle: {
            //图例文字的样式
            color: "#ccc",
            fontSize: 15
          }
        },
        color: ["#8D00E2", "#F29B1A", "#027FF3", "#34D160", "#00C6FF"],
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["45%", "70%"],
            center: ["30%", "53%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "15",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      myChart.resize();

      //月度警情量分析

      // 基于准备好的dom，初始化echarts实例
      var myCharts = this.$echarts.init(document.getElementById("month-data"));

      // 指定图表的配置项和数据
      var options = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {

            type: "category",
            data: ["*街道", "*街道", "*街道", "*街道", "*街道"],
            position: 'bottom',
            axisTick: {
              alignWithLabel: true
            },
            axisLine:{ //坐标轴 轴线
              show: true,
              lineStyle:{
                color: '#142865'
              }
            },
            axisLabel:{
              color: 'white'
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            position: 'left',
            axisLine:{ //坐标轴 轴线
              show: true,
              lineStyle:{
                color: '#0B1860',
                width: 2,
              }
            },
            axisLabel:{
              color: 'white'
            },
            splitLine: {    // gird 区域中的分割线
              show: true,   // 是否显示
              lineStyle: {
                color: '#0B1860',
                width: 2,
              }
            },
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            itemStyle:{
              color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                      {offset: 0, color: '#01A6FF'},
                      {offset: 0.5, color: '#0273FF'},
                      {offset: 1, color: '#033EFE'}
                  ]
              )
            },
            barWidth: "40%",
            label:{
              show: true,
              position: 'top',
              color: '#38AC9C'
            },
            data: [45, 35, 28, 33, 45]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myCharts.setOption(options);
      myCharts.resize();
    },

    format(percentage) {
      return percentage === 100 ? '45' : `${percentage}/45`;
    },
    getData(){
      // 调用
      request.getStationAlertInfo().then(res => {
        console.log(res);
      })
      return percentage === 100 ? "45" : `${percentage}/45`;
    }
  },
  computed: {
    center_option(){
      return{
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    }
  },
  mounted() {
    
    // this.loadDate();
    this.myEcharts();
    window.onresize = function() {
      myChart.resize();
    };
  }
};
</script>

<style lang="less">
@import "./assets/styles/screen.less";
@import "./assets/styles/right.less";
@import "./assets/styles/content.less";
</style>