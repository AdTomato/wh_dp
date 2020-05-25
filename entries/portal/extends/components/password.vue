<template>
    <div>
        <el-dialog title="确认密码" :visible.sync="visible" :before-close="modalClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
          <el-form :model="form" ref="passwordForm" :rules="rules">
            <el-form-item label="密码" :label-width="formLabelWidth" prop="inputPass">
              <el-input v-model="form.inputPass" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmUpdate('passwordForm')">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from "axios";
    import ElementUI from "element-ui";
    import "element-ui/lib/theme-chalk/index.css";
    import request from '../api/request';
    export default {
        name: "password",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            passFlag: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                formLabelWidth: "120px",
                form: {},
                rules: {
                    inputPass: [
                        { required: true, message: "密码不能为空", trigger: "blur" }
                    ]
                },
            }
        },
        mounted(){
            
        },
        methods:{
            confirmUpdate(formName){
                console.log(this.form.inputPass);
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        //如果通过验证 to do...
                        if(!this.passFlag){
                            this.$emit('confirmUpdateNotice', this.form.inputPass);
                        }
                    } else {
                        return false;
                    }
                })
            },
            modalClose() {
                this.$emit('update:visible', false); // 直接修改父组件的属性
            },
        },

    }
</script>