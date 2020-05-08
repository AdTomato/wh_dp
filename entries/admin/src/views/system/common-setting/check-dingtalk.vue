<template>
  <div class="check-dingtalk">
    <div class="guide">
      <div class="check-dingtalk__header">
        <span>钉钉集成</span>
        <span class="header__tips">组织机构同步使用，需在钉钉中自建应用，开通通讯录权限，并获取应用消息填写在下方</span>
        <slot name="settingTips"/>
      </div>
      <div class="check-dingtalk__form">
        <a-row class="check-dingtalk__item">
          <a-col :span="layout.left" class="check-dingtalk__left">
            <span class="required">*</span>
            <span>AppKey
              <a-tooltip
                :title="'tips：创建的应用的唯一标识，获取地址：钉钉后台，工作台-自建应用--应用设置-基础信息，\
                        可获取Appkey、APPSecret和AgentId'"
              >
                <a-icon type="question-circle-o"/>
              </a-tooltip>:
            </span>
          </a-col>
          <a-col :span="layout.right" class="check-dingtalk__right">
            <span v-if="edit" class="check-dingtalk__right--edit">{{ params.appKey }}</span>
            <a-input v-else v-model="params.appKey"/>
          </a-col>
        </a-row>

        <a-row class="check-dingtalk__item">
          <a-col :span="layout.left" class="check-dingtalk__left">
            <span class="required">*</span>
            <span>AppSecret:</span>
          </a-col>
          <a-col :span="layout.right" class="check-dingtalk__right">
            <span v-if="edit" class="check-dingtalk__right--edit">
              <password-span :value="params.appSecret" :fn="showSecret"/>
            </span>
            <a-input v-else v-model="params.appSecret"/>
          </a-col>
        </a-row>

        <a-row class="check-dingtalk__item">
          <a-col :span="layout.left" class="check-dingtalk__left">
            <span class="required">*</span>
            <span>AgentId:</span>
          </a-col>
          <a-col :span="layout.right" class="check-dingtalk__right">
            <span v-if="edit" class="check-dingtalk__right--edit">{{ params.agentId }}</span>
            <a-input v-else v-model="params.agentId"/>
          </a-col>
        </a-row>

        <a-row class="check-dingtalk__item">
          <a-col :span="layout.left" class="check-dingtalk__left">
            <span class="required">*</span>
            <span>增量回调地址:</span>
          </a-col>
          <a-col :span="layout.right" class="check-dingtalk__right">
            <span class="check-dingtalk__right--edit">{{ params.synRedirectUri }}</span>
          </a-col>
        </a-row>

        <!-- <a-row class="check-dingtalk__item">
          <a-col :span="layout.left" class="check-dingtalk__left">
            <span class="required">*</span>
            <span>pc端首页地址:</span>
          </a-col>
          <a-col :span="layout.right" class="check-dingtalk__right">
            <span v-if="edit" class="check-dingtalk__right--edit">{{ params.pcServerUrl }}</span>
            <a-input
              v-else
              v-model="params.pcServerUrl"
              :placeholder="'http://SERVER:PORT/'"
            />
          </a-col>
        </a-row> -->

        <!-- <a-row class="check-dingtalk__item">
          <a-col :span="layout.left" class="check-dingtalk__left">
            <span class="required">*</span>
            <span>移动应用首页地址:</span>
          </a-col>
          <a-col :span="layout.right" class="check-dingtalk__right">
            <span v-if="edit" class="check-dingtalk__right--edit">{{ params.mobileServerUrl }}</span>
            <a-input
              v-else
              v-model="params.mobileServerUrl"
              :placeholder="'http://SERVER:PORT/'"
            />
          </a-col>
        </a-row> -->
      </div>
    </div>
    <a-row class="check-dingtalk__item" v-if="isSuperAdmin">
      <a-col :span="layout.left" class="check-dingtalk__left"></a-col>
      <a-col :span="layout.right" class="check-dingtalk__right">
        <div class="btn-group">
          <a-button
            type="primary"
            @click="createdDingtalk"
            class="btn-group__btn"
          >{{ btnText[0] }}</a-button>
          <a-button @click="connect">{{ btnText[1] }}</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace, Mutation } from 'vuex-class';
import systemApi from '@/apis/system/system-manager.api';
import PasswordSpan from '@/components/global/password-span.vue';
import BtnGroup from './btn-group.vue';

import env from '@/env.ts';

const UserModule = namespace('System/User');

