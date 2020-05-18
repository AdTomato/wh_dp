<template>
  <div class="screen">
    <div class="screen-title">
      <h2>武汉市汉阳区七里庙消防救援站</h2>
      <img src="./assets/images/navbar_bg.png" alt />
    </div>
    <div class="screen-main">
      <!-- 左边 -->
      <div class="screen-left">
        <!-- 天气情况 -->
        <Weather></Weather>
        <!-- 通知公告 -->
        <Notice ref="notice" :noticeData="noticeData" :flagVisible="flagVisible"></Notice>
        <!-- 教育训练计划和龙虎榜 -->
        <Education ref="education"></Education>
      </div>
      <!-- 中间 -->
      <div class="screen-center">
        <div class="content-top">
          <div class="screen-item" style="height:100%">
            <h3 class="screen-item-title">人员动态</h3>
            <div class="total_num">
              <ul class="tel_ul">
                      <li>总人数 <div class="commander mt">{{numAll}}人</div> </li>
                      <li>指挥员 <div class="controller mt">{{numtype1}}人</div> </li>
                      <li>消防员 <div class="fireman mt">{{numtype2}}人</div> </li>
                      <li>在岗 <div class="on_work mt">{{numZaigang}}人</div> </li>
                      <li style="color: #129D1D;">公差 <div class="out_work mt">{{numGongchai}}人</div> </li>
                      <li style="color: #BDA100"> 休假 <div class="no_work mt">{{numXiujia}}人</div> </li>
              </ul>
            </div>
            <div class="detail_num">
              <ul class="commander_list">
                    <li class="commander_detail">
                      指  挥  员:
                       <span v-for="item in userNames1">{{item}}</span>
                    </li>
                  </ul>
                  <ul class="commander_list">
                    <li class="commander_detail">
                      特情一班:
                      <span v-for="item in userNames2">{{item}}</span>
                    </li>
                  </ul>
                  <ul class="commander_list">
                    <li class="commander_detail">
                      特情二班:
                      <span v-for="item in userNames3">{{item}}</span>
                    </li>
                  </ul>
                  <ul class="commander_list">
                    <li class="commander_detail">
                      灭火一班:
                      <span v-for="item in userNames4">{{item}}</span>
                    </li>
                  </ul>
                  <ul class="commander_list">
                    <li class="commander_detail">
                      灭火二班:
                      <span v-for="item in userNames5">{{item}}</span>
                    </li>
                  </ul>
                  <ul class="commander_list">
                    <li class="commander_detail">
                      特情保障班:
                      <span v-for="item in userNames6">{{item}}</span>
                    </li>
                  </ul>
            </div>
          </div>
        </div>
        <div class="content-center">
          <div class="content-left">
                <div class="screen-item" style="height:100%">
                    <h3 class="screen-item-title">每月之星栏</h3>
                    <div class="star_month">
                      <ul>
                        <li style="display: inline-block;vertical-align :top">
                          <img src="./assets/images/learn_star.png" />
                          <img :src="learn_img" class="star_img" />
                          <span class="star_name">{{learnStar}}</span>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <img src="./assets/images/discipline_star.png" />
                          <img :src="discipline_img" class="star_img" />
                          <span class="star_name">{{disciplineStar}}</span>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <img src="./assets/images/train_star.png" />
                          <img :src="train_img" class="star_img" />
                          <span class="star_name">{{trainStar}}</span>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <img src="./assets/images/house_star.png" />
                          <img :src="houser_img" class="star_img" />
                          <span class="star_name">{{houseStar}}</span>
                        </li>
                      </ul>
                  </div>
                </div>
            </div>
          <div class="content-right">
            <div class="screen-item" style="height:100%">
              <h3 class="screen-item-title">量化考评周报</h3>
              <div class="evaluate">
                <ul class="evaluate_detail">
                  <li>
                          <span v-for="item in idd1">{{item}}</span>
                        </li>
                        <li>
                          <span v-for="item in idd2">{{item}}</span>
                        </li>
                        <li>
                          <span v-for="item in idd3">{{item}}</span>
                        </li>
                        <li>
                          <span v-for="item in idd4">{{item}}</span>
                        </li>
                        <li>
                          <span v-for="item in idd5">{{item}}</span>
                        </li>
                        <li>
                          <span v-for="item in idd6">{{item}}</span>
                        </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="content-bottom">
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
      <div class="screen-right">
        <!-- xsheng 添加 srtat -->
        <div class="rigth">
          <!-- 今日警情信息strat -->
          <div class="right-top screen-item">
            <h3 class="screen-item-title">今日警情信息</h3>
            <div class="num">接处警总量({{earlyInfo.callPoliceTotal}}起)</div>
            <div class="info info1">
              <ul>
                <li>
                  <div class="round1"></div>警情信息
                </li>
              </ul>
            </div>
            <div class="info">
              <ul class="tel_ul">
                <li @click="uploadEarliInfo(1)">
                  火灾扑救
                  <div class="color_r mt">({{earlyInfo.fireAlarmNum}}起)</div>
                </li>
                <li @click="uploadEarliInfo(2)">
                  抢险救援
                  <div class="color_b mt">({{earlyInfo.emergencyRescueNum}}起)</div>
                </li>
                <li @click="uploadEarliInfo(3)">
                  社会救助
                  <div class="color_y mt">({{earlyInfo.socialAssistanceNum}}起)</div>
                </li>
                <li @click="uploadEarliInfo(4)">
                  虚假报警
                  <div class="color_g mt">({{earlyInfo.falseAlarmNum}}起)</div>
                </li>
                <li @click="uploadEarliInfo(5)">
                  其他警情
                  <div class="color_o mt">({{earlyInfo.otherAlertNum}}起)</div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 今日警情信息end -->

          <!-- 值勤车辆strat -->
          <div class="rigth-middle screen-item">
            <h3 class="screen-item-title">值勤车辆</h3>
            <div class="num1 zq-num1">
              <ul class="zq_ul">
                <li>
                  <div class="round bj_g"></div>在位
                </li>
                <li>
                  <div class="round bj_y"></div>出动
                </li>
                <li>
                  <div class="round bj_r"></div>保修
                </li>
              </ul>
            </div>

            <div class="clear vehicle" @click="handleClick($event)">
              <vue-seamless-scroll
                :data="listData"
                class="seamless-warp"
                :class-option="classOption"
              >
                <ul class="ve_ul">
                  <li v-for="item in listData" >
                    <div class="list_bj" :data-dept="item.id">
                      {{item.xfc}}
                      <div v-if="item.status=='出动'" class="round bj_y fr"></div>
                      <div v-else-if="item.status=='保修'" class="round bj_r fr"></div>
                      <div v-else="item.status=='在位'" class="round bj_g fr"></div>
                    </div>
                    <div class="list_text">
                      <div class="mt2">发动机功率:{{item.gl}}</div>
                      <div class="list_text2">起重重量:{{item.zl}}</div>
                    </div>
                  </li>
                </ul>
              </vue-seamless-scroll>
            </div>
          </div>
          <!-- 值勤车辆end -->

          <!-- 值班信息strat -->
          <div class="right-bottom screen-item">
            <h3 class="screen-item-title">值班信息</h3>
            <div class="duty-main">
              <div class="duty">
                <ul class="duty_ul">
                  <li class="size17">大队全勤指挥部:</li>
                  <li style="float: left;margin-left: 10px;" v-for="(item,i) in OnDutArr1">{{item}}</li>
                </ul>
              </div>

              <div class="duty">
                <ul class="duty_ul">
                  <li class="size17">大队全勤指挥部:</li>
                  <li class="duty_ul_li" v-for="(item,i) in OnDutArr2">{{item}}</li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 值班信息end -->
        </div>

        <el-dialog title="警情信息" :visible.sync="dialogFormVisible">
          <el-form :model="earlyInfo">
            <el-form-item label="警情数量" :label-width="formLabelWidth">
              <el-input
                v-if="earlyType==1"
                v-model="earlyInfo.fireAlarmNum"
                autocomplete="off"
                ref="name"
                v-on:keyup="inputRef"
              ></el-input>
              <el-input
                v-else-if="earlyType==2"
                v-model="earlyInfo.emergencyRescueNum"
                autocomplete="off"
                ref="name"
                v-on:keyup="inputRef"
              ></el-input>
              <el-input
                v-else-if="earlyType==3"
                v-model="earlyInfo.socialAssistanceNum"
                autocomplete="off"
                ref="name"
                v-on:keyup="inputRef"
              ></el-input>
              <el-input
                v-else-if="earlyType==4"
                v-model="earlyInfo.falseAlarmNum"
                autocomplete="off"
                ref="name"
                v-on:keyup="inputRef"
              ></el-input>
              <el-input
                v-else="earlyType==5"
                v-model="earlyInfo.otherAlertNum"
                autocomplete="off"
                ref="name"
                v-on:keyup="inputRef"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="uploadEarlyBtn">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="值勤车辆" :visible.sync="dialogFormVisibleType">
          <el-form :model="formType">
            <el-form-item label="值勤类型" :label-width="formLabelWidth">
              <el-select v-model="formType.region" placeholder="请选择值勤类型" @change="getFormType">
                <el-option label="在位" value="在位"></el-option>
                <el-option label="出动" value="出动"></el-option>
                <el-option label="保修" value="保修"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleType = false">取 消</el-button>
            <el-button type="primary" @click="uploadVehicleStatusBtn">确 定</el-button>
          </div>
        </el-dialog>

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
            <el-form :model="formOrg_z">
              <el-form-item label="消防站" :label-width="formLabelWidth" v-show="play_x">
                <el-select v-model="value1" @change="getListData1" placeholder="请选择消防站">
                  <el-option
                    v-for="item in options_z"
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
      </div>
    </div>
  </div>
</template>
<style>
.seamless-warp {
  height: 266px;
  overflow: hidden;
}
.seamless {
  height: 100%;
  overflow: hidden;
  z-index: 999;
  float: left;
  padding-left: 10%;
}
.dialog-footer {
  text-align: center;
}
</style>

<script>
import Vue from "vue";
import "./assets/lib/rem.js";
import storage from "./api/right";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import request from "./api/request.js";
import Weather from './components/weather';
import Notice from './components/notice';
import Education from './components/education';
import vueSeamlessScroll from "vue-seamless-scroll";
Vue.use(ElementUI, axios, vueSeamlessScroll);
export default {
  name: "hello",
  data() {
    return {
      url: "http://121.41.27.194:8080/api",
      dataobj: "",
      sourceId: "",
      dialogFormVisible: false,
      dialogFormVisibleType: false,
      dialogFormVisibleOrg: true,
      showClo: false,
      full: true,
      play_d: true,
      play_x: true,
      listData: [],
      form: { region: "", name: "" },
      options: [{ value: "选项1", label: "无数据", sourceId: "", id: "" }],
      options_z: [{ value: "选项1", label: "无数据", sourceId: "", id: "" }],
      formType: { region: "", value: "" },
      formOrg: { id: "", region: "", name: "", sourceId: "" },
      formOrg_z: { id: "", region: "", name: "", sourceId: "" },
      formLabelWidth: "120px",
      birthday_data: [],
        //每月之星
        learnStar: '',
        disciplineStar: '',
        houseStar: '',
        trainStar: '',
        learn_img: '',
        discipline_img: '',
        houser_img: '',
        train_img: '',

        //人员动态
        numAll: '',
        numtype1: '',
        numtype2: '',
        numZaigang: '',
        numGongchai: '',
        numXiujia: '',
        commander_add: '',
        userNames1:[],
        userNames2:[],
        userNames3:[],
        userNames4:[],
        userNames5:[],
        userNames6:[],
        //量化考评
        idd1:[],
        idd2:[],
        idd3:[],
        idd4:[],
        idd5:[],
        idd6:[],
        evaluationName: '',
        project: '',
        score: '',

        value1: "",
        earlyInfo:{},  //今日警情信息
        earlyType:0,   //警情类型 处理传参
        OnDutyInfo:{}, //今日值班信息
        OnDutArr1:[],  //值班信息数组1
        OnDutArr2:[],  //值班信息数组2
        vehicleInfo:{},
        carsId: "",
        status: "",
        noticeSourceId: '',
        eduStationId: '',
        noticeData: [],
        flagVisible: false
    };
  },
  components: {
    //组件
    vueSeamlessScroll,
    Weather,
    Notice,
    Education
  },
  methods: {
    inputRef: function() {
      this.form.name = this.$refs.name.value;
    },

    //选择消防站时存储数据
    getListData1(val) {
      let obj = {};
      obj = this.options_z.find(item => {
        return item.id === val;
      });
      this.formOrg_z = obj;
    },

    //用户权限处理
    setUserPermissions(obj) {
      if (obj.isStation == true) {
        this.play_d = false;
        this.play_x = true;
        this.options_z = this.setDate(obj.stationData);
      } else if (obj.isBrigade == true) {
        this.play_d = true;
        this.play_x = true;
        this.options = this.setDate(obj.brigadeData);
      } else if (obj.isDetachment == true) {
        this.play_d = true;
        this.play_x = false;
        this.options = this.setDate(obj.detachmentData);
      } else if (obj.errcode == 406) {
        this.play_d = false;
        this.play_x = false;
        this.$message({
          message: "该用户没有权限，无法查看大屏数据",
          type: "warning"
        });
      }
    },

    //确定按钮 处理查看大屏类型
    confirmBtn() {
      console.log("formOrg_z==", this.formOrg_z); //站json
      console.log("formOrg", this.formOrg); //大队json
      if (this.formOrg.id != "" && this.formOrg_z.id == "") {
        this.noticeSourceId = this.formOrg.sourceId;
        this.eduStationId = this.formOrg.id;
        this.dialogFormVisibleOrg = false; //查看大队大屏
        this.$message({
          message: "查看大队大屏",
          type: "success"
        });
      } else if (this.formOrg.id != "" && this.formOrg_z.id != "") {
        this.noticeSourceId = this.formOrg.sourceId;
        this.eduStationId = this.formOrg.id;
        this.$message({
          message: "查看大队下面消防站大屏",
          type: "success"
        });
        this.dialogFormVisibleOrg = false; //查看大队下面消防站大屏
      } else if (this.formOrg_z.id != "" && this.formOrg.id == "") {
        this.noticeSourceId = this.formOrg_z.sourceId;
        this.eduStationId = this.formOrg_z.id;
        this.$message({
          message: "只查看消防站大屏",
          type: "success"
        });
        this.dialogFormVisibleOrg = false; //查看消防站大屏
        this.getEarlyInfo(); //警情信息
        this.getOnDutyInfo(); //值班信息
        this.getVehicleInfo(); //车辆信息
      } else {
        this.$message({
          message: "请选择部门",
          type: "warning"
        });
      }
      console.log(this.noticeSourceId + '-------');
      // 公告
      // this.$refs['notice'].getNoticeInfo(this.noticeSourceId);
      // 教育训练计划
      this.$refs['education'].getEducationData(this.eduStationId);
      this.getMainInfo(this.noticeSourceId);
      this.getAssessmentInfo(this.eduStationId);
    },

    uploadEarliInfo(type) {
      this.dialogFormVisible = true;
      this.earlyType = type;
    },
    uploadEarlyBtn() {
      this.dialogFormVisible = false;
      var parmar = {
        id: this.earlyInfo.id,
        callPoliceTotal: this.earlyInfo.callPoliceTotal,
        fireAlarmNum: this.earlyInfo.fireAlarmNum,
        emergencyRescueNum: this.earlyInfo.emergencyRescueNum,
        socialAssistanceNum: this.earlyInfo.socialAssistanceNum,
        falseAlarmNum: this.earlyInfo.falseAlarmNum,
        otherAlertNum: this.earlyInfo.otherAlertNum
      };
      request.uploadEarlyInfo(parmar).then(res => {
        if (res.errcode == 0) {
          this.$message({
            message: "更新成功",
            type: "success"
          });
        }
      });
    },

    uploadVehicleStatus(carsId) {
      this.dialogFormVisibleType = true;
      this.carsId = carsId;
    },

    uploadVehicleStatusBtn() {
      axios.put(this.url +"/controller/carsInfo/updateCarsStatus?carsId=" +this.carsId +"&status=" +this.status)
        .then(response => {
          if (response.errcode == 0) {
            this.$message({
              message: "更新成功",
              type: "success"
            });
            this.dialogFormVisibleType = false;
            this.getVehicleInfo(); //车辆信息
          }
        })
        .catch(error => {});
    },

    getFormType() {
      this.status = this.formType.region;
    },

    handleClick(event){
      this.dialogFormVisibleType = true;
      this.carsId = event.target.dataset.dept;
    },

    //根据大队id获取大队下消防站的数据
    getListData(id) {
      //选择大队时存储数据 strat
      let objs = {};
      objs = this.options.find(item => {
        return item.id === id;
      });
      this.formOrg = objs;
      //选择大队时存储数据 end

      var parmar = { brigadeId: id };
      request.getStation(parmar).then(res => {
        if (res.errcode == 0) {
          var arr = [];
          for (var i = 0; i < res.data.length; i++) {
            var obj = new Object();
            obj.sourceId = res.data[i].sourceId;
            obj.name = res.data[i].name;
            obj.id = res.data[i].id;
            obj.value = res.data[i].id;
            obj.label = res.data[i].name;
            arr.push(obj);
          }
          this.options_z = arr;
        } else if (res.errcode == 406) {
        }
      });
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

    //获取车辆信息
    getVehicleInfo() {
      storage.getVehicleInfo(this.formOrg_z.id).then(res => {
        this.vehicleInfo = res;
        var arrDate = res.vehicleInfos;
        var ar = [];
        for (var i = 0; i < arrDate.length; i++) {
          var obj = new Object();
          obj.id = arrDate[i].id;
          obj.xfc = arrDate[i].vehicleName;
          obj.gl = arrDate[i].enginePower;
          obj.zl = arrDate[i].liftingWeight;
          obj.status = arrDate[i].vehicleStatus;
          ar.push(obj);
        }
        this.listData = ar;
      });
    },
    //获取值班信息
    getOnDutyInfo() {
      storage.getOnDutyInfo(this.formOrg_z.id).then(res => {
        this.OnDutyInfo = res;
        this.OnDutArr1 = res.brigadeHeadquarters;
        this.OnDutArr2 = res.stationDutyCadres;
      });
    },
    //获取今日警情信息
    getEarlyInfo() {
      storage.getEarlyInfo(this.formOrg_z.id).then(res => {
        this.earlyInfo = res;
      });
    },

    // 每月之星
    getMonth(){
      let par = {
        stationId: 'af127c960a8b490683a1ff9c57b83163',
        date: '2020-04-01 00:00:00'
      }
      request.getStationStarMonth(par).then(res => {
        this.learnStar = res.data.learningStar.name;
        // console.log(res.learningStar.name);
        this.disciplineStar = res.data.disciplineStar.name;
        this.trainStar = res.data.trainStar.name;
        this.houseStar = res.data.houseStar.name;
        this.learn_img = res.data.learningStar.imgUrl;
        this.discipline_img = res.data.disciplineStar.imgUrl;
        this.house_img = res.data.houseStar.imgUrl;
        this.train_img = res.data.trainStar.imgUrl;
      })
    },

    //人员动态和生日
    getMainInfo(deptId){
      let par = {
        deptId: deptId
      }
      request.getMainInfo(par).then(res => {
        console.log(res.data);
        this.noticeData = res.data.notice;
        this.userNames1 = res.data.userNames1;
        this.userNames2 = res.data.userNames2;
        this.userNames3 = res.data.userNames3;
        this.userNames4 = res.data.userNames4;
        this.userNames5 = res.data.userNames5;
        this.userNames6 = res.data.userNames6;
        this.numAll = res.data.numAll;
        this.numtype1 = res.data.numtype1;
        this.numtype2 = res.data.numtype2;
        this.numZaigang = res.data.numZaigang;
        this.numGongchai = res.data.numGongchai;
        this.numXiujia = res.data.numXiujia;
        // this.birthday_data = res.data.birthdayNames;
        // myjing公告
        this.flagVisible = true;
        if(res.data.birthdayNames.length != 0){
          this.birthday_data = res.data.birthdayNames;
        }else{
            this.birthday_data = [{
            'text': '对党忠诚，纪律严明，赴汤蹈火，竭诚为民'
          }];
        }
        // this.birthday_data = [{
        //   'text': '祝陈飞同志生日快乐!'
        // }, {
        //   'text': '祝飞儿同志生日快乐!'
        // }];
      });
    },

    //量化考评
    getAssessmentInfo(stationId){
      let par = {
        stationId: stationId
      }
      request.getAssessmentInfo(par).then(res =>{
        console.log("量化考评");
        console.log(res.data);
        if(res.data){
          let idd1 = [];
          let idd2 = [];
          let idd3 = [];
          let idd4 = [];
          let idd5 = [];
          let idd6 = [];
          idd1.push(res.data[0].evaluationName);
          idd1.push(res.data[0].project);
          idd1.push(res.data[0].score + '分');
          this.idd1 = idd1;
          idd2.push(res.data[1].evaluationName);
          idd2.push(res.data[1].project);
          idd2.push(res.data[1].score + '分');
          this.idd2 = idd2;
          idd3.push(res.data[2].evaluationName);
          idd3.push(res.data[2].project);
          idd3.push(res.data[2].score + '分');
          this.idd3 = idd3;
          idd3.push(res.data[3].evaluationName);
          idd3.push(res.data[3].project);
          idd3.push(res.data[3].score + '分');
          this.idd4 = idd4;
          idd3.push(res.data[4].evaluationName);
          idd3.push(res.data[4].project);
          idd3.push(res.data[4].score + '分');
          this.idd5 = idd5;
          idd3.push(res.data[5].evaluationName);
          idd3.push(res.data[5].project);
          idd3.push(res.data[5].score + '分');
          this.idd6 = idd6;
        }
        
        // console.log("啊哈哈哈哈");
        // console.log(res);
        
      })
    }
  },
  computed: {
    classOption() {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      };
    },
    center_option() {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      };
    }
  },
  mounted(){
    this.getMonth();
    // this.getMainInfo();
    //this.getAssessmentInfo();
    storage.getUserPermissionsDate().then(res => {
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