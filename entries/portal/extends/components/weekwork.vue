<template>
    <div>
        <div class="screen-item">
            <h3 class="screen-item-title">本周重点工作</h3>
            <p v-if="worksData.length ==0 ">暂时无数据！</p>
            <div v-else>
                <vue-seamless-scroll :data="worksData" class="seamless-work" :class-option="workClassOption">
                    <ul class="important-work">
                        <li v-for="(item, index) in worksData" :key="index" @click="updateWorkStatus(item)">
                            <p>{{item.workContent}}</p>
                            <span>{{item.status}}</span>
                        </li>
                    </ul>
                </vue-seamless-scroll>
            </div>
        </div>
        <el-dialog title="工作状态" :visible.sync="visibleStatus">
          <el-form :model="form">
            <el-form-item label="状态类型" :label-width="formLabelWidth">
              <el-select v-model="valStatus" placeholder="请选择工作状态" @change="getStatus">
                <el-option label="待开始" value="待开始"></el-option>
                <el-option label="进行中" value="进行中"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="visibleStatus = false">取 消</el-button>
            <el-button type="primary" @click="confirmStatus">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 密码确认 -->
        <Password :visible.sync="visiblePassword"></Password>
    </div>
</template>

<script>
    import axios from "axios";
    import ElementUI from "element-ui";
    import "element-ui/lib/theme-chalk/index.css";
    import request from '../api/request';
    import Password from './password.vue'
    import vueSeamlessScroll from "vue-seamless-scroll";
    export default {
        name: "weekwork",
        props: {
        },
        data() {
            return {
                visibleStatus: false,
                visiblePassword: false,
                formLabelWidth: "120px",
                workStatus: '',
                currentId: '',
                form: {},
                workBriageId: '',
                valStatus: '',
                worksData: []
            }
        },
        components: {
            //组件
            vueSeamlessScroll,
            Password
        },
        computed: {
            workClassOption() {
                return {
                    step: 0.2, // 数值越大速度滚动越快
                };
            }
        },
        mounted(){
            
        },
        methods:{
            // 获取本周重点工作
            getWorks(workId){
                let par = {
                    brigadeId: workId
                }
                request.getWorkData(par).then(res => {
                    res.data.forEach(item => {
                        item.weekFocusList.forEach(ele => {
                            this.worksData.push(ele);
                        })
                    })
                    this.workBriageId = workId;
                })
            },
            // 更新本周工作重点
            updateWorkStatus(item){
                this.visibleStatus = true;
                this.currentId = item.id;
                console.log(this.workBriageId);
                this.valStatus = item.status;
            },
            confirmStatus(){
                this.visibleStatus = false;
                this.visiblePassword = true;
            },
            confirmUpdate(){
                const urlPath = "http://121.41.27.194:8080/api";
                axios.put(urlPath+`/controller/weekWork/updateWorksStatus?id=${this.currentId}&status=${this.workStatus}`)
                .then(res => {
                    if (res.errcode == 0) {
                        this.$message({
                            message: "状态更新成功",
                            type: "success"
                        });
                        this.visibleStatus = false;
                        this.worksData = [];
                        this.getWorks(this.workBriageId);
                    }
                })
            },
            getStatus(value){
                console.log(value);
                this.workStatus = value;
                this.valStatus = value;
            }
        },

    }
</script>