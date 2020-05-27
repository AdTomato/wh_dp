<template>
  <div class="screen">
    <div class="screen-title">
      <h2>武汉市{{titleNameDd}}消防救援大队</h2>
      <img src="./assets/images/navbar_bg.png" alt />
    </div>
    <div class="screen-main dd-main">
      <!-- 左边 -->
      <div class="screen-left dd-item">
        <!-- 天气情况 -->
        <Weather></Weather>
        <!-- 通知公告 -->
        <Notice ref="notice"></Notice>
        <!-- 本周重点工作 -->
        <Weekwork ref="weekwork"></Weekwork>
      </div>
      <!-- 中间 -->
      <div class="screen-center dd-center">
        <div class="person-move dd-list">
          <h3 class="screen-item-title">人员动态</h3>
          <!-- 人员动态的内容 -->
          <div class="total_num">
            <ul class="tel_ul">
              <li>
                总人数
                <div class="commander mt">{{numAll}}</div>
              </li>
              <li>
                指挥员
                <div class="controller mt">{{numtype1}}</div>
              </li>
              <li>
                消防员
                <div class="fireman mt">{{numtype2}}</div>
              </li>
              <li>
                在岗
                <div class="on_work mt">{{numZaigang}}</div>
              </li>
              <li style="color: #129D1D;">
                公差
                <div class="out_work mt">{{numGongchai}}</div>
              </li>
              <li style="color: #BDA100">
                休假
                <div class="no_work mt">{{numXiujia}}</div>
              </li>
            </ul>
          </div>
          <div class="detail_num">
            <ul class="commander_list mf">
              <li class="commander_name">大队主官:</li>
              <li class="commander_detail">
                <vue-seamless-scroll :data="userNames1" :class-option="optionUp" class="seamless-userName">
                  <span v-for="item in userNames1" v-text="item.sequenceNo" v-show="item.sequenceStatus=='1'"></span>
                  <span v-show="item.sequenceStatus=='2'" class="gree" v-for="item in userNames1" v-text="item.sequenceNo"></span>
                  <span v-show="item.sequenceStatus=='3'" class="yello" v-for="item in userNames1" v-text="item.sequenceNo"></span>
                </vue-seamless-scroll>
              </li>
            </ul>
            <ul class="commander_list ms">
              <li class="commander_name">大队干部:</li>
              <li class="commander_detail">
                <vue-seamless-scroll :data="userNames2" :class-option="optionUp1" class="seamless-userName1">
                  <span v-for="item in userNames2" v-text="item.sequenceNo" v-show="item.sequenceStatus=='1'"></span>
                  <span v-show="item.sequenceStatus=='2'" class="gree" v-for="item in userNames2" v-text="item.sequenceNo"></span>
                  <span v-show="item.sequenceStatus=='3'" class="yello" v-for="item in userNames2" v-text="item.sequenceNo"></span>
                </vue-seamless-scroll>
              </li>
            </ul>
            <ul class="commander_list mx">
              <li class="commander_name">大队文员:</li>
              <li class="commander_detail">
                <vue-seamless-scroll :data="userNames3" :class-option="optionUp2" class="seamless-userName2">
                  <span v-for="item in userNames3" :key="item.item" v-show="item.sequenceStatus=='1'">{{item.sequenceNo}}</span>
                  <span v-show="item.sequenceStatus=='2'" :key="item.item" class="gree" v-for="item in userNames3">{{item.sequenceNo}}</span>
                  <span class="yello" v-for="item in userNames3" :key="item.item" v-show="item.sequenceStatus=='3'">{{item.sequenceNo}}</span>
                </vue-seamless-scroll>
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
        <div class="content-bottom">
          <vue-seamless-scroll :data="newsList" :class-option="optionLeft" class="seamless-warp2">
            <ul class="item">
              <li class= "" v-for="item in newsList" :key="item" v-text="item"></li>
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

          <div class="num">接出警总量({{count}}起)</div>
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
                <div class="color_r mt">({{earlyInfo.fireAlarmNum}}起)</div>
              </li>
              <li>
                抢险救援
                <div class="color_b mt">({{earlyInfo.emergencyRescueNum}}起)</div>
              </li>
              <li>
                社会救助
                <div class="color_y mt">({{earlyInfo.socialAssistanceNum}}起)</div>
              </li>
              <li>
                虚假报警
                <div class="color_g mt">({{earlyInfo.falseAlarmNum}}起)</div>
              </li>
              <li>
                其他警情
                <div class="color_o mt">({{earlyInfo.otherAlertNum}}起)</div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 月度警情类型分析 -->
        <div class="month-type dd-list">
          <h3 class="screen-item-title">月度警情类型分析</h3>
          <div class="Echarts">
            <div id="main" style="width: 100%;height:2rem;"></div>
          </div>F
        </div>
        <!-- 双随机一公开数据 -->
        <div class="double-data dd-list">
          <h3 class="screen-item-title">双随机一公开数据</h3>
          <div class="progress">
            <div class="pro-div">
              <span>本月应检查</span>
              <el-progress
                :format="format"
                :percentage="random.shouldCheck"
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
                :percentage="random.remainingCheck"
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
                :percentage="random.checked"
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
                <li class="duty_ul_li"v-for="(item,i) in OnDutArr1">{{item.dutyName}}</li>
              </ul>
            </div>

            <div class="duty">
              <ul class="duty_ul">
                <li class="size17 duty_ul_li">指挥助理:</li>
                <li class="duty_ul_li"v-for="(item,i) in OnDutArr2">{{item.dutyName}}</li>
              </ul>
            </div>
          </div>
        </div>

        <el-dialog
          title="组织机构选择"
          :visible.sync="dialogFormVisibleOrg"
          :fullscreen="full"
          :showClose="showClo"
        >
          <div style="height:300px">
            <el-form :model="formOrg">
              <el-form-item label="大队" :label-width="formLabelWidth" v-show="play_d">
                <el-select v-model="formOrg.id" @change="getListData" placeholder="请选择大队">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogFormVisibleOrg = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmBtn">确 定</el-button>
          </div>
        </el-dialog>





        <!-- xsheng 添加 end -->
      </div>
    </div>
  </div>
</template>
<style>
.el-dialog__footer{
  text-align: center;
}
.gree{
  color:#13A71D
}
.yello{
  color:#C0A000
}
</style>
<script>
import Vue from "vue";
import "./assets/lib/rem.js";
import storage from "./api/right";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import vueSeamlessScroll from "vue-seamless-scroll";
import Weather from './components/weather';
import Notice from './components/notice';
import Weekwork from './components/weekwork';
import request from './api/request';
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI, axios, vueSeamlessScroll);
export default {
  name: "screen-dd",
  data() {
    return {
      //xsheng
      earlyInfo:{},  //今日警情信息
      earlyInfoEchart:[], //月度警情分析
      OnDutyInfo:{}, //大队值班信息
      OnDutArr1:[],
      OnDutArr2:[],
      random:{}, //双随机一公开数据
      dialogFormVisibleOrg: true,
      showClo: false,
      full: true,
      formOrg: { id: "", region: "", name: "", sourceId: "" },
      formLabelWidth: "120px",
      options: [{ value: "选项1", label: "无数据", sourceId: "", id: "" }],
      play_d:false,
      count:0,
      titleNameDd:'',
      sourceId:'',
      personInfoId: '',
      //myjing

      orgOptions: {},
      customColor1: "#EE6B77",
      customColor2: "#EDD300",
      customColor3: "#F588FE",

      streetName:[],
      streetNum:[],
      
      numAll:'',
      numtype1:'',
      numtype2:'',
      numZaigang:'',
      numGongchai:'',
      numXiujia:'',
      userNames1: [],
      userNames2: [],
      userNames3: [],
      url: "",
      dialogFormVisible: false,
      dialogFormVisibleType: false,
      newsList: ['对党忠诚，纪律严明，赴汤蹈火，竭诚为民!']
    };
  },
  components: {
    //组件
    vueSeamlessScroll,
    Weather,
    Notice,
    Weekwork
  },
  methods: {
    format(percentage) {
      return percentage === 100 ? '45' : `${percentage}/45`;
    },
    getData(){
      // 调用
      request.getStationAlertInfo().then(res => {})
      return percentage === 100 ? "45" : `${percentage}/45`;
    },

    //月度警情分析
    getBrigadeAlertInfoByBrigadeId(){
      var time = new Date().toLocaleDateString().replace(/\//g, '-')+" 00:00:00";
      let par = {
        brigadeId: this.formOrg.id,
        date: time
      };
      request.getBrigadeAlertInfoByBrigadeId(par).then(res =>{
        this.streetName = res.data.streets;
        this.streetNum = res.data.alertNums;
        this.myEcharts(null,this.streetName);
      });
    },
    //人员动态和生日
    getTeamInfo(id){
      let prr = {
        sourceId: id
      }
      request.getTeamInfo(prr).then(res =>{
        if(res.data.numAll != null){
        this.numAll = res.data.numAll;
        }
        if(res.data.numtype1 != null){
          this.numtype1 = res.data.numtype1;
        }
        if(res.data.numtype2 != null){
          this.numtype2 = res.data.numtype2;
        }
        if(res.data.numZaigang != null){
          this.numZaigang = res.data.numZaigang;
        }
        if(res.data.numGongchai != null){
          this.numGongchai = res.data.numGongchai;
        }
        if(res.data.numXiujia != null){
          this.numXiujia = res.data.numXiujia;
        }
        if(res.data.userNames1 != null){
          this.userNames1 = res.data.userNames1;
        }
        if(res.data.userNames2 != null){
          this.userNames2 = res.data.userNames2;
        }
        if(res.data.userNames3 != null){
          this.userNames3 = res.data.userNames3;
        }
        if(res.data.birthdayNames.length != 0){
          let pr = [];
          pr.push('祝'+ res.data.birthdayNames + '生日快乐！');
          this.newsList = pr;
        }else{
          this.newsList = ['对党忠诚，纪律严明，赴汤蹈火，竭诚为民!']
        }
      })
    },
    // xsheng 添加strat 2020-05-19

    //获取今日警情信息 月度警情信息
    // getEarlyInfo() {
    //   storage.getEarlyInfo(this.formOrg.id,2).then(res => {
    //     if(res!=undefined){
    //       console.log("今日警情信息数据==",res.monthAlertAnalysis);
    //       this.earlyInfoEchart = [];
    //       this.earlyInfo = res.dateAlertInfo;
    //       this.earlyInfoEchart = res.monthAlertAnalysis;
    //       this.myEcharts(this.earlyInfoEchart,null);
    //     }else{console.log("今日警情信息数据返回为空")}
    //   });
    // },
    //月度警情量分析

    myEcharts(earlyInfoEchart,streetName) {
      // 基于准备好的dom，初始化echarts实例
      //月度警情量类型分析
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
          data: ["火灾扑救", "抢险救援", "社会救助", "虚假报警", "其他警情"],
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
            name: "警情类型",
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
            data: earlyInfoEchart
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      myChart.resize();

      // 基于准备好的dom，初始化echarts实例
      //月度警情量分析
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
            data: [],
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
              color: 'white',
              interval:0,  
              rotate:40  
            },
            data:this.streetName
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
            data: this.streetNum
            //data:[10, 52, 200, 334, 390, 330, 220]
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
      request.getStationAlertInfo().then(res => {})
      return percentage === 100 ? "45" : `${percentage}/45`;
    },

    //人员动态生日
    // getTeamInfo(){
    //   let prr = {
    //     sourceId: this.sourceId
    //   }
    //   request.getTeamInfo(prr).then(res =>{
    //     if(res.data.numAll != null){
    //       this.numAll = res.data.numAll;
    //     }
    //     if(res.data.numtype1 != null){
    //       this.numtype1 = res.data.numtype1;
    //     }
    //     if(res.data.numtype2 != null){
    //       this.numtype2 = res.data.numtype2;
    //     }
    //     if(res.data.numZaigang != null){
    //       this.numZaigang = res.data.numZaigang;
    //     }
    //     if(res.data.numGongchai != null){
    //       this.numGongchai = res.data.numGongchai;
    //     }
    //     if(res.data.numXiujia != null){
    //       this.numXiujia = res.data.numXiujia;
    //     }
    //     if(res.data.userNames1 != null){
    //       this.userNames1 = res.data.userNames1;
    //     }
    //     if(res.data.userNames2 != null){
    //       this.userNames2 = res.data.userNames2;
    //     }
    //     if(res.data.userNames3 != null){
    //       this.userNames3 = res.data.userNames3;
    //     }


    //   })
    // },
    // xsheng 添加strat 2020-05-19

    //获取今日警情信息
    getEarlyInfo() {
      storage.getEarlyInfo(this.formOrg.id,2).then(res => {
        console.log("今日警情信息=",res)
        if(res!=undefined){
          this.earlyInfo = res.dateAlertInfo;
          this.earlyInfoEchart = res.monthAlertAnalysis;
          this.myEcharts(this.earlyInfoEchart,null);
          var fire = 0;
          var eme = 0;
          var soc = 0;
          var falseA = 0;
          var other = 0;

          fire = parseInt(res.dateAlertInfo.fireAlarmNum);
          eme = parseInt(res.dateAlertInfo.emergencyRescueNum);
          soc = parseInt(res.dateAlertInfo.socialAssistanceNum);
          falseA = parseInt(res.dateAlertInfo.falseAlarmNum);
          other = parseInt(res.dateAlertInfo.otherAlertNum);
          this.count = fire + eme + soc + falseA + other;
        }else{console.log("今日警情信息数据返回为空")}
      });
    },
    //获取值班信息
    getOnDutyInfo() {
      storage.getOnDutyInfo(this.formOrg.id,2).then(res => {
        if(res!=undefined){
          this.OnDutyInfo = res;
          this.OnDutArr1 = res.commanders;
          this.OnDutArr2 = res.commandAssistants;
        }else{console.log("值班信息数据返回为空")}
      });
    },

    //获取双随机公开数据
    getRandom(){
      storage.getRandomData(this.formOrg.id,2).then(res => {
        if(res!=undefined){
          this.random = res
        }else{console.log("双随机信息数据返回为空")}
      });
    },
     //根据大队id获取大队下消防站的数据
    getListData(id) {
      let s = '';
      //选择大队时存储数据 strat
      let objs = {};
      objs = this.options.find(item => {
        return item.id === id;
      });
      s = objs.name;
      this.formOrg = objs;
      this.titleNameDd = s.substr(0, s.length - 2)+'大队';
      //选择大队时存储数据 end
    },

    //用户权限处理
    setUserPermissions(obj) {
      if (obj.isBrigade == true) {
        this.play_d = true;
        this.options = this.setDate(obj.brigadeData);
      }else if(obj.isDetachment == true){
        this.play_d = true;
        this.options = this.setDate(obj.detachmentData);
      }else{
        this.play_d = false;
        this.$message({
          message: "该用户没有权限，无法查看大屏数据",
          type: "warning"
        });
      }
    },

    //确定按钮 处理查看大屏类型
    confirmBtn() {
      console.log("formOrg", this.formOrg); //大队json
      if (this.formOrg.id != "") {
        this.dialogFormVisibleOrg = false; //查看大队大屏
        this.$message({
          message: "查看大队大屏",
          type: "success"
        });
      } else if(this.play_d == false){
        this.$message({
          message: "该用户没有权限，无法查看大屏数据",
          type: "warning"
        });
      }else{
        this.$message({
          message: "请选择部门",
          type: "warning"
        });
      }
      this.personInfoId = this.formOrg.sourceId;
      // 获取本周工作任务
      this.$refs["weekwork"].getWorks(this.formOrg.id);
      this.$refs["notice"].getBrigadeNoticeInfo(this.formOrg.id);
      this.getBrigadeAlertInfoByBrigadeId();
      this.getTeamInfo(this.personInfoId);
      this.getOnDutyInfo();
      this.getRandom();
      this.myEcharts();
      this.getEarlyInfo();
    },
    //设置下拉数据 (公用)
    setDate(arrs) {
      if (arrs != null || arrs != "") {
        var arr = [];
        for (var i = 0; i < arrs.length; i++) {
          var obj = new Object();
          obj.sourceId = arrs[i].sourceId;
          obj.name = arrs[i].name;
          obj.id = arrs[i].id;
          obj.value = arrs[i].id;
          obj.label = arrs[i].name;
          arr.push(obj);
        }
        return arr;
      }
    },
  },
  computed: {
    optionLeft () {
      return {
            direction: 2,
            limitMoveNum: 0
          }
    },
    optionUp(){
      return{
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 15, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    },
    optionUp1(){
      return{
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 22, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    },
    optionUp2(){
      return{
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 29, // 开始无缝滚动的数据量 this.dataList.length
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
    var res = null;
    storage.getUserPermissionsDate().then(res => {
      if(res.isDetachment==true){
          this.sourceId = res.detachmentData[0].sourceId
      }else if(res.isBrigade==true){
          this.sourceId = res.brigadeData[0].sourceId
      }else if(res.isBrigade==true){
          this.sourceId = res.stationData[0].sourceId
      }
      this.setUserPermissions(res);
    });
  }
};
</script>

<style lang="less">
@import "./assets/styles/screen.less";
@import "./assets/styles/right.less";
@import "./assets/styles/content.less";
</style>