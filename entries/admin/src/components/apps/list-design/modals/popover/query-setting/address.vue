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
          v-if="isChinese"
          v-model="backData.name"
          maxlength="50"
          :class="{'input-error':!backData.name}"
        />
        <a-input
          v-else
          v-model="backData.name_i18n[$i18n.locale]"
          maxlength="50"
          :class="{'input-error':!backData.name_i18n[$i18n.locale]}"
        />
        <div class="empty-tip" v-if="!backData.name && isChinese">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
        <div class="empty-tip" v-if="!backData.name_i18n[$i18n.locale] && !isChinese">{{ $t('languages.Apps.DisplayNameRequire') }}</div>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DisplayFormat') }}</label>
      </a-col>
      <a-col :span="19" class="default">
        <a-select
          class="select"
          :placeholder="$t('languages.Apps.PlzSelect')"
          :getPopupContainer="getPopupContainer"
          v-model="backData.displayFormat"
        >
          <a-select-option
            v-for="(option, index) in formatOptions"
            :key="index"
            :value="option.type"
          >{{ $t(`languages.Apps.ListControl.${option.text}`) }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>

    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DefaultValue') }}</label>
      </a-col>
      <a-col :span="19" class="default">
        <pca-selector
          v-model="pcaData"
          :showEmpty="true"
          @change="valueChange"
        />
      </a-col>
    </a-row>

    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.FindAccurately') }}</label>
      </a-col>
      <a-col :span="19">
        <a-switch v-model="backData.accurateSearch"/>
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
import pcaSelector from '@cloudpivot/form/src/renderer/components/shared/pca-selector/pca-selector.vue';
import { FromAddressValueService } from '@cloudpivot/form/src/renderer/services';

import { addressType } from '../../control-modals-map';
@Component({
  name: 'BooleanType',
  components: {
    pcaSelector
  }
})
export default class Address extends Vue {
  @Prop() modalData !: any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

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
    visible: true,
    defaultState: 0,
    accurateSearch: false,
    displayFormat: '0'
  }

  pcaData:any = {};

  formatOptions:any[] = addressType;

  valueChange(val:any) {
    // debugger
    // const value =  FromAddressValueService.setAddressVal(val.adcode);
    this.pcaData = val;
  }

  close() {
    if (this.backData.name === '') {
      return;
    }
    this.backData.propertyCode = this.modalData.code;
    this.backData.propertyType = this.modalData.type;
    if (Object.keys(this.pcaData).length > 0) {
      this.backData.defaultValue = JSON.stringify(this.pcaData);
    }
    this.$emit('backData', this.backData);
  }

  cancel() {
    this.$emit('closeModal');
  }

  created() {
    if (this.modalData.data) {
      this.backData = this.modalData.data;
      if (this.backData.defaultValue) {
        this.pcaData = JSON.parse(this.backData.defaultValue);
      }

      if (typeof this.backData.displayFormat === 'number') {
        this.backData.displayFormat = (this.backData.displayFormat as any).toString();
      }
    } else {
      this.backData.name = this.modalData.name;
    }
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
        .l-h{
          line-height: 32px;
        }
        .select{
          width: 100%
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
