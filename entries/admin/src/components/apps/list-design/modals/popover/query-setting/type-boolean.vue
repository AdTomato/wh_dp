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
          :placeholder="$t('languages.Apps.PleaseInputDisplayName')"
          v-if="isChinese"
          v-model="backData.name"
          maxlength="50"
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
        <label class="title">{{ $t('languages.Apps.DefaultStatus') }}</label>
      </a-col>
      <a-col :span="19" class="default">
        <div class="default">
          <a-radio-group v-model="backData.defaultState">
            <a-radio class="radio" :value="1">{{ $t('languages.Apps.Yes') }}</a-radio>
            <a-radio class="radio" :value="0">{{ $t('languages.Apps.No') }}</a-radio>
          </a-radio-group>
        </div>
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
@Component({
  name: 'BooleanType',
})
export default class BooleanType extends Vue {
  @Prop() modalData !: any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  visible: boolean = true;

  backData = {
    choiceType: '',
    defaultValue: '是',
    displayType: 1,
    startValue: '',
    endValue: '',
    name: '',
    options: '是;否;',
    propertyCode: '',
    propertyType: '',
    userOptionType: '',
    visible: true,
    defaultState: 1
  }

  close() {
    if (this.backData.name === '') {
      return;
    }
    this.backData.propertyCode = this.modalData.code;
    this.backData.propertyType = this.modalData.type;
    this.$emit('backData', this.backData);
  }

  cancel() {
    this.$emit('closeModal');
  }

  created() {
    if (this.modalData.data) {
      this.backData = this.modalData.data;
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
        .default{
         .radio{
           display: block;
           line-height: 32px;
           &:last-child{
             margin-top: 8px;
           }
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
