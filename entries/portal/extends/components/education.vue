<template>
    <div>
        <div class="two-branch">
            <!-- 教育训练计划 -->
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
                  <span class="branch-project">{{eduMorningExercises}}</span>
                </li>
                <li>
                  <span class="branch-time">上午</span>
                  <span class="branch-project">{{eduAmInfo}}</span>
                </li>
                <li>
                  <span class="branch-time">下午</span>
                  <span class="branch-project">{{eduPmInfo}}</span>
                </li>
                <li>
                  <span class="branch-time">晚上</span>
                  <span class="branch-project">{{eduNightInfo}}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 龙虎榜 -->
          <div class="branch-item">
            <h3 class="screen-item-title">龙虎榜</h3>
            <div class="branch-cont">
              <div class="branch-cont-title branch-bang-title">
                <span class="bang-subject">训练科目</span>
                <span class="bang-name">姓名</span>
                <span class="bang-score">成绩</span>
              </div>
              <div v-if="trainData.length == 0" class="bangnull">
                  <p>暂时没有人上榜！</p>
              </div>
              <div v-else>
                  <vue-seamless-scroll :data="trainData" class="seamless-bang" :class-option="eduClassOption">
                    <ul class="bang-ul">
                        <li v-for="(item, index) in trainData" :key="index">
                        <span class="bang-subject">{{item.trainSubject}}</span>
                        <span class="bang-name">{{item.trainName}}</span>
                        <span class="bang-score">{{item.result}}</span>
                        </li>
                    </ul>
                </vue-seamless-scroll>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import request from "../api/request";
    import vueSeamlessScroll from "vue-seamless-scroll";
    export default {
        name: "education",
        data() {
            return {
                eduMorningExercises: '',
                eduAmInfo: '',
                eduPmInfo: '',
                eduNightInfo: '',
                trainData: []
            }
        },
        components: {
            //组件
            vueSeamlessScroll,
        },
        computed: {
            eduClassOption() {
                return {
                    step: 0.2, // 数值越大速度滚动越快
                    limitMoveNum: 8
                };
            }
        },
        methods:{
            async getEducationData(stationId){
                let par = {
                    stationId: stationId
                }
                let eduRes = await request.getEducationInfo(par);
                let lhbRes = await request.getTrainInfo(par);
                if(eduRes.data){
                    this.eduMorningExercises = eduRes.data.morningExercises;
                    this.eduAmInfo = eduRes.data.morning;
                    this.eduPmInfo = eduRes.data.afternoon;
                    this.eduNightInfo = eduRes.data.night;
                }
                if(lhbRes.data.length !=0 ){
                  this.trainData = lhbRes.data[0].detailInfos;
                }
                console.log(lhbRes.data);
            }
                   
        },
        mounted(){
        }
    }
</script>