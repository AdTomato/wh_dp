<template>
  <div class="models-selector-setting">
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DataItem') }}</label>
      </a-col>
      <a-col :span="19">
        <span class="l-h">{{ `${modalData.propertyName || modalData.name}[${modalData.code}]` }}</span>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DisplayName') }}</label>
      </a-col>
      <a-col :span="19">
        <a-input
          :placeholder="$t('languages.Apps.PleaseInputDisplayName')"
          v-if="isChinese"
          maxlength="50"
          v-model="backData.name"
          :class="{'input-error':!backData.name}"
        />
        <a-input
          :placeholder="$t('languages.Apps.PleaseInputDisplayName')"
          maxlength="50"
          v-model="backData.name_i18n[$i18n.locale]"
          v-else
          :class="{'input-error':!backData.name_i18n[$i18n.locale]}"
        />
        <div class="empty-tip" v-if="!backData.name && isChinese">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
        <div class="empty-tip" v-if="!backData.name_i18n[$i18n.locale] && !isChinese">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.OptionalType') }}</label>
      </a-col>
      <a-col :span="19">
        <a-select
          class="select"
          :placeholder="$t('languages.PlaceHolder.Select')"
          v-model="backData.choiceType"
          :getPopupContainer="getPopupContainer"
        >
          <a-select-option
            v-for="(option, index) in textType"
            :key="index"
            :value="option.type"
          >{{ option.text }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row class="row" v-if="backData.choiceType === 2">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.QueryCriteria') }}</label>
      </a-col>
      <a-col :span="19">
        <a-select
          class="select"
          :placeholder="$t('languages.PlaceHolder.Select')"
          v-model="backData.relativeQueryCode"
          :getPopupContainer="getPopupContainer"
        >
          <!-- <a-select-option
              v-for="(option, index) in textType"
              :key="index"
              :value="option.type"
            >{{ option.text }}</a-select-option> -->
          <a-select-option
            v-for="(option, index) in workflowList"
            :key="index"
            :value="option.code"
          >{{ option.name }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.Visible') }}</label>
      </a-col>
      <a-col :span="19">
        <a-switch v-model="backData.visible"/>
      </a-col>
    </a-row>
    <div class="btn-group btn-group-fixed clearfix">
      <a-button
        class="btn"
        type="primary"
        size="small"
        @click="close"
      >{{ $t('languages.Apps.Ok') }}</a-button>
      <a-button
        class="btn"
        size="small"
        @click="cancel"
      >{{ $t('languages.Apps.Cancel') }}</a-button>
    </div>
    <div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Emit
} from 'vue-property-decorator';

import appsApis from '@/apis/apps';
import workFlowApi from '@/apis/workflow';

import * as listApi from '@/apis/list';

// import { listApiapi } from '@cloudpivot/api';
@Component({
  name: 'models-selector-setting',
})
export default class modelsSelectorSetting extends Vue {
  @Prop() modalData !: any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  visible: boolean = true;

  backData = {
    choiceType: '',
    defaultValue: '',
    displayType: 4,
    startValue: '',
    endValue: '',
    name: '',
    options: '',
    propertyCode: '',
    propertyType: '',
    userOptionType: 0,
    visible: true,
    relativeQueryCode: '',
    relativeSchemaCode: ''
  }

  // 关联表单选择类型
  textType = [
    {
      type: 1,
      text: '下拉框'
    },
    {
      type: 2,
      text: '弹出框'
    }
  ]

  workflowList = []

  cancel() {
    this.$emit('closeModal');
  }

  close() {
    if (this.backData.name === '') {
      return;
    }
    this.$emit('backData', this.backData);
  }

  /**
   *  获取模型编码
   */
  get schemaCode() {
    return this.$route.params.bizSchemaCode;
  }

  /**
   *  获取数据项详情，取数据项绑定的关联表单
   */
  // getDataItemInfo() {
  //   const vm:any = this;
  //   const params = {
  //     propertyCode: this.backData.propertyCode,
  //     schemaCode: this.schemaCode
  //   }
  //   // let relativeCode = '';
  //   appsApis.getDataItemDetails(params).then((res:any) => {
  //     if (res.data) {
  //       const { relativeCode } = res.data;
  //       if (relativeCode) {
  //         vm.getWorkflowList(relativeCode);
  //       }
  //     }

  //   })
  // }

  getWorkflowList(schemaCode: string) {
    const vm = this;
    // const params:Apps.Workflow.WorkflowSchemaCode = {
    //   schemaCode
    // }
    // workFlowApi.getWorkflowList(params)

    listApi.getList(schemaCode).then((res:any) => {
      debugger;
      if (res.data) {
        vm.workflowList = res.data;
        // vm.workflowList = res.data.filter((res:any) => {
        //   return res.published ? true : false;
        // });
      }
    });
  }

  /**
   * 气泡框关闭
   */
  closeModal() {
    this.$emit('cancel');
  }

  /**
   * 生命周期
   */
  created() {
    // if (this.modalData.data) {
    this.backData = this.modalData.data;
    // } else {
    //   this.backData.name = this.modalData.name;
    // }
    // this.getDataItemInfo();
    this.getWorkflowList(this.backData.relativeSchemaCode);
  }
}
</script>
<style lang="less" scoped>
  .models-selector-setting{
    padding: 0 6px;
    width: 328px;
    .row{
      margin-bottom: 16px;
      .ant-col-5{
        label{
          line-height: 32px;
          color: rgba(0, 0, 0, .65);
        }
      }
      .ant-col-19{
        .select{
          width: 100%;
        }
        .l-h{
          line-height: 32px;
        }
        .default{
          /deep/.input{
            width: 109px!important;
          }
          .space{
            display: inline-block;
            width: 30px;
            text-align: center;
          }
        }
      }
    }
    .btn-group {
      .btn{
        &:last-child{
          margin-right: 8px;
        }
        float: right;
      }
      .left{
        margin-right: 16px;
      }
    }
    .empty-tip{
      color: #f5222d;
      font-size: 12px;
    }
    input.input-error{
      border-color:#f5222d;
    }
  };
</style>
