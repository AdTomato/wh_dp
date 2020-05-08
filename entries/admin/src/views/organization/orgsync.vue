<template>
  <div class="org-synchronize">
    <img src="../../assets/images/synchronize.png" alt="">
    <div @click="Orgsynchro" :class="{'loading-btn': loadingBtn}">
      <a-icon type="loading" v-if="loadingBtn"/>
      <span
        v-if="loadingBtn"
      >{{ $t('languages.Synching') }}</span>
      <span
        v-else
      >{{ $t('languages.SynchronizeNow') }}</span>
    </div>
    <a-modal
      width="422px"
      title="提示"
      :visible="visible"
      @ok="handleOk"
      @cancel="visible = !visible"
      okText="前往配置"
      cancelText="暂不配置"
      class="config-tips"
      :maskClosable="false"
      :keyboard="false"
    >
      <p>钉钉信息未配置，无法同步</p>
      <p>请前往 <span class="heighlight">系统管理-常规设置</span> 配置钉钉信息
      </p>
    </a-modal>
    <a-modal
      width="520px"
      title=""
      :visible="showErrorTip"
      class="error-tips"
      :maskClosable="false"
      :keyboard="false"
      :closable="false"
    >
      <div class="error-top">
        <i class="icon aufontAll h-icon-all-exclamation-circle icon-warning"></i>
        <span class="error-title">部分同步成功，以下数据有异常，请处理</span>
      </div>
      <div class="error-content">
        <ul>
          <li v-for="(data, index) in errorData" :key="index">
            <div class="dot"></div><span>{{ data }}</span>
          </li>
        </ul>
      </div>
      <template slot="footer">
        <a-button
          key="print"
          type="primary"
          @click="showErrorTip = !showErrorTip"
        >确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<style lang="less">
  .org-synchronize{
    margin: 125px auto;
    width: 315px;
    text-align: center;
    box-shadow:0px 2px 10px 0px rgba(237,240,238,1);
    border-radius: 10px;
    color: #fff;
    &>div{
      background-color: @primary-color;
      border-radius:0px 0px 10px 10px;
      cursor: pointer;
      span{
        font-size: 16px;
        line-height: 48px;
        color: #fff;
        padding-left: 4px;
      }
    }
    &>div.loading-btn{
      opacity:0.5;
      filter: Alpha(opacity=50);
      -moz-opacity:0.1;
      cursor: not-allowed;
    }
    img{
      width: 227px;
      padding: 20px 10px 20px 20px;
    }
  }
</style>
<style lang="less">
.config-tips {
  p{
    margin-bottom: 8px;
    .heighlight{
      color: @primary-color;
    }
  }
}
.error-tips{
  .ant-modal-footer{
    border-top: none;
    padding-top: 0;
  }
  .error-top{
    margin-top: 8px;
    margin-left: 8px;
    .icon-warning {
      color:#FAAD14;
      font-size: 22px;
    }
    .error-title {
      display: inline-block;
      font-size: 16px;
      font-family: 'PingFangSC-Medium';
      font-weight: 600;
      color: rgba(0,0,0,0.85);
      line-height: 24px;
      margin-left: 16px;
      vertical-align: text-bottom;
    }
  }
  .error-content{
    margin: 10px 8px 0 8px;
    background: #FFFBE6;
    max-height: 260px;
    overflow: auto;
    border: 1px solid #FFE58F;
    padding: 12px;
    border-radius: 4px;
    color: rgba(0,0,0,0.85);
    font-size: 14px;
    .dot{
      display: inline-block;
      width: 5px;
      height: 5px;
      margin-right: 8px;
      vertical-align: middle;
      border-radius: 50%;
      background: rgba(0,0,0,0.45);
    }
  }
}
</style>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import organizationApi from '../../apis/organization';
@Component
export default class Synchronize extends Vue {
  loadingBtn: boolean = false;
  $message: any;
  visible: boolean = false;
  showErrorTip:boolean = false;
  errorData:any = [];
  /**
   *  未配置钉钉信息
   */
  handleOk() {
    this.$router.push({
      name: 'commonSetting'
    });
  }
  Orgsynchro() {
    if (this.loadingBtn) {
      return;
    }
    this.loadingBtn = !this.loadingBtn;
    organizationApi.synchronize().then((res:any) => {
      if (res.errcode === 0) {
        this.$message.success(res.errmsg, 2);
      } else if (+res.errcode === 10026) {
        if (typeof res.data === 'object') {
          const dataArr = Object.entries(res.data);
          dataArr.forEach((d:any) => {
            if (!d && !d[0] && !d[1]) {
              return;
            }
            const [key, value] = d;
            this.errorData.push(value);
          });
          this.showErrorTip = true;
        }
      } else if (+res.errcode === 10021) {
        this.visible = true;
      } else {
        this.$message.error(res.errmsg, 2);
      }
      this.loadingBtn = !this.loadingBtn;
    });
  }
}
</script>
