<template>
  <div class="popover-wrap">
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
          v-model="backData.name"
          maxlength="50"
          :class="{'input-error':!backData.name}"
        />
        <div class="empty-tip" v-if="!backData.name">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DefaultStatus') }}</label>
      </a-col>
      <a-col :span="19">
        <ul class="options">
          <li
            v-for="(option,index) in options"
            :key="index"
          ><a-checkbox class="checkbox" v-model="option.default"/> <span>{{ option.value }}</span></li>
        </ul>
        <!-- <a-checkbox-group class="checkbox" :options="plainOptions" v-model="backData.defaultStatus" /> -->
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
import { FormStatusList } from '../../control-modals-map';
@Component({
  name: 'FormStatus',
})
export default class FormStatus extends Vue {
  @Prop() modalData !: any;

  plainOptions = FormStatusList;

  visible: boolean = true;

  backData = {
    choiceType: '',
    defaultValue: '',
    displayType: 3,
    startValue: '',
    endValue: '',
    name: '',
    options: '',
    propertyCode: '',
    propertyType: '',
    userOptionType: '',
    visible: true
  }

  options = [
    {
      default: false,
      value: '草稿2'
    },
    {
      default: false,
      value: '进行中'
    },
    {
      default: false,
      value: '已完成'
    },
    {
      default: false,
      value: '已作废'
    }
  ]

  created() {
    if (this.modalData.data) {
      this.backData = this.modalData.data;
      if (this.modalData.data.optionList) {
        this.options = this.modalData.data.optionList;
      }
      this.backData.displayType = 3;
    } else {
      this.backData.name = this.modalData.name;
    }
  }

  close() {
    if (this.backData.name === '') {
      return;
    }
    this.backData.propertyCode = this.modalData.code;
    this.backData.propertyType = this.modalData.type;
    this.setOptionVal(this.options);
    this.$emit('backData', this.backData);
  }

  setOptionVal(options: Array<any>) {
    // debugger
    // this.backData.defaultValue = '';
    this.backData.options = options
      .map((res:any) => res.value)
      .join(';');


    this.backData.defaultValue = options
      .map((res:any) => {
        if (res.default) {
          return res.value;
        }
      })
      .filter((res:any) => res).join(';');
  }

  cancel() {
    this.$emit('closeModal');
  }

  closeModal() {
    this.$emit('cancel');
  }
}
</script>
<style lang="less" scoped>
  .popover-wrap{
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
        .checkbox{
         /deep/ label {
            display: block;
            line-height: 32px;
         }
        }
        .l-h{
          line-height: 32px;
        }
      }
      .options {
        li{
          line-height: 32px;
          .checkbox{
            margin-right: 8px;
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
