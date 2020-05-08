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
          maxlength="50"
          v-model="backData.name_i18n[$i18n.locale]"
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
          v-model="backData.userOptionType"
          :getPopupContainer="getPopupContainer"
        >
          <a-select-option
            v-for="(option, index) in userSelectTypes"
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
      <a-col :span="19">
        <a-select
          class="select"
          :placeholder="$t('languages.PlaceHolder.Select')"
          v-model="backData.defaultValue"
          :getPopupContainer="getPopupContainer"
        >
          <a-select-option
            v-for="(option, index) in userDefaultTypes"
            :key="index"
            :value="option.type"
          >{{ $t(`languages.Apps.ListControl.${option.text}`) }}</a-select-option>
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
        @click="close"
        size="small"
      >{{ $t('languages.Apps.Ok') }}</a-button>
      <a-button
        class="btn"
        @click="cancel"
        size="small"
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
import { UserSelectType, UserDefaultType } from '../../control-modals-map';
@Component({
  name: 'SystemText',
})
export default class SystemText extends Vue {
  @Prop() modalData !: any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  // 系统选人字段可选类型做过滤
  get userSelectTypes () {
    if (this.sysUserArr.includes(this.backData.propertyCode)) {
      return UserSelectType.filter((user:any) => user.type === 1);
    } else if (this.sysDeptArr.includes(this.backData.propertyCode)) {
      return UserSelectType.filter((user:any) => user.type === 2);
    } else {
      return UserSelectType;
    }
  }

  // 系统选人字段默认值做过滤
  get userDefaultTypes () {
    if (this.sysUserArr.includes(this.backData.propertyCode)) {
      return UserDefaultType.filter((user:any) => user.type !== 2);
    } else if (this.sysDeptArr.includes(this.backData.propertyCode)) {
      return UserDefaultType.filter((user:any) => user.type !== 1);
    } else {
      return UserDefaultType;
    }
  }

  visible: boolean = true;

  sysUserArr:any = ['creater', 'owner', 'modifier'];

  sysDeptArr:any = ['createdDeptId', 'ownerDeptId'];

  currentModal:string = '';

  // backData = {
  //   name: '',
  //   selectType: 0,
  //   isShow: true,
  //   defaultType: 0
  // }
  backData: any = {
    choiceType: '',
    defaultValue: 0,
    displayType: 0,
    startValue: 0,
    endValue: '',
    name: '',
    options: '',
    propertyCode: '',
    propertyType: '',
    userOptionType: 0,
    visible: true
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
    // debugger;
    if (this.modalData.data) {
      this.backData = this.modalData.data;
      this.backData.defaultValue = this.backData.defaultValue === '' ? 0 : parseInt(this.backData.defaultValue as any);
    } else {
      this.backData.name = this.modalData.name;
      this.backData.propertyCode = this.modalData.code;
    }
    // 系统选人控件字段固定可选类型
    if (this.sysUserArr.includes(this.backData.propertyCode)) {
      this.backData.userOptionType = 1;
    } else if (this.sysDeptArr.includes(this.backData.propertyCode)) {
      this.backData.userOptionType = 2;
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
