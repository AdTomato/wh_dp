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
        <div class="dd-birthday dd-list"></div>
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
              <span>本月应检查</span> <el-progress :format="format" :percentage="50" :stroke-width="12" :color="customColor1" class="pro"  style="width: 3.5rem;"></el-progress>
            </div>
            <div class="pro-div">
              <span>本月已检查</span> <el-progress :format="format" :percentage="100" :stroke-width="12" :color="customColor2" class="pro" style="width: 3.5rem;"></el-progress>
            </div>
            <div class="pro-div">
              <span>本月剩余检查</span> <el-progress :format="format" :percentage="100" :stroke-width="12" :color="customColor3" class="pro" style="width: 3.5rem;"></el-progress>
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
</style>

<script>
import Vue from "vue";
import "./assets/lib/rem.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import vueSeamlessScroll from "vue-seamless-scroll";
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI, axios, vueSeamlessScroll);
export default {
  name: "screen-dd",
  data() {
    return {
      orgOptions: {},
      customColor1: '#EE6B77',
      customColor2: '#EDD300',
      customColor3: '#F588FE',
    };
  },
  components: {
    //组件
    vueSeamlessScroll
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
          align:'left',
          itemWidth: 15,  // 设置宽度
          itemHeight: 15, // 设置高度
          right: 10,
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
          y: 'center',    //延Y轴居中
          x: 'right', //居右显示
          padding:[0,100,0,0],
          textStyle:{//图例文字的样式
              color:'#ccc',
              fontSize:15,
              
          }
        },
        color: ['#8D00E2','#F29B1A','#027FF3','#34D160','#00C6FF'], 
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
    },
    format(percentage) {
      return percentage === 100 ? '45' : `${percentage}/45`;
    }

  },
  mounted() {
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
</style>