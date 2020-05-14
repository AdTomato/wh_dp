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
        <Notice></Notice>
        <!-- 本周重点工作 -->
        <div class="two-branch">
          <div class="branch-item">
            <h3 class="screen-item-title">教育训练计划</h3>
            <div class="branch-cont">
              <div class="branch-cont-title">
                <span class="branch-time">时间</span>
                <span class="branch-content">内容</span>
              </div>
              <ul class="branch-ul">
                <li>
                  <span class="branch-time">早上</span>
                  <span class="branch-project">队容风纪检查</span>
                </li>
                <li>
                  <span class="branch-time">上午</span>
                  <span class="branch-project">1人3盘水带走接操</span>
                </li>
                <li>
                  <span class="branch-time">下去</span>
                  <span class="branch-project">思想政治教育</span>
                </li>
                <li>
                  <span class="branch-time">晚上</span>
                  <span class="branch-project">100m跑</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="branch-item">
            <h3 class="screen-item-title">龙虎榜</h3>
            <div class="branch-cont">
              <div class="branch-cont-title branch-bang-title">
                <span class="bang-subject">训练科目</span>
                <span class="bang-name">姓名</span>
                <span class="bang-score">成绩</span>
              </div>
              <ul class="bang-ul">
                <li>
                  <span class="bang-subject">单杠一练习</span>
                  <span class="bang-name">沈伟</span>
                  <span class="bang-score">32个</span>
                </li>
                <li>
                  <span class="bang-subject">单杠二练习</span>
                  <span class="bang-name">张旭</span>
                  <span class="bang-score">25个</span>
                </li>
                <li>
                  <span class="bang-subject">双杠一练习</span>
                  <span class="bang-name">李坤</span>
                  <span class="bang-score">35个</span>
                </li>
                <li>
                  <span class="bang-subject">壶铃折返</span>
                  <span class="bang-name">曹磊</span>
                  <span class="bang-score">39"</span>
                </li>
                <li>
                  <span class="bang-subject">200m负重跑</span>
                  <span class="bang-name">华环</span>
                  <span class="bang-score">36"</span>
                </li>
                <li>
                  <span class="bang-subject">400m疏散物资</span>
                  <span class="bang-name">李涛</span>
                  <span class="bang-score">70"</span>
                </li>
                <li>
                  <span class="bang-subject">3000m徒手跑</span>
                  <span class="bang-name">宋奎</span>
                  <span class="bang-score">11'05"</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 中间 -->
      <div class="screen-center">
        <div class="content-top">
          <div class="screen-item" style="height:100%">
            <h3 class="screen-item-title">人员动态</h3>
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
                  指 挥 员:
                  <span>郭海涛</span>
                  <span>张 卓</span>
                  <span>宋星星</span>
                  <span>赵章全</span>
                  <span>王 杰</span>
                  <span>李梦念</span>
                </li>
              </ul>
              <ul class="commander_list">
                <li class="commander_detail">
                  特情一班:
                  <span>李 斌</span>
                  <span>宁成伟</span>
                  <span>邓 彪</span>
                  <span class="yellow_name">黄 磊</span>
                  <span>王 晶</span>
                  <span>张 娟</span>
                  <span>黄 玲</span>
                  <span>袁 东</span>
                </li>
              </ul>
              <ul class="commander_list">
                <li class="commander_detail">
                  特情二班:
                  <span>李 斌</span>
                  <span>宁成伟</span>
                  <span>邓 彪</span>
                  <span class="yellow_name">黄 磊</span>
                  <span>王 晶</span>
                  <span>张 娟</span>
                  <span>黄 玲</span>
                </li>
              </ul>
              <ul class="commander_list">
                <li class="commander_detail">
                  灭火一班:
                  <span>李 斌</span>
                  <span>宁成伟</span>
                  <span>邓 彪</span>
                  <span class="yellow_name">黄 磊</span>
                  <span>王 晶</span>
                  <span>张 娟</span>
                  <span>黄 玲</span>
                  <span>袁 东</span>
                </li>
              </ul>
              <ul class="commander_list">
                <li class="commander_detail">
                  灭火二班:
                  <span>李 斌</span>
                  <span>宁成伟</span>
                  <span>邓 彪</span>
                  <span class="yellow_name">黄 磊</span>
                  <span>王 晶</span>
                  <span>张 娟</span>
                  <span>黄 玲</span>
                  <span>袁 东</span>
                </li>
              </ul>
              <ul class="commander_list">
                <li class="commander_detail">
                  特情保障班:
                  <span>李 斌</span>
                  <span>宁成伟</span>
                  <span>邓 彪</span>
                  <span class="yellow_name">黄 磊</span>
                  <span>王 晶</span>
                  <span>张 娟</span>
                  <span>黄 玲</span>
                  <span>袁 东</span>
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
                  <li>
                    <img src="./assets/images/learn_star.png" />
                    <img src="./assets/images/star_man.png" />
                    <span class="star_name">沈伟</span>
                  </li>
                </ul>
                <ul>
                  <li>
                    <img src="./assets/images/learn_star.png" />
                    <img src="./assets/images/star_man.png" />
                    <span class="star_name">沈伟</span>
                  </li>
                </ul>
                <ul>
                  <li>
                    <img src="./assets/images/learn_star.png" />
                    <img src="./assets/images/star_man.png" />
                    <span class="star_name">沈伟</span>
                  </li>
                </ul>
                <ul>
                  <li>
                    <img src="./assets/images/learn_star.png" />
                    <img src="./assets/images/star_man.png" />
                    <span class="star_name">沈伟</span>
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
                    <span>x x</span>
                    <span>政治思想</span>
                    <span>+1分</span>
                  </li>
                  <li>
                    <span>x x</span>
                    <span>作风养成</span>
                    <span>-2分</span>
                  </li>
                  <li>
                    <span>x x</span>
                    <span>军事训练</span>
                    <span>-2分</span>
                  </li>
                  <li>
                    <span>x x</span>
                    <span>服从命令</span>
                    <span>+1分</span>
                  </li>
                  <li>
                    <span>x x</span>
                    <span>灭火救援</span>
                    <span>+2分</span>
                  </li>
                  <li>
                    <span>x x</span>
                    <span>遵章守纪</span>
                    <span>-2分</span>
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
                <li @click="dialogFormVisible = true">
                  火灾扑救
                  <div class="color_r mt">(1起)</div>
                </li>
                <li @click="dialogFormVisible = true">
                  抢险救援
                  <div class="color_b mt">(2起)</div>
                </li>
                <li @click="dialogFormVisible = true">
                  社会救助
                  <div class="color_y mt">(3起)</div>
                </li>
                <li @click="dialogFormVisible = true">
                  虚假报警
                  <div class="color_g mt">(5起)</div>
                </li>
                <li @click="dialogFormVisible = true">
                  其他警情
                  <div class="color_o mt">(0起)</div>
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

            <div class="clear vehicle">
              <vue-seamless-scroll
                :data="listData"
                class="seamless-warp"
                :class-option="classOption"
              >
                <ul class="ve_ul">
                  <li v-for="item in listData" @click="dialogFormVisibleType = true">
                    <div class="list_bj">
                      {{item.xfc}}
                      <div v-if="item.status==1" class="round bj_y fr"></div>
                      <div v-else-if="item.status==2" class="round bj_r fr"></div>
                      <div v-else="item.status==3" class="round bj_g fr"></div>
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
                  <li style="float: left;">巴荣兵</li>
                  <li style="float: left;margin-left: 10px;">霍建华</li>
                </ul>
              </div>

              <div class="duty">
                <ul class="duty_ul">
                  <li class="size17">大队全勤指挥部:</li>
                  <li style="float: left;">巴荣兵</li>
                  <li class="duty_ul_li">胡歌</li>
                  <li class="duty_ul_li">彭于晏</li>
                  <li class="duty_ul_li">薛之谦</li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 值班信息end -->
        </div>

        <el-dialog title="警情信息" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="警情数量" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="值勤车辆" :visible.sync="dialogFormVisibleType">
          <el-form :model="formType">
            <el-form-item label="值勤类型" :label-width="formLabelWidth">
              <el-select v-model="formType.region" placeholder="请选择值勤类型">
                <el-option label="在位" value="shanghai"></el-option>
                <el-option label="出动" value="beijing"></el-option>
                <el-option label="保修" value="baoxiu"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleType = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisibleType = false">确 定</el-button>
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
<<<<<<< Updated upstream
import Weather from './components/weather';
import Notice from './components/notice';
=======
import request from "./api/request";
>>>>>>> Stashed changes
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
      listData: [
        {
          xfc: "抢险救援消防车",
          gl: "***",
          zl: "****",
          status: 1
        },
        {
          xfc: "五十铃水罐消防车",
          gl: "***",
          zl: "****",
          status: 2
        },
        {
          xfc: "豪沃水罐消防车",
          gl: "***",
          zl: "****",
          status: 1
        },
        {
          xfc: "德国曼压沫水罐消防车",
          gl: "***",
          zl: "****",
          status: 2
        },
        {
          xfc: "45米叠高平台消防车",
          gl: "***",
          zl: "****",
          status: 3
        },
        {
          xfc: "32米高喷消防车",
          gl: "***",
          zl: "****",
          status: 2
        },
        {
          xfc: "德国曼压沫水罐消防车",
          gl: "***",
          zl: "****",
          status: 1
        },
        {
          xfc: "豪沃水罐消防车",
          gl: "***",
          zl: "****",
          status: 2
        },
        {
          xfc: "抢险救援消防车",
          gl: "***",
          zl: "****",
          status: 3
        }
      ],
      form: { region: "" },
      options: [{ value: "选项1", label: "无数据", sourceId: "", id: "" }],
      options_z: [{ value: "选项1", label: "无数据", sourceId: "", id: "" }],
      formType: { region: "" },
      formOrg: { id: "", region: "", name: "", sourceId: "" },
      formOrg_z: { id: "", region: "", name: "", sourceId: "" },
      formLabelWidth: "120px",
      birthday_data: [
        { text: "祝陈飞同志生日快乐" },
        { text: "祝飞儿同志生日快乐" }
      ],
      value1: ""
    };
  },
  components: {
    //组件
    vueSeamlessScroll,
    Weather,
    Notice
  },
  methods: {

    //选择消防站时存储数据
    getListData1(val) {
      let obj = {};
      obj = this.options_z.find(item => {
        return item.id === val;
      });
      this.formOrg_z = obj;
      console.log(this.formOrg_z);
    },

    //用户权限处理
    setUserPermissions(obj) {
      if (obj.isStation == true) {
        debugger;
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
      console.log("formOrg_z", this.formOrg); //大队json
      if (this.formOrg.id != "" && this.formOrg_z.id == "") {
        this.dialogFormVisibleOrg = false; //查看大队大屏
        this.$message({
          message: "查看大队大屏",
          type: "success"
        });
      } else if (this.formOrg.id != "" && this.formOrg_z.id != "") {
        this.$message({
          message: "查看大队下面消防站大屏",
          type: "success"
        });
        this.dialogFormVisibleOrg = false; //查看大队下面消防站大屏
      } else if (this.formOrg_z.id != "" && this.formOrg.id == "") {
        this.$message({
          message: "只查看消防站大屏",
          type: "success"
        });
        this.dialogFormVisibleOrg = false; //查看消防站大屏
      } else {
        this.$message({
          message: "请选择部门",
          type: "warning"
        });
      }
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
          console.log("获取大队下的消防站", res);
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
        debugger;
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
  mounted() {
    storage.getUserPermissionsDate().then(res => {
      console.log("obj = ", res);
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