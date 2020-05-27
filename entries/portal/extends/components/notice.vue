<template>
    <div>
        <div class="screen-item">
          <h3 class="screen-item-title">通知公告</h3>
          <div class="warn-info">
            <img class="notice-icon" src="../assets/images/notice_icon.png" alt />
            <span>公告：</span>
            <div class="warn-txt">
                <p v-if="listData.length == 0">暂时没有数据！</p>
                <div v-else @click="noticeClick($event)">
                    <vue-seamless-scroll :data="listData" class="seamless-notice" :class-option="noticeClassOption">
                        <ul class="item">
                            <li style="cursor:pointer;" v-for="(item, index) in listData" :key="index">
                                <p :data-url="item.url">{{item.title}}</p>
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
import replace$ from 'dingtalk-jsapi/api/biz/navigation/replace';
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
                    limitMoveNum: 5,
                    openTouch: false
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
                if(res.data){
                    this.listData = res.data;
                }
                console.log(this.listData);
            },
            async getBrigadeNoticeInfo(id){
                // 后期userId传入
                let par = {
                    brigadeId: id
                }
                const res = await request.getNoticeBrigade(par);
                if(res.data){
                    this.listData = res.data;
                }
                console.log(this.listData);
            },
            noticeClick(event){
                console.log(event.target.dataset.url);
                if(event.target.dataset.url){
                    this.noticeUrl = event.target.dataset.url;
                    var itemUrl = this.noticeUrl.slice(20);
                    // window.location.href = item.url;
                    let routeUrl = this.$router.resolve({
                        path: itemUrl
                    });
                    window.open(routeUrl.href, '_blank');
                }
            },
        },
        mounted(){
            
        }
    }
</script>
