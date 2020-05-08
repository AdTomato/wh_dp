<template>
  <div class="content-box">
    <div class="clearfix" v-if="rendererOptions.layout.length > 0">
      <smart-form :preview="rendererOptions"></smart-form>
      <div class="btn-group">
        <a-button class="btn">
          {{ $t('languages.Apps.Reset') }}</a-button>
        <a-button
          class="btn"
          type="primary"
        >
          {{ $t('languages.Apps.Query') }}
        </a-button>
      </div>
    </div>
    <div v-else class="content-box__empty">
      <p>{{ $t('languages.Apps.QueryIsNullTips') }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Provide
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import SmartForm from '../shared/smart-form.vue';

import { buildControl, buildControlOf } from '../form-design/typings/control-factory';
import { DataItemType, FormControlType } from '../form-design/typings';

const ListdesignModule = namespace('Apps/Listdesign');


@Component({
  name: 'QueryCrieria',
  components: {
    SmartForm
  }
})
export default class QueryCrieria extends Vue {
  @ListdesignModule.State('payloadOptions') payloadOptions: any;

  @ListdesignModule.State('ChangeFlag') ChangeFlag: any;

  rendererOptions: any = {
    controls: {},
    layout: []
  }

  /**
   * 关联表单类型与展示方式map
   */
  relevanceFormMap: any = {
    1: 'dropdown',
    2: 'popup'
  }


  setControlType() {
    this.payloadOptions.forEach((res:any, index: number) => {
      const { type } = res;
      switch (type) {
      /** 数值型 */
        case DataItemType.Number:
          this.assignControlParams(index, FormControlType.NumberRange);
          break;
          /** 日期型 */
        case DataItemType.Date:
          this.assignControlParams(index, FormControlType.DateRange);
          break;
          /** 逻辑型 */
        case DataItemType.Logic:
          this.assignControlParams(index, FormControlType.Logic);
          break;
          /** 选人型 */
        case DataItemType.StaffSelector:
          this.assignControlParams(index, FormControlType.StaffSelector);
          break;
          // 关联表单
        case DataItemType.RelevanceForm:
          this.assignControlParams(index, FormControlType.RelevanceForm);
          break;
        case DataItemType.Address:
          this.assignControlParams(index, FormControlType.Address);
          break;
          // 默认文本类型
        default:
          this.textAssign(index, FormControlType.Text);
          break;
      }
    });
  }

  /**
   * 文本型控件 4种选择方式
   *
   */
  textMap:any = {
    0: FormControlType.Text,
    1: FormControlType.Radio,
    2: FormControlType.Checkbox,
    3: FormControlType.Dropdown,
  }

  textAssign(index:number, type:number) {
    const { displayType } = this.payloadOptions[index].data;
    this.assignControlParams(index, this.textMap[displayType]);
  }

  assignControlParams(index:number, type:number) {
    const { code } = this.payloadOptions[index];
    this.setControls(index, type);
    this.setControlData(code, index);
    this.setLayout(code, index);
  }

  /**
   * 设置控件初始参数
   */
  setControls(index:number, type:number) {
    const { code } = this.payloadOptions[index];
    const control = buildControlOf(this.payloadOptions[index], type);
    if(code === 'sequenceStatus'){
      control.options.multi = true;
      control.options.displayEmpty = false;
    }
    this.rendererOptions.controls[code] = control;
  }

  /**
  * 页面布局设置
  */
  setLayout(code:string, index:number) {
    if (!this.rendererOptions.controls[code].options.visible) {
      return;
    }
    if (!this.rendererOptions.layout.length) {
      this.rendererOptions.layout.push([code]);
    } else {
      const lenght:number = this.rendererOptions.layout.length;
      if (this.rendererOptions.layout[lenght - 1].length < 3) {
        this.rendererOptions.layout[lenght - 1].push(code);
      } else {
        this.rendererOptions.layout.push([code]);
      }
    }
  }

   staffSelectorDefaultMap:any = {
     0: '',
     1: 'originator',
     2: 'originatorDept',
   }

  addressFormatMap: any = {
    0: 'pp-cc-aa',
    1: 'pp-cc',
    2: 'pp',
  }

  /**
   *  数据映射
   * */
  setControlData(code:string, index:number) {
    if (this.payloadOptions[index].data) {
      const {
        options, defaultValue, visible, name,
        relativeQueryCode, relativeSchemaCode, choiceType,
        startValue, endValue, propertyType, accurateSearch, displayFormat, name_i18n
      } = this.payloadOptions[index].data;


      const controlsDefault:any = {
        options,
        defaultValue,
        visible,
        name,
        schemaCode: relativeSchemaCode,
        queryCode: relativeQueryCode,
        selectMode: this.relevanceFormMap[choiceType]
      };
      if (typeof name_i18n === 'object' && name_i18n !== null) {
        controlsDefault.name_i18n = JSON.stringify(name_i18n);
      } else {
        controlsDefault.name_i18n = name_i18n;
      }

      let defaultSetting = this.rendererOptions.controls[code].options;
      if (propertyType === 5) {
        controlsDefault.defaultValue = this.staffSelectorDefaultMap[defaultValue];
      }

      if (propertyType === 10) {
        defaultSetting.addressDetail = 'false';
        defaultSetting.showEmpty = `${!accurateSearch}`;
        defaultSetting.locationType = this.addressFormatMap[displayFormat];
      }

      defaultSetting = Object.assign(defaultSetting, controlsDefault);
    }
  }

  get form() {
    return this.$refs.form as SmartForm;
  }

  @Watch('ChangeFlag')
  queryConditionChange() {
    this.rendererOptions = {
      controls: {},
      layout: []
    };
    this.setControlType();
    /* 一行不足三个进行占位处理 */
    if (this.rendererOptions.layout.length) {
      const { length } = this.rendererOptions.layout;
      switch (this.rendererOptions.layout[length - 1].length) {
        case 1:
          this.rendererOptions.layout[length - 1].push('', '');
          break;
        case 2:
          this.rendererOptions.layout[length - 1].push('');
          break;
        default:
          break;
      }
    }
    // this.form.preview(this.rendererOptions.controls,this.rendererOptions.layout);
  }

  @Provide()
  getScrollEl() {
    return document.getElementsByTagName('body')[0];
  }
}
</script>
<style lang="less" scoped>
  .content-box{
    position: relative;
    z-index: 9;
    /deep/.form{
      width: 100%!important;
    }
    /deep/.smart-form-actions {
      display: none;
    }
   /deep/ .control-label label{
      width:6em;
      min-width: 80px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .smart-form{
      /deep/.ant-row-flex {
        .ant-col-8{

           &:last-child {
            &>div{
              padding-right: 0;
            }
          }
          &:nth-child(2) {
            &>div{
              padding-right: 8px;
            }
          }
          &:first-child {
            &>div{
              padding-left: 0;
              padding-right: 8px;
            }
          }
        }
      }
    }
    .btn-group{
      margin-top: 8px;
      // position: absolute;
      // right: 0;
      // top: -32px;
      // float: left;
      text-align: center;
      // margin-right: 25px;
      .btn:last-child{
        margin-left: 8px;
      }
    }
    &__empty{
      text-align: center;
      font-weight:400;
      color:rgba(0,0,0,0.45);
      line-height: 60px;
    }
  }
</style>
