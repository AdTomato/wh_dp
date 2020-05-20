<template>
  <div>
      <ul class="panel-list">
          <li v-for="(item, index) in panelData" @click="ToDraw(item,index)"><a href="javascript:;">{{item.name}}</a></li>
      </ul>
  </div>
</template>

<script>
  import Vue from 'vue';
  import axios from 'axios'
  Vue.use(axios);
  export default{
    name: 'draw',
    data(){
      return{
        url: "http://121.41.27.194/api",
        panelData: ''
      }
    },
    methods: {
        ToDraw(item,index){
            let routeUrl = this.$router.resolve({
                path: '/form/detail/draw-item?lotteryId='+item.id
            });
            window.localStorage.setItem('name',item.name);
            window.location.href = routeUrl.href;
        },
        getData(){
             axios.get(this.url + '/controller/draw/getLotteryNameAndId')
            .then((response) => {
                if(response.errcode==0){
                    if(response.data!=null){
                        var arr = [];
                        for(var i=0;i<response.data.length;i++){
                            var obj = new Object();
                            obj.name = response.data[i].name;
                            obj.id = response.data[i].id;
                            arr.push(obj);
                        }
                        this.panelData = arr;
                    }
                }
            })
        }
    },
    mounted() {
    this.getData();
    }
  }
</script>

<style scoped>
    .panel-list{
        width: 100%;
        padding-top: 30px;
        padding-left: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .panel-list li{
        width: 25%;
    }
    .panel-list li a{
        display: block;
        width: 100%;
        height: 50px;
        border: 1px solid #dcdcdc;
        line-height: 50px;
        text-align: center;
        color: #333;
        font-size: 16px;
    }
    .panel-list li a:hover{
        color: #2970ff;
    }
</style>
