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
        <label class="title">{{ $t('languages.Apps.DisplayType') }}</label>
      </a-col>
      <a-col :span="19">
        <a-select
          class="select"
          :placeholder="$t('languages.PlaceHolder.Select')"
          v-model="backData.displayType"
          @change="typeChange"
          :getPopupContainer="getPopupContainer"
        >
          <a-select-option
            v-for="(option, index) in textType"
            :key="index"
            :value="option.type"
          >{{ $t(`languages.Apps.${option.text}`) }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row class="row" v-if="backData.displayType === 0">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.DefaultValue') }}</label>
      </a-col>
      <a-col :span="19"><a-input v-model="backData.defaultValue"/></a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="5">
        <label class="title">{{ $t('languages.Apps.Visible') }}</label>
      </a-col>
      <a-col :span="19">
        <a-switch v-model="backData.visible"/>
      </a-col>
    </a-row>
    <component
      :options="options"
      ref="options"
      :is="currentModal"
      v-if="visible"
    ></component>
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
import RadioOptions from './radio-options.vue';
import CheckboxOptions from './checkbox-options.vue';
import { textType } from '../../control-modals-map';
@Component({
  name: 'Date',
  components: {
    RadioOptions,
    CheckboxOptions
  }
})
export default class Date extends Vue {
  @Prop() modalData !: any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  visible: boolean = true;

  textType = textType;

  currentModal:string = '';

   options:Array<any> = [
     {
       default: false,
       value: ''
     },
     {
       default: false,
       value: ''
     },
     {
       default: true,
       value: ''
     }
   ]

  backups:Array<any> = [
    {
      default: false,
      value: ''
    },
    {
      default: false,
      value: ''
    },
    {
      default: true,
      value: ''
    }
  ]

  backData = {
    choiceType: '',
    defaultValue: '',
    displayType: 0,
    startValue: '',
    endValue: '',
    name: '',
    options: '',
    propertyCode: '',
    propertyType: '',
    userOptionType: '',
    visible: true
  }

  /**
   * 弹框确定
   */
  close() {
    if (this.backData.name === '') {
      return;
    }
    const childData:any = this.$refs.options;
    if (childData) {
      // this.backData.options = childData.options;
      this.setOptionVal(childData.options);
    }
    this.backData.propertyCode = this.modalData.code;
    this.backData.propertyType = this.modalData.type;
    this.$emit('backData', this.backData);
  }

  created() {
    if (this.modalData.data) {
      this.backData = this.modalData.data;
      this.options = this.modalData.data.optionList;
      this.typeChange();
    } else {
      this.backData.name = this.modalData.name;
    }
  }

  typeChange() {
    this.visible = !this.visible;
    switch (this.backData.displayType) {
      case 1:
      case 3:
        this.currentModal = 'RadioOptions';
        if (!this.options) {
          this.options = this.backups;
        }
        break;
      case 2:
        this.currentModal = 'CheckboxOptions';
        if (!this.options) {
          this.options = this.backups;
        }
        break;
      default:
        this.currentModal = '';
        break;
    }
    this.visible = !this.visible;
  }

  setOptionVal(options: Array<any>) {
    this.backData.defaultValue = '';
    this.backData.options = '';
    const optionArr: Array<string> = [];
    const defaultValue: Array<string> = [];
    options.forEach((res:any) => {
      optionArr.push(res.value);
      if (res.default) {
        defaultValue.push(res.value);
      }
    });
    this.backData.defaultValue = defaultValue.join(';');
    this.backData.options = optionArr.join(';');
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