@Component({
  name: 'check-dingtalk',
  components: {
    BtnGroup,
    PasswordSpan
  }
})
export default class CheckDingtalk extends Vue {
  @UserModule.State('loginedUserInfo') loginedUserInfo!:any;

  layout = {
    left: 5,
    right: 10
  }

  btnText = [
    '保存',
    '连接测试'
  ]

  corpId: string = '';

  edit: boolean = false;

  params = {
    appKey: '',
    appSecret: '',
    agentId: '', // 消息推送ID
    pcServerUrl: env.portalHost, // pc端首页地址
    mobileServerUrl: '', // 移动端应用首页地址
    synRedirectUri: env.apiHost, // 增量同步回调地址
  }

  get isSuperAdmin() {
    return this.loginedUserInfo.username === 'admin' || this.loginedUserInfo.username === 'Admin';
  }

  created() {
    this.getDingtalk();
  }

  getDingtalk() {
    const vm: any = this;
    systemApi.getDingtalkParams().then((res: any) => {
      // debugger;
      if (res.data) {
        vm.params = res.data;
        vm.params.pcServerUrl = env.portalHost;
        vm.params.synRedirectUri = env.apiHost;
        vm.edit = true;
        vm.btnText[0] = '编辑';
      }
    });
  }

  createdDingtalk() {
    const vm: any = this;
    if (vm.edit) {
      vm.edit = false;
      vm.btnText[0] = '保存';
      return;
    }
    this.params.mobileServerUrl = `${this.params.pcServerUrl}/mobile`;
    systemApi.createdDingtalkParams(this.params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$message.success('保存成功!', 2);
        vm.edit = true;
        vm.btnText[0] = '编辑';
      } else {
        vm.$message.error(res.errmsg, 2);
      }
    });
  }

  // 连接测试
  connect() {
    const vm: any = this;
    vm.params.mobileServerUrl = `${vm.params.pcServerUrl}/mobile`;
    systemApi.checkDingtalkParams(vm.params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$message.success('连接成功！', 2);
      } else if (res.errcode === 100004) { // 未开通手机号码权限
        this.$error({
          title: this.$t('languages.appSettings.RightNotEnough').toString(), // 钉钉应用权限不足
          content: this.$t('languages.appSettings.PhoneRightNotAvailable').toString(),
          okText: this.$t('languages.Iknow').toString()
        });
      } else {
        vm.$message.error(res.errmsg, 2);
      }
    });
  }

  // 查看appSecret
  showSecret(success:Function) {
    const vm = this;
    if (vm.params.appSecret) {
      this.$confirm({
        title: '该信息属于企业高保密信息，相当于个人银行卡及密码，请勿随意传播，请避免企业信息泄露。',
        okText: this.$t('languages.Apps.Continue').toString(),
        cancelText: this.$t('languages.Apps.Cancel').toString(),
        onOk() {
          success();
        }
      });
    } else {
      this.$warning({
        title: '该信息属于企业保密项，如有需要，请联系超级管理员。',
        okText: this.$t('languages.Apps.Good').toString(),
      });
    }
  }
}
</script>

<style lang="less" scoped>
.check-dingtalk {
  text-align: left;
  margin-left: 6px;
  &__header {
    a {
      display: inline-block;
      font-size: 12px;
      color: @primary-color;
      padding-left: 8px;
    }
    padding-bottom: 20px;
    position: relative;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    span {
      line-height: 26px;
      height: 26px;
      // padding-left: 14px;
      // &:before{
      //   content: "";
      //   position: absolute;
      //   height: 20px;
      //   width: 0;
      //   top: 3px;
      //   left: 0;
      //   border-left: 3px solid @primary-color;
      // }
    }
    .header__tips {
      display: inline-block;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      padding-left: 8px;
    }
  }
  &__form {
    .form__title {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      margin: 20px 0;
    }
    .check-dingtalk__item {
      margin-bottom: 20px;
      div {
        float: left;
      }
      .check-dingtalk__left {
        span {
          color: rgba(0, 0, 0, 0.65);
        }
        position: relative;
        .required {
          left: -6px;
          color: #f5222d;
          position: absolute;
        }
        line-height: 32px;
      }

      .check-dingtalk__right {
        color: rgba(0, 0, 0, 0.85);
        &--edit {
          line-height: 32px;
        }
        .example {
          font-size: 12px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
          line-height: 22px;
        }
      }
    }
  }
}
</style>
