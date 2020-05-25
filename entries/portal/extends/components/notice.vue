<template>
    <div>
        <div class="screen-item">
          <h3 class="screen-item-title">通知公告</h3>
          <div class="warn-info">
            <img class="notice-icon" src="../assets/images/notice_icon.png" alt />
            <span>公告：</span>
            <div class="warn-txt">
                <p v-if="listData.length == 0">暂时没有数据！</p>
                <div v-else>
                    <vue-seamless-scroll :data="listData" class="seamless-notice" :class-option="noticeClassOption">
                        <ul class="item">
                            <li v-for="(item, index) in listData" @click="noticeClick(item , index)" :key="index">
                                <p>{{item.title}}</p>
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
    import ElementUI from "element-ui";
    import "element-ui/lib/theme-chalk/index.css";
    import vueSeamlessScroll from "vue-seamless-scroll";
    export default {
        name: "notice",
        props: {
            
        },
        data() {
            return {
                listData: [],
                noticeUrl: '',
            }
        },
        components: {
            //组件
            vueSeamlessScroll,
        },
        computed: {
            noticeClassOption() {
                return {
                    step: 0.2, // 数值越大速度滚动越快
                    limitMoveNum: 5
                };
            }
        },
        methods:{
            async getNoticeInfo(id){
                // 后期userId传入
                let par = {
                    stationId: id
                }
                const res = await request.getNotice(par);
                this.listData = res.data;
                console.log(this.listData);
            },
            async getBrigadeNoticeInfo(id){
                // 后期userId传入
                let par = {
                    brigadeId: id
                }
                const res = await request.getNoticeBrigade(par);
                this.listData = res.data;
                console.log(this.listData);
            },
            noticeClick(item, index){
                console.log(item.url);
                this.noticeUrl = item.url;
                if(item.url){
                    window.location.href = item.url;
                }
            },
        },
        mounted(){
            
        }
    }
</script>

<style lang="less" scoped>
.notice-dialog .el-dialog{
    height: 900px;
}
</style>