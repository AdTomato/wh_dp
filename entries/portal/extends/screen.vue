<template>
  <div class="screen">
    <div class="screen-title">
      <h2>武汉市{{titleNameDd+titleName}}消防救援站</h2>
      <img src="./assets/images/navbar_bg.png" alt />
    </div>
    <div class="screen-main">
      <!-- 左边 -->
      <div class="screen-left">
        <!-- 天气情况 -->
        <Weather></Weather>
        <!-- 通知公告 -->
        <Notice ref="notice"></Notice>
        <!-- 教育训练计划和龙虎榜 -->
        <Education ref="education"></Education>
      </div>
      <!-- 中间 -->
      <div class="screen-center">
        <div class="content-top">
          <div class="screen-item" style="height:100%">
            <h3 class="screen-item-title">人员动态</h3>
            <div class="total_nums">
              <ul class="tel_ul">
                <li>
                  总指挥
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
            <div class="detail_nums">
              <ul class="commander_list mf">
                <li class="commander_name">指&nbsp;&nbsp;&nbsp;挥&nbsp;&nbsp;&nbsp;员 :</li>
                <li class="commander_detail">
                  <span
                    v-for="item in userNames1"
                    v-show="item.sequenceStatus=='1'"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='2'"
                    class="gree"
                    v-for="item in userNames1"
                  >{{item.sequenceNo}}</span>
                  <span
                    class="yello"
                    v-for="item in userNames1"
                    v-show="item.sequenceStatus=='3'"
                  >{{item.sequenceNo}}</span>
                </li>
              </ul>
              <ul class="commander_list ms">
                <li class="commander_name">特 勤 一 班 :</li>
                <li class="commander_detail">
                  <span
                    v-for="item in userNames2"
                    v-show="item.sequenceStatus=='1'"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='2'"
                    class="gree"
                    v-for="item in userNames2"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='3'"
                    class="yello"
                    v-for="item in userNames2"
                  >{{item.sequenceNo}}</span>
                </li>
              </ul>
              <ul class="commander_list mx">
                <li class="commander_name">特 勤 二 班 :</li>
                <li class="commander_detail">
                  <span
                    v-for="item in userNames3"
                    v-show="item.sequenceStatus=='1'"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='2'"
                    class="gree"
                    v-for="item in userNames3"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='3'"
                    class="yello"
                    v-for="item in userNames3"
                  >{{item.sequenceNo}}</span>
                </li>
              </ul>
              <ul class="commander_list mj">
                <li class="commander_name">灭 火 一 班 :</li>
                <li class="commander_detail">
                  <span
                    v-for="item in userNames4"
                    v-show="item.sequenceStatus=='1'"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='2'"
                    class="gree"
                    v-for="item in userNames4"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='3'"
                    class="yello"
                    v-for="item in userNames4"
                  >{{item.sequenceNo}}</span>
                </li>
              </ul>
              <ul class="commander_list mk">
                <li class="commander_name">灭 火 二 班 :</li>
                <li class="commander_detail">
                  <span
                    v-for="item in userNames5"
                    v-show="item.sequenceStatus=='1'"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='2'"
                    class="gree"
                    v-for="item in userNames5"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='3'"
                    class="yello"
                    v-for="item in userNames5"
                  >{{item.sequenceNo}}</span>
                </li>
              </ul>
              <ul class="commander_list ml">
                <li class="commander_name">通信保障班 :</li>
                <li class="commander_detail">
                  <span
                    v-for="item in userNames6"
                    v-show="item.sequenceStatus=='1'"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='2'"
                    class="gree"
                    v-for="item in userNames6"
                  >{{item.sequenceNo}}</span>
                  <span
                    v-show="item.sequenceStatus=='3'"
                    class="yello"
                    v-for="item in userNames6"
                  >{{item.sequenceNo}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content-center">
          <div class="content-left">
            <div class="screen-item" style="height:100%">
              <h3 class="screen-item-title">每月之星栏</h3>
              <ul>
                <li>
                  <img src="./assets/images/learn_star.png" class="name_star" />
                  <img :src="learn_img" class="star_img" />
                  <span class="star_name">{{learnStar}}</span>
                </li>
              </ul>
              <ul>
                <li>
                  <img src="./assets/images/discipline_star.png" class="name_star" />
                  <img :src="discipline_img" class="star_img" />
                  <span class="star_name">{{disciplineStar}}</span>
                </li>
              </ul>
              <ul>
                <li>
                  <img src="./assets/images/train_star.png" class="name_star" />
                  <img :src="train_img" class="star_img" />
                  <span class="star_name">{{trainStar}}</span>
                </li>
              </ul>
              <ul>
                <li>
                  <img src="./assets/images/house_star.png" class="name_star" />
                  <img :src="houser_img" class="star_img" />
                  <span class="star_name">{{houseStar}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="content-right">
            <div class="screen-item" style="height:100%" @click="handleDetail">
              <h3 class="screen-item-title">量化考评周报</h3>
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
            <el-dialog title="量化考勤周报" :visible.sync="openClick">
              <el-form :model="formType">
                <el-table class="tableData" :data="tableDataDetail" :span-method="objectSpanMethod">
                  <el-table-column prop="team" label="班级" width="100%"></el-table-column>
                  <el-table-column prop="name" label="姓名"></el-table-column>
                  <el-table-column prop="zzsxScore" label="政治思想加/扣分"></el-table-column>
                  <el-table-column prop="fcmlScore" label="服从命令加/扣分"></el-table-column>
                  <el-table-column prop="zzsjScore" label="遵纪守法加/扣分"></el-table-column>
                  <el-table-column prop="zfycScore" label="作风养成加/扣分"></el-table-column>
                  <el-table-column prop="shzdScore" label="一日生活制度加/扣分"></el-table-column>
                  <el-table-column prop="jsxlScore" label="军事训练加/扣分"></el-table-column>
                  <el-table-column prop="mhjyScore" label="灭火救援加/扣分"></el-table-column>
                  <el-table-column prop="currentMonthScore" label="本月综合得分"></el-table-column>
                  <el-table-column prop="lastMonthScore" label="上月综合得分"></el-table-column>
                </el-table>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="openClick = false">关 闭</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
        <div class="content-bottom">
          <vue-seamless-scroll :data="newsList" :class-option="optionLeft" class="seamless-warp2">
            <ul class="item">
              <li class v-for="item in newsList" v-text="item"></li>
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
          <Password :visible.sync="visiblePassword" @passwordCommit = "passwordCommit" 
          :passBool="passBool"></Password>
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
                  <li v-for="item in listData">
                    <div class="list_bj" :data-dept="item.id">
                      {{item.xfc}}
                      <div v-if="item.status=='出动'" class="round bj_y fr"></div>
                      <div v-else-if="item.status=='保修'" class="round bj_r fr"></div>
                      <div v-else="item.status=='在位'" class="round bj_g fr"></div>
                    </div>
                    <div class="list_text">
                      <div class="mt2">发动机功率:{{item.gl+"/KM"}}</div>
                      <div v-if="item.zl" class="list_text2">起重重量:{{item.zl+"吨"}}</div>
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
                  <li class="size17">队站值班干部:</li>
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
.dialog-footer {
  text-align: center;
}
.gree {
  color: #13a71d;
}
.yello {
  color: #c0a000;
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
import Weather from "./components/weather";
import Notice from "./components/notice";
import Education from "./components/education";
import vueSeamlessScroll from "vue-seamless-scroll";
import Password from "./components/password.vue";
Vue.use(ElementUI, axios, vueSeamlessScroll);
export default {
  name: "hello",
  data() {
    return {
      url: "http://121.41.27.194:8080/api",
      visiblePassword: false,
      consumerType: "",
      dataobj: "",
      sourceId: "",
      dialogFormVisible: false,
      dialogFormVisibleType: false,
      dialogFormVisibleOrg: true,
      showClo: false,
      titleName: "",
      titleNameDd: "",
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
      newsList: ["对党忠诚，纪律严明，赴汤蹈火，竭诚为民!"],
      //newsList:[],
      lengths: 0,
      count: 0,
      //每月之星
      learnStar: "",
      disciplineStar: "",
      houseStar: "",
      trainStar: "",
      learn_img: "",
      discipline_img: "",
      houser_img: "",
      train_img: "",
      //人员动态
      numAll: "",
      numtype1: "",
      numtype2: "",
      numZaigang: "",
      numGongchai: "",
      numXiujia: "",
      commander_add: "",
      userNames1: [],
      userNames2: [],
      userNames3: [],
      userNames4: [],
      userNames5: [],
      userNames6: [],
      //量化考评
      idd1: [],
      idd2: [],
      idd3: [],
      idd4: [],
      idd5: [],
      idd6: [],
      evaluate_list: [],
      idds: [],
      evaluationName: "",
      project: "",
      score: "",

      //更新量化考情周报
      openClick: false,
      tableDataDetail: [],
      spanArr: [],

      value1: "",
      earlyInfo: {}, //今日警情信息
      earlyType: 0, //警情类型 处理传参
      OnDutyInfo: {}, //今日值班信息
      OnDutArr1: [], //值班信息数组1
      OnDutArr2: [], //值班信息数组2
      vehicleInfo: {},
      carsId: "",
      status: "",
      noticeSourceId: "",
      eduStationId: "",
      noticeZhanId: "",
      passFlags: false,
      passBool: false,
      updateId: ''
    };
  },
  components: {
    //组件
    vueSeamlessScroll,
    Weather,
    Notice,
    Education,
    Password
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
      console.log("选择消防站时存储数据=", obj);
      this.formOrg_z = obj;
      this.titleName = obj.name;
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
        this.play_x = true;
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
      // if (this.formOrg.id != "" && this.formOrg_z.id == "") {
      //   this.noticeSourceId = this.formOrg.sourceId;
      //   this.eduStationId = this.formOrg.id;
      //   this.noticeZhanId = this.formOrg_z.id;
      //   this.dialogFormVisibleOrg = false; //查看大队大屏
      //   this.$message({
      //     message: "查看支队大屏",
      //     type: "success"
      //   });
      //   console.log("支队时候的id=",this.eduStationId);
      // } else
      if (this.formOrg.id != "" && this.formOrg_z.id != "") {
        this.noticeSourceId = this.formOrg_z.sourceId;
        this.eduStationId = this.formOrg_z.id;
        this.noticeZhanId = this.formOrg_z.id;
        this.updateId = this.formOrg.id;
        this.$message({
          message: "查看大队下面消防站大屏",
          type: "success"
        });
        console.log("大队时候的id=", this.eduStationId);
        this.dialogFormVisibleOrg = false; //查看大队下面消防站大屏
      } else if (this.formOrg_z.id != "" && this.formOrg.id == "") {
        this.noticeSourceId = this.formOrg_z.sourceId;
        this.eduStationId = this.formOrg_z.id;
        this.noticeZhanId = this.formOrg_z.id;
        this.updateId = this.formOrg_z.id;
        this.$message({
          message: "只查看消防站大屏",
          type: "success"
        });
        console.log("消防站时候的id=", this.eduStationId);
        this.dialogFormVisibleOrg = false; //查看消防站大屏
      } else if (this.play_d == false && this.play_x == false) {
        this.$message({
          message: "该用户没有权限，无法查看大屏数据",
          type: "warning"
        });
      } else if (this.formOrg_z.id == "") {
        this.$message({
          message: "请选择消防站",
          type: "warning"
        });
      } else {
        this.$message({
          message: "请选择部门",
          type: "warning"
        });
      }
      console.log(this.noticeSourceId + "-------");
      // 公告
      // this.$refs['notice'].getNoticeInfo(this.noticeSourceId);
      // 教育训练计划

      console.log("eduStationId====", this.eduStationId);
      this.$refs["education"].getEducationData(this.eduStationId);
      this.$refs["notice"].getNoticeInfo(this.noticeZhanId);
      // this.$refs["notice"].getNoticeInfo(this.noticeZhanId);
      this.getMainInfo(this.noticeSourceId);
      this.getAssessmentInfo(this.eduStationId); //量化考评
      this.getMonth(this.eduStationId);
      this.getAssessmentMonthDetailInfo(this.eduStationId); //量化考评详细

      this.getEarlyInfo(this.eduStationId); //警情信息
      this.getOnDutyInfo(this.eduStationId); //值班信息
      this.getVehicleInfo(this.eduStationId); //车辆信息
    },

    uploadEarliInfo(type) {
      this.dialogFormVisible = true;
      this.earlyType = type;
      this.passFlags = false;
    },
    uploadEarlyBtn() {
      this.dialogFormVisible = false;
      this.visiblePassword = true;
      this.passFlags = true;
    },

    passwordCommit(password){

      debugger;
      if(this.passFlags){
        var fire = 0;
        var eme = 0;
        var soc = 0;
        var falseA = 0;
        var other = 0;
        var count = 0;
        fire = parseInt(this.earlyInfo.fireAlarmNum);
        eme = parseInt(this.earlyInfo.emergencyRescueNum);
        soc = parseInt(this.earlyInfo.socialAssistanceNum);
        falseA = parseInt(this.earlyInfo.falseAlarmNum);
        other = parseInt(this.earlyInfo.otherAlertNum);
        count = fire + eme + soc + falseA + other;
        var parmar = {
          id: this.earlyInfo.id,
          callPoliceTotal: count,
          fireAlarmNum: this.earlyInfo.fireAlarmNum,
          emergencyRescueNum: this.earlyInfo.emergencyRescueNum,
          socialAssistanceNum: this.earlyInfo.socialAssistanceNum,
          falseAlarmNum: this.earlyInfo.falseAlarmNum,
          otherAlertNum: this.earlyInfo.otherAlertNum,
          stationId:this.updateId
        };
        console.log("封装数据==",parmar)
        debugger;
        request.uploadEarlyInfo(parmar,this.consumerType,password).then(res => {
          debugger;
          if (res.errcode == 0) {
            this.$message({
              message: "更新成功",
              type: "success"
            });
            this.getEarlyInfo(this.updateId); //警情信息
            this.visiblePassword = false;
          }else if(res.errcode == 407){
            this.$message({
              message: "密码错误！请重新输入",
              type: "error"
            });
          }
        })
      }else{
        debugger;
           axios.put(this.url + "/controller/carsInfo/updateCarsStatus?carsId=" +this.carsId +"&status=" +this.status +"&stationId=" +this.updateId +"&consumerType="+this.consumerType+"&password=" +password)
          .then(response => {
            debugger;
            console.log("response=",response)
            if (response.errcode == 0) {
              debugger;
              this.$message({
                message: "更新成功",
                type: "success"
              });
              this.getVehicleInfo(this.eduStationId); //车辆信息
              this.visiblePassword = false;
              this.dialogFormVisible = false;
            } else if (response.errcode == 407) {
              debugger;
                this.$message({
                  message: "密码错误！请重新输入",
                  type: "error"
                });
              }
          })
          .catch(error => {
            console.log("ereor = ",error)
          });

      }
    },

    uploadVehicleStatus(carsId) {
      this.dialogFormVisibleType = true;
      this.carsId = carsId;
    },

    uploadVehicleStatusBtn() {
      this.dialogFormVisible = false;
      this.visiblePassword = true;
      this.passFlags = false;
    },

    getFormType() {
      this.status = this.formType.region;
    },

    handleClick(event) {
      if (event.target.dataset.dept != undefined) {
        this.dialogFormVisibleType = true;
        this.carsId = event.target.dataset.dept;
      }
    },

    //根据大队id获取大队下消防站的数据
    getListData(id) {
      let s = "";
      //选择大队时存储数据 strat
      let objs = {};
      objs = this.options.find(item => {
        return item.id === id;
      });
      s = objs.name;
      this.formOrg = objs;
      this.titleNameDd = s.substr(0, s.length - 2) + "区";
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

    //定时器 2小时更新一次
    timer() {
      console.log("定时执行函数----2小时执行一次");
      this.$refs["education"].getEducationData(this.eduStationId);
      this.$refs["notice"].getNoticeInfo(this.noticeZhanId);
      this.getMainInfo(this.noticeSourceId);
      this.getAssessmentInfo(this.eduStationId);
      this.getMonth(this.eduStationId);
      this.getEarlyInfo(this.eduStationId); //警情信息
      this.getOnDutyInfo(this.eduStationId); //值班信息
      this.getVehicleInfo(this.eduStationId); //车辆信息
    },

    //获取车辆信息
    getVehicleInfo(id) {
      storage.getVehicleInfo(id).then(res => {
        if (res != undefined) {
          this.vehicleInfo = res;
          var arrDate = res.vehicleInfos;
          this.lengths = arrDate.length;
          console.log("车辆总数=",this.lengths)
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
        } else {
          var arrs = [{ xfc: "暂无数据", gl: "0", zl: "0" }];
          this.listData = arrs;
        }
      });
    },
    //获取值班信息
    getOnDutyInfo(id) {
      storage.getOnDutyInfo("af127c960a8b490683a1ff9c57b83163", 1).then(res => {
        if (res != undefined) {
          this.OnDutyInfo = res;
          this.OnDutArr1 = res.brigadeHeadquarters;
          this.OnDutArr2 = res.stationDutyCadres;
        } else {
          this.OnDutArr1 = ["暂无数据"];
          this.OnDutArr2 = ["暂无数据"];
        }
      });
    },
    //获取今日警情信息
    getEarlyInfo(id) {
      storage.getEarlyInfo(id, 1).then(res => {
        if (res != undefined) {
          this.earlyInfo = res;
          var fire = 0;
          var eme = 0;
          var soc = 0;
          var falseA = 0;
          var other = 0;

          fire = parseInt(res.fireAlarmNum);
          eme = parseInt(res.emergencyRescueNum);
          soc = parseInt(res.socialAssistanceNum);
          falseA = parseInt(res.falseAlarmNum);
          other = parseInt(res.otherAlertNum);
          this.count = fire + eme + soc + falseA + other;
          console.log("count===", this.count);
        }
      });
    },

    // 每月之星
    getMonth(stationId) {
      var date = new Date();
      var month = date.getMonth() + 1;

      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var hours = date.getHours();
      if (hours >= 0 && hours <= 9) {
        if (hours == 0) {
          hours = "00";
        } else {
          hours = "0" + hours;
        }
      }
      var minutes = date.getMinutes();
      if (minutes >= 0 && minutes <= 9) {
        if (minutes == 0) {
          minutes = "00";
        } else {
          minutes = "0" + minutes;
        }
      }
      var seconds = date.getSeconds();
      if (seconds >= 0 && seconds <= 9) {
        if (seconds == 0) {
          seconds = "00";
        } else {
          seconds = "0" + seconds;
        }
      }
      var currentdate =
        date.getFullYear() +
        "-" +
        month +
        "-" +
        strDate +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      let par = {
        stationId: stationId,
        date: currentdate
      };
      request.getStationStarMonth(par).then(res => {
        console.log("learningStar=", res);
        if (res == "undefined" || res == null || res == "") {
          return false;
        } else {
          if (res.data.learningStar.name != null) {
            this.learnStar = res.data.learningStar.name;
          }
          if (res.data.disciplineStar.name != null) {
            this.disciplineStar = res.data.disciplineStar.name;
          }
          if (res.data.trainStar.name != null) {
            this.trainStar = res.data.trainStar.name;
          }
          if (res.data.houseStar.name != null) {
            this.houseStar = res.data.houseStar.name;
          }
          if (res.data.learningStar.imgUrl != null) {
            this.learn_img = res.data.learningStar.imgUrl;
          }
          if (res.data.disciplineStar.imgUrl != null) {
            this.discipline_img = res.data.disciplineStar.imgUrl;
          }
          if (res.data.houseStar.imgUrl != null) {
            this.house_img = res.data.houseStar.imgUrl;
          }
          if (res.data.trainStar.imgUrl != null) {
            this.train_img = res.data.trainStar.imgUrl;
          }
        }
      });
    },

    //人员动态和生日
    getMainInfo(deptId) {
      let par = {
        deptId: deptId
      };
      request.getMainInfo(par).then(res => {
        if (res.data.numAll != null) {
          this.numAll = res.data.numAll;
        }
        if (res.data.numtype1 != null) {
          this.numtype1 = res.data.numtype1;
        }
        if (res.data.numtype2 != null) {
          this.numtype2 = res.data.numtype2;
        }
        if (res.data.numZaigang != null) {
          this.numZaigang = res.data.numZaigang;
        }
        if (res.data.numGongchai != null) {
          this.numGongchai = res.data.numGongchai;
        }
        if (res.data.numXiujia != null) {
          this.numXiujia = res.data.numXiujia;
        }

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
        // let pr = [];
        // pr.push('祝' + res.data.birthdayNames + '生日快乐!');
        // console.log(pr);
        // this.newsList = pr;
        if (res.data.birthdayNames.length != 0) {
          let pr = [];
          pr.push("祝" + res.data.birthdayNames + "生日快乐！");
          this.newsList = pr;
        } else {
          this.newsList = ["对党忠诚，纪律严明，赴汤蹈火，竭诚为民!"];
        }
      });
    },

    //量化考评
    getAssessmentInfo(stationId) {
      let par = {
        stationId: stationId
      };
      request.getAssessmentInfo(par).then(res => {
        var ar = [];
        if (res.data) {
          let idd1 = [];
          let idd2 = [];
          let idd3 = [];
          let idd4 = [];
          let idd5 = [];
          let idd6 = [];
          if (res.data[0] != null) {
            idd1.push(res.data[0].evaluationName);
            idd1.push(res.data[0].project);
            idd1.push(res.data[0].score + "分");
            this.idd1 = idd1;
          }
          if (res.data[1] != null) {
            idd2.push(res.data[1].evaluationName);
            idd2.push(res.data[1].project);
            idd2.push(res.data[1].score + "分");
            this.idd2 = idd2;
          }
          if (res.data[2] != null) {
            idd3.push(res.data[2].evaluationName);
            idd3.push(res.data[2].project);
            idd3.push(res.data[2].score + "分");
            this.idd3 = idd3;
          }
          if (res.data[3] != null) {
            idd4.push(res.data[3].evaluationName);
            idd4.push(res.data[3].project);
            idd4.push(res.data[3].score + "分");
            this.idd4 = idd4;
          }
          if (res.data[4] != null) {
            idd5.push(res.data[4].evaluationName);
            idd5.push(res.data[4].project);
            idd5.push(res.data[4].score + "分");
            this.idd5 = idd5;
          }
          if (res.data[5] != null) {
            idd6.push(res.data[5].evaluationName);
            idd6.push(res.data[5].project);
            idd6.push(res.data[5].score + "分");
            this.idd6 = idd6;
          }
        }
      });
    },

    //量化考勤周报详情页面
    handleDetail() {
      this.openClick = true;
    },

    //更新量化考情周报
    getAssessmentMonthDetailInfo(stationId) {
      let pr = {
        stationId: stationId
      };
      request.getAssessmentMonthDetailInfo(pr).then(res => {
        console.log("量化考情详情");
        var arr = [];
        for (var i = 0; i < res.data.length; i++) {
          var teams = res.data[i].team;
          for (
            var j = 0;
            j < res.data[i].quantiAssessmentMonthInfoList.length;
            j++
          ) {
            var key = "team";
            var value = teams;
            res.data[i].quantiAssessmentMonthInfoList[j][key] = value;
            arr.push(res.data[i].quantiAssessmentMonthInfoList[j]);
          }
        }
        this.getSpanArr(arr);
        this.tableDataDetail = arr;
        console.log(this.tableDataDetail);
      });
    },

    //合并单元格
    getSpanArr(data) {
      console.log("333333333");
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].team === data[i - 1].team) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    }
  },
  computed: {
    classOption() {
        return {
            step: 0.2, // 数值越大速度滚动越快
            limitMoveNum:8
        };
    },
    optionLeft() {
      return {
        direction: 2,
        limitMoveNum: 0
      };
    }
  },
  mounted() {
    storage.getUserPermissionsDate().then(res => {
      if (res.errcode == 405) {
        this.$message({
          message: res.errmsg,
          type: "warning"
        });
      } else {
        console.log("用户权限=", res);
        this.setUserPermissions(res);
        if(true==res.isDetachment){
          this.passBool = true;
          this.consumerType = '支队';
        }else if(true==res.isBrigade){
          this.passBool = true;
          this.consumerType = '大队';
        }else if(true==res.isStation){
          this.passBool = true;
          this.consumerType = '消防站';
        }
      }
    });
    setInterval(this.timer, 1000 * 60 * 60 * 2); //定时器 2小时请求一次
    //this.getSpanArr(this.tableDataDetail);
  }
};
</script>

<style lang="less">
@import "./assets/styles/screen.less";
@import "./assets/styles/right.less";
@import "./assets/styles/content.less";
</style>