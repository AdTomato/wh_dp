<template>
  <div>
      <!-- <el-button type="primary" class="draw-btn" @click="prev">返回</el-button> -->
      <el-button type="primary" icon="el-icon-arrow-left" class="draw-btn" @click="prev">返回</el-button>
      <ul class="group-list">
          <li v-for="(item, index) in sites" @click="personDisplay(item, index)"><a href="javascript:;">{{item.name}}</a></li>
      </ul>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import axios from 'axios';
  Vue.use(ElementUI,axios);
  Vue.use(axios);
  export default{
    name: 'drawItem',
    data(){
      return{
          url: "http://121.41.27.194/api",
          lotteryId:'',
          sites: '',
          dName:''
      }
    },
    methods: {
        prev(){
            this.$router.go(-1);
        },
        personDisplay(item, index){
          let routeUrl = this.$router.resolve({
              path: '/form/detail/draw-table?brigadeId='+item.id
          });
          window.localStorage.setItem('dName',item.name);
          window.location.href = routeUrl.href;
        },
        getData(){
             axios.get(this.url + '/controller/draw/getBrigadeNameAndId?lotteryId='+this.lotteryId)
            .then((response) => {
                if(response.errcode==0){
                    if(response.data!=null){
                        var arr = [];
                        for(var i=0;i<response.data.length;i++){
                            var obj = new Object();
                            obj.name = response.data[i].brigade_name;
                            obj.id = response.data[i].id;
                            arr.push(obj);
                        }
                        this.sites = arr;
                    }
                }
            })
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
          } 
        },
    mounted:function(){
        this.lotteryId = this.getParam("lotteryId") ;
        this.getData();
    }
  }
</script>

<style scoped>
    .group-list{
        width: 100%;
        padding: 30px 30px 0px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
    }
    .draw-btn{
      width: 160px;
      margin: 30px;
    }
    .group-list li{
        width: 20%;
        padding: 0 10px;
        margin-bottom: 20px;
    }
    .group-list li a{
        display: block;
        width: 100%;
        height: 50px;
        border: 1px solid #dcdcdc;
        line-height: 50px;
        text-align: center;
        color: #333;
        font-size: 16px;
    }
    .group-list li a:hover{
      color: #2970ff;
    }
</style>
