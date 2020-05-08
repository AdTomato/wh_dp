<template>
  <div class="popover-wrap">
    <a-row class="row">
      <a-col :span="leftWidth">
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
        <label class="title">{{ $t('languages.Apps.QrcodeForm') }}</label>
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
  Component, Vue, Prop, Emit
} from 'vue-property-decorator';
import {
  State, namespace
} from 'vuex-class';
import { DateType, WidthSettingType } from '../../control-modals-map';

const ListdesignModule = namespace('Apps/Listdesign');

@Component({
  name: 'AddBtn',
  components: {
  }
})
export default class AddBtn extends Vue {
  @ListdesignModule.State('formList') formList: any;

  @Prop() modalData!:any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  leftWidth:number = 7;

  rightWidth:number = 17;

  visible: boolean = true;

  DateType = DateType;

  WidthSettingType = WidthSettingType;

  backData = {
    name: '',
    associationCode: '',
    popover: false
  }

  close() {
    if (this.backData.name === '') {
      return;
    }
    this.$emit('backData', this.backData);
  }

  concel() {
    this.$emit('closeModal');
  }

  created() {
    if (this.modalData.data) {
      this.backData = this.modalData.data;
    } else {
      this.backData = this.modalData;
    }
    this.backData.popover = false;
    if (this.formList && this.formList.length > 0 && !this.backData.associationCode) {
      this.backData.associationCode = this.formList[0].code;
    }
  }
}
</script>
<style lang="less" scoped>
  .popover-wrap{
    padding: 0 6px;
    width: 280px;
    .row{
      margin-bottom: 16px;
      .ant-col-7{
        label{
          line-height: 32px;
          color: rgba(0, 0, 0, .65);
        }
      }
      .ant-col-17{
        .l-h{
          line-height: 32px;
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
    input.input-error{
      border-color:#f5222d;
    }
  };
</style>
