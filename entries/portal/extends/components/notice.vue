<template>
    <div>
        <div class="screen-item">
          <h3 class="screen-item-title">通知公告</h3>
          <div class="warn-info">
            <img class="notice-icon" src="../assets/images/notice_icon.png" alt />
            <span>公告：</span>
            <div class="warn-txt warn-img" v-if="!noticeData">
                <img src="../assets/images/timg.gif" alt />
            </div>
            <div class="warn-txt" v-else>
                <vue-seamless-scroll :data="noticeData" class="seamless-notice" :class-option="noticeClassOption">
                    <ul class="item">
                        <li v-for="item in noticeData">
                            <p>{{item.title}}</p>
                        </li>
                    </ul>
                </vue-seamless-scroll>
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
        name: "notice",
        props: {
            noticeData: {
                type: Array
            }
        },
        data() {
            return {
                listData: [],
                noticeFlag: true
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
                };
            }
        },
        methods:{
            async getNoticeInfo(deptId){
                // 后期userId传入
                let par = {
                    deptId: deptId
                }
                const res = await request.getNotice(par);
                let noticeRes = res.data;
                if(noticeRes.notice){
                    this.noticeFlag = false;
                    let arr = [];
                    for (let i = 0; i < noticeRes.notice.length; i++) {
                        let noticeObj = {};
                        noticeObj.title = noticeRes.notice[i].title;
                        arr.push(noticeObj);
                    }

                    this.listData = arr;
                }
                console.log(this.listData);
            }
            
                   
        },
        mounted(){
            // this.getNoticeInfo();
        }
    }
</script>