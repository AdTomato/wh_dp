<template>
  <div>
    <!-- <el-button type="primary" class="draw-btn" @click="prev">返回</el-button> -->
    <div class="btn-div">
      <el-button type="primary" icon="el-icon-arrow-left" class="draw-btn-back" @click="prev">返回</el-button>
      <el-button type="success" class="draw-btn" @click="drawResult" >抽签</el-button>
    </div>
    
    <ul class="table-list">
        <!-- <li v-for="(groupItem, index) in groupArr">
          <p>{{groupItem}}</p>
          <dl v-for="(personItem, index) in list">
            <dd  :class="itemIndex==index? 'addclass' : ''">{{personItem}}</dd>
          </dl>
          <dl v-for="(personItem, index) in tableData[groupItem]">
            <dd  :class="itemIndex==index? 'addclass' : ''">{{personItem}}</dd>
          </dl>
        </li> -->
          <li v-for="(personItem, index) in list">
            <p  :class="itemIndex==index? 'addclass' : 'normol'">{{personItem}}</p>
          </li>
        
    </ul>
    <!-- 弹框 -->
    <el-dialog
      :title="name"
      :visible.sync="dialogVisible"
      width="40%"
      center>
        <div class="drawRes-main">
          <dl v-for="(item, index) in obj">
            <dt>{{index}}</dt>
            <dd v-for="(items, indexs) in item">{{items}}</dd>
          </dl>
        </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="close">取 消</el-button> -->
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import axios from 'axios';
  Vue.use(ElementUI,axios);
  export default{
    name: 'drawTable',
    data(){
      return{
        url: "http://121.41.27.194/api",
        tableData: '',
        groupArr: [],
        list: [],
        position: [],
        brigadeId:'',
        itemIndex: null,
        dialogVisible: false,
        timer : null,
        addclass:'addclass',
        name:'',
        dName:'',
        obj:{}
      }
    },
    methods: {
    prev(){
            this.$router.go(-1);
      },
	  close(){
      var json = {};
      json.drawResult = this.obj;
      json.projectName = this.name;
      json.brigadeName = this.dName;
        axios.post(this.url + '/controller/draw/saveDrawResult',json)
          .then((response) => {
              if(response.errcode==0){
                debugger;
                console.log("调用成功",response);
              }
          })


        this.dialogVisible = false;
        this.obj = {};
      },
      drawResult(){
        this.obj = {};
        // 抽签开始
        // 当抽签成功时候，打开对话框
        var that =this
        //that.dialogVisible = true;
        
        clearInterval(that.timer);
				that.timer = setInterval(function() {
          var i = Math.floor(Math.random() * that.list.length);
          that.itemIndex = i;
          var userName = that.list[i];  // 人员姓名
          var position = that.position[i];  // 人员职务
          var name = that.name;  // 项目名称
          var dName = that.dName;  // 大队名称
          var flag = "";
          if(name == "新条令纲要知识竞赛") {
            // 新条令纲要知识竞赛
            if(dName == "机关代表队") {
              flag = position;
              if(flag == "干部") {
                // 干部需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 2) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "通勤消防员") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 2) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "文员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 2) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("干部")) {
                allPeople += that.obj["干部"].length;
              }
              if(that.obj.hasOwnProperty("通勤消防员")) {
                allPeople += that.obj["通勤消防员"].length;
              }
              if(that.obj.hasOwnProperty("文员")) {
                allPeople += that.obj["文员"].length;
              }
              if(allPeople == 6) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }
            } else if(dName == "水上大队") {
              flag = position;
              if(flag == "大队干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 3) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "文员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 3) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("大队干部")) {
                allPeople += that.obj["大队干部"].length;
              }
              if(that.obj.hasOwnProperty("文员")) {
                allPeople += that.obj["文员"].length;
              }
              if(allPeople == 6) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }
            } else if(dName == "特勤大队") {
              flag = position;
              if(flag == "大队干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "队站干部") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 4) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("大队干部")) {
                allPeople += that.obj["大队干部"].length;
              }
              if(that.obj.hasOwnProperty("消防员")) {
                allPeople += that.obj["消防员"].length;
              }
              if(that.obj.hasOwnProperty("队站干部")) {
                allPeople += that.obj["队站干部"].length;
              }
              if(allPeople == 6) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }
            } else {
              flag = position;
              if(flag == "大队干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "队站干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "文员") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "消防员") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 2) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "专职消防员") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("大队干部")) {
                allPeople += that.obj["大队干部"].length;
              }
              if(that.obj.hasOwnProperty("队站干部")) {
                allPeople += that.obj["队站干部"].length;
              }
              if(that.obj.hasOwnProperty("文员")) {
                allPeople += that.obj["文员"].length;
              }
              if(that.obj.hasOwnProperty("消防员")) {
                allPeople += that.obj["消防员"].length;
              }
              if(that.obj.hasOwnProperty("专职消防员")) {
                allPeople += that.obj["专职消防员"].length;
              }
              if(allPeople == 6) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }
            }
          } else if (name == "队列会操") {
            // 队列会操
            if(dName == "机关代表队") {
              flag = position;
              if(flag == "指挥员") {
                // 干部需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 5) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "通勤消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 5) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("指挥员")) {
                allPeople += that.obj["指挥员"].length;
              }
              if(that.obj.hasOwnProperty("干部")) {
                allPeople += that.obj["干部"].length;
              }
              if(that.obj.hasOwnProperty("通勤消防员")) {
                allPeople += that.obj["通勤消防员"].length;
              }
              if(allPeople == 11) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }

            } else if(dName == "特勤大队") {
              flag = position;
              if(flag == "指挥员") {
                // 干部需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "大队干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "消防站主官") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "消防站副职") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 7) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("指挥员")) {
                allPeople += that.obj["指挥员"].length;
              }
              if(that.obj.hasOwnProperty("大队干部")) {
                allPeople += that.obj["大队干部"].length;
              }
              if(that.obj.hasOwnProperty("消防站主官")) {
                allPeople += that.obj["消防站主官"].length;
              }
              if(that.obj.hasOwnProperty("消防站主官")) {
                allPeople += that.obj["消防站主官"].length;
              }
              if(that.obj.hasOwnProperty("消防站副职")) {
                allPeople += that.obj["消防员"].length;
              }
              if(allPeople == 11) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }
            } else {
              flag = position;
              if(flag == "指挥员") {
                // 干部需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "大队干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "队站干部") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 2) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 4) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "专职消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 3) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("指挥员")) {
                allPeople += that.obj["指挥员"].length;
              }
              if(that.obj.hasOwnProperty("大队干部")) {
                allPeople += that.obj["大队干部"].length;
              }
              if(that.obj.hasOwnProperty("消防站主官")) {
                allPeople += that.obj["消防站主官"].length;
              }
              if(that.obj.hasOwnProperty("消防站副职")) {
                allPeople += that.obj["消防员"].length;
              }
              if(that.obj.hasOwnProperty("消防员")) {
                allPeople += that.obj["消防员"].length;
              }
              if(that.obj.hasOwnProperty("专职消防员")) {
                allPeople += that.obj["专职消防员"].length;
              }
              if(allPeople == 11) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }
            }
          } else {
            // 叠被子比赛
            if(dName == "机关代表队") {
              flag = position;
              if(flag == "干部") {
                // 干部需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 2) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "通勤消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 3) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("干部")) {
                allPeople += that.obj["干部"].length;
              }
              if(that.obj.hasOwnProperty("通勤消防员")) {
                allPeople += that.obj["通勤消防员"].length;
              }
              if(allPeople == 5) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }

            } else if(dName == "特勤大队") {
              flag = position;
              if(flag == "大队干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "队站干部") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 3) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("大队干部")) {
                allPeople += that.obj["大队干部"].length;
              }
              if(that.obj.hasOwnProperty("队站干部")) {
                allPeople += that.obj["队站干部"].length;
              }
              if(that.obj.hasOwnProperty("消防员")) {
                allPeople += that.obj["消防员"].length;
              }
              if(allPeople == 5) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }

            } else if(dName == "水上大队") {
              flag = position;
              if(flag == "大队干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 2) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("大队干部")) {
                allPeople += that.obj["大队干部"].length;
              }
              if(allPeople == 2) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }

            } else {
              flag = position;
              if(flag == "大队干部") {
                // 消防员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "队站干部") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 2) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              if(flag == "专职消防员") {
                // 文员需要获取2名
                if(that.obj.hasOwnProperty(flag)) {
                  // 存在
                  var people = that.obj[flag];
                  if(people.length == 1) {
                    // 已经取瞒
                    return;
                  }
                  if(people.includes(userName)) {
                    // 已经存储过了
                    return;
                  }
                  people.push(userName);
                } else {
                  var people = new Array();
                  people.push(userName);
                  that.obj[flag] = people;
                }
              }
              var allPeople = 0;
              if(that.obj.hasOwnProperty("大队干部")) {
                allPeople += that.obj["大队干部"].length;
              }
              if(that.obj.hasOwnProperty("队站干部")) {
                allPeople += that.obj["队站干部"].length;
              }
              if(that.obj.hasOwnProperty("消防员")) {
                allPeople += that.obj["消防员"].length;
              }
              if(that.obj.hasOwnProperty("专职消防员")) {
                allPeople += that.obj["专职消防员"].length;
              }
              if(allPeople == 5) {
                // 抽签结束
                clearInterval(that.timer);
                that.dialogVisible = true;
              }
            }
          }
        }, 20)
        

      },
      /** 
         * 获取指定的URL参数值 
         * URL:http://www.quwan.com/index?name=tyler 
         * 参数：paramName URL参数 
         * 调用方法:getParam("name") 
         * 返回值:tyler 
         */ 
      getParam(paramName) { 
        var paramValue = ""; var isFound = !1; 
          if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) { 
              var arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&"), i = 0; 
              while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++ 
          } 
          return paramValue == "" && (paramValue = null), paramValue
      },
      getData(){
             axios.get(this.url + '/controller/draw/getAllBrigadePersonal?brigadeId='+this.brigadeId)
            .then((response) => {
                if(response.errcode==0){
                    if(response.data!=null){
                        this.tableData = response.data;
                        this.groupArr = Object.keys(this.tableData);
                         var arr = []
                         var key = 0;
                        for (var j = 0; j < this.groupArr.length; j++) {
                          for(var i= 0; i < this.tableData[this.groupArr[j]].length; i++){
                            //arr.push(this.tableData[this.groupArr[j]][i]+"("+this.groupArr[j]+")");
                            arr.push(this.tableData[this.groupArr[j]][i]);
                            this.position.push(this.groupArr[j]);
                          }
                        }
                        this.list = arr
                    }
                }
            })
        },
        changeTab(index){
            this.clicked = index;
        }
    },
    mounted:function(){
     this.brigadeId = decodeURIComponent(this.getParam("brigadeId")) ;
     this.name = window.localStorage.getItem("name");
     this.dName = window.localStorage.getItem("dName");

     this.getData();
     setTimeout(function(){
      clearInterval(this.timer)
      this.dialogVisible = true;
  　　},10000);
     
    }
  }
</script>

<style >
    .draw-btn{
      width: 160px;
      margin: 20px 20px 20px 21px;
    }
    .draw-btn-back{
      width: 160px;
      margin: 20px;
    }
    .table-list{
        width: 100%;
        padding: 0 30px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .table-list li{
        width: 12%;
    }
    /* .table-list li p{
        width: 100%;
        height: 50px;
        border: 1px solid #dcdcdc;
        border-right: none;
        border-bottom: 1px solid #dcdcdc;
        line-height: 50px;
        text-align: center;
        color: #000;
        background: #fff;
        font-size: 16px;
    } */
    .normol{
        width: 100%;
        height: 50px;
        border: 1px solid #dcdcdc;
        border-right: none;
        /* border-bottom: 1px solid #dcdcdc; */
        line-height: 50px;
        text-align: center;
        color: #000;
        background: #fff;
        font-size: 16px;
    }
    .table-list li:last-child p{
      border-right: 1px solid #dcdcdc;
    }
    .table-list li dl dd{
        width: 100%;
        height: 44px;
        border: 1px solid #dcdcdc;
        border-top: none;
        /* border-bottom: 1px solid #dcdcdc; */
        line-height: 44px;
        text-align: center;
        color: #333;
        font-size: 16px;
        
    }

    .addclass {
				background: #f00;
				font-size: 20px;
        line-height: 50px;
        text-align: center;
				color: #00f;
			}
    .el-dialog__body{
      height: 400px;
      overflow-y: auto;
    }
    .drawRes-main{
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .drawRes-main dl{
      width: 30%;
      margin-bottom: 20px;
      text-align: center;
    }
    .drawRes-main dl dt{
      font-weight: bold;
      font-size: 20px;
      line-height: 36px;
      color: #333;
    }
    .drawRes-main dl dd{
      font-size: 16px;
      color: #666;
      line-height: 24px;
    }
    .btn-div{
      width: 100%;
    }
</style>
