<template>
    <div>
        <div class="screen-item">
          <h3 class="screen-item-title">通知公告</h3>
          <div class="warn-info">
            <img class="notice-icon" src="../assets/images/notice_icon.png" alt />
            <span>公告：</span>
            <div class="warn-txt">
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
                listData: [{
                   'title': '关于建设平安武汉',
                   'date': '2017-12-16'
                 }, {
                    'title': '支队持续推进暑期消防安全宣教活动',
                    'date': '2017-12-16'
                 }, {
                     'title': 'XX大队召开卫健系统消防安全培训会',
                     'date': '2017-12-16'
                 }, {
                     'title': 'XX大队到辖区沿街商铺开展消防宣传活动',
                     'date': '2017-12-16'
                 }, {
                     'title': '支队持续推进暑期消防安全宣教活动',
                     'date': '2017-12-16'
                 }, {
                     'title': 'XX大队召开卫健系统消防安全培训会',
                     'date': '2017-12-16'
                 }, {
                     'title': '关于建设平安武汉',
                     'date': '2017-12-16'
                 }, {
                     'title': '支队持续推进暑期消防安全宣教活动',
                     'date': '2017-12-16'
                 }, {
                     'title': 'XX大队到辖区沿街商铺开展消防宣传活动',
                     'date': '2017-12-16'
                }],
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
            getNoticeInfo(){
                // 后期userId传入
                let par = {
                    userId: '2c90a43e6efe8b04016effb119271c6f'
                }
                request.getNotice(par).then(res => {
                    console.log(res);
                })
            }
            
                   
        },
        mounted(){
            // this.getNoticeInfo();
        }
    }
</script>