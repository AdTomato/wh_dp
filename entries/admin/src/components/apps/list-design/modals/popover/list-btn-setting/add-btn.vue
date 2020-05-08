<template>
  <div class="popover-wrap">
    <a-row class="row">
      <a-col :span="6">
        <label class="title">{{ $t('languages.Apps.DisplayName') }}</label>
      </a-col>
      <a-col :span="rightWidth">
        <a-input
          v-if="isChinese"
          maxlength="50"
          v-model="backData.name"
          :class="{'input-error':!backData.name}"
        />
        <a-input
          v-else
          maxlength="50"
          v-model="backData.name_i18n[$i18n.locale]"
          :class="{'input-error':!backData.name_i18n[$i18n.locale]}"
        />
        <div class="empty-tip" v-if="!backData.name && isChinese">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
        <div class="empty-tip" v-if="!backData.name_i18n[$i18n.locale] && !isChinese">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="leftWidth">
        <label class="title">{{ $t('languages.Apps.Relevance') }}</label>
      </a-col>
      <a-col :span="rightWidth">
        <a-radio-group
          class="radio-group"
          v-model="backData.associationType"
          @change="radioChange"
        >
          <a-radio class="radio" :value="0">{{ $t('languages.Apps.AssociatedForms') }}</a-radio>
          <a-radio class="radio" :value="1">{{ $t('languages.Apps.RelevantProcess') }}</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="row" v-if="backData.associationType === 1">
      <a-col :span="leftWidth">
        <label class="title">{{ $t('languages.Apps.RelevantProcess') }}</label>
      </a-col>
      <a-col :span="rightWidth">
        <a-select
          class="select"
          :placeholder="$t('languages.PlaceHolder.Select')"
          v-model="backData.associationCode"
          :getPopupContainer="getPopupContainer"
          :class="{'input-error': !backData.associationCode}"
        >
          <a-select-option
            v-for="(option, index) in workflowList"
            :key="index"
            :value="option.workflowCode"
          >{{ option.workflowName }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row class="row" v-else>
      <a-col :span="leftWidth">
        <label class="title">{{ $t('languages.Apps.AssociatedForms') }}</label>
      </a-col>
      <a-col :span="rightWidth">
        <a-select
          class="select"
          :placeholder="$t('languages.PlaceHolder.Select')"
          v-model="backData.associationCode"
          :getPopupContainer="getPopupContainer"
          :class="{'input-error': !backData.associationCode}"
        >
          <a-select-option
            v-for="(option, index) in formList"
            :key="index"
            :value="option.code"
          >{{ option.name }}</a-select-option>
        </a-select>
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
        @click="concel"
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
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import { DateType, WidthSettingType } from '../../control-modals-map';
// import workFlowApi from '@/apis/workflow';
// import * as formApi from '@/apis/form/index';

const ListdesignModule = namespace('Apps/Listdesign');
@Component({
  name: 'AddBtn',
  components: {
  }
})
export default class AddBtn extends Vue {

  @ListdesignModule.State('formList') formList: any;
  @ListdesignModule.State('workflowList') workflowList: any;

  @ListdesignModule.State('name') name: any;

  @Prop() modalData!:any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  leftWidth:number = 6;

  rightWidth:number = 18;

  visible: boolean = true;

  DateType = DateType;

  WidthSettingType = WidthSettingType;

  // formList:Array<any> = [];

  // workflowList:Array<any> = [];

  backData = {
    name: '',
    associationCode: '',
    associationType: 0,
    associationflowCode: '',
    associationflowType: 0,
    popover: false,
  }

  close() {
    if (this.backData.name === '') {
      return;
    }

    if (this.backData.associationCode === '') {
      this.$message.error(this.$t('languages.Apps.AssociatedFormTips'));
      return;
    }

    this.$emit('backData', this.backData);
  }

  concel() {
    this.$emit('closeModal');
  }

  created() {
    this.dataMounted();
  }

  dataMounted() {
    // this.gerFormList();
    // this.getWorkflowList();
    if (this.modalData.data) {
      this.backData = this.modalData.data;
    } else {
      this.backData.name = this.modalData.name;
    }
    this.backData.popover = false;

    if (this.workflowList && this.workflowList.length > 0 && !this.backData.associationCode) {
      this.backData.associationflowCode = this.workflowList[0].workflowCode;
    }
    if (this.formList && this.formList.length > 0 && !this.backData.associationCode) {
      this.backData.associationCode = this.formList[0].code;
    }

    console.log(this.backData);
  }

  radioChange() {
    this.backData.associationCode = '';

    if (this.backData.associationType) {
      if (this.workflowList.length > 0) {
        this.backData.associationCode = this.workflowList[0].workflowCode;
      }
    } else if (this.formList.length > 0) {
      this.backData.associationCode = this.formList[0].code;
    }
  }

  get schemaCode() {
    return this.$route.params.bizSchemaCode;
  }

  // getWorkflowList() {
  //   const that = this;
  //   const params:Apps.Workflow.WorkflowSchemaCode = {
  //     schemaCode: this.schemaCode
  //   };
  //   workFlowApi.getWorkflowList(params).then((res:any) => {
  //     if (res.data) {
  //       that.workflowList = res.data.filter((res:any) => (!!res.published));

  //       if (that.workflowList && that.workflowList.length > 0 && !this.backData.associationCode) {
  //         this.backData.associationflowCode = that.workflowList[0].workflowCode;
  //       }
  //     }
  //   });
  // }

  // gerFormList() {
  //   const that = this;
  //   const str:string = this.schemaCode;
  //   formApi.list(str).then((res:any) => {
  //     that.formList = res.data.filter((res:any) => (!!res.published));


  //     if (that.formList && that.formList.length > 0 && !this.backData.associationCode) {
  //       this.backData.associationCode = that.formList[0].code;
  //     }
  //   });
  // }

  // @Watch('modalData')
  // onModalDataChange(v:any) {
  //   this.dataMounted();
  // }
}
</script>
<style lang="less" scoped>
  .popover-wrap{
    padding: 0 6px;
    width: 280px;
    .row-wrap{
      max-height: 168px;
      overflow-y: auto;
    }
    .row{
      margin-bottom: 16px;
      .ant-col-6{
        label{
          line-height: 32px;
          color: rgba(0, 0, 0, .65);
        }
      }
      .ant-col-18{
        .l-h{
          line-height: 32px;
        }
        .radio-group {
          width: 100%;
          .radio{
            line-height: 32px;
            margin-right: 0;
            &:first-child{
              float: left;
            }
            &:last-child{
              float:right;
            }
          }
        }
      }
      .select{
        width: 100%;
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
    .input-error{
      border-color:#f5222d;
      /deep/.ant-select-selection {
        border-color:#f5222d;
      }
    }
  };
</style>
