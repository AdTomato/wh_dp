<template>
    <div>
        <div class="screen-item">
          <h3 class="screen-item-title">通知公告</h3>
          <div class="warn-info">
            <img class="notice-icon" src="../assets/images/notice_icon.png" alt />
            <span>公告：</span>
            <div class="warn-txt" v-if="noticeFlag">
                <p>数据正在加载中....</p>
            </div>
            <div class="warn-txt" v-else>
                <vue-seamless-scroll :data="listData" class="seamless-notice" :class-option="noticeClassOption">
                    <ul class="item">
                        <li v-for="item in listData">
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
            async getNoticeInfo(){
                // 后期userId传入
                let par = {
                    deptId: '145600593'
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
            this.getNoticeInfo();
        }
    }
</script>