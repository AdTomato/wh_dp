
<template>
  <div class="query-form" :class="{ collapsed : collapsed }">
    <div class="query-form-left">
      <mobile-form-renderer ref="formRenderer" :controls="controls"></mobile-form-renderer>
    </div>
  </div>
</template>


<script lang='ts'>
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';


import { renderer } from '@cloudpivot/form';

const { FormControlType } = renderer;

// import { FormControlType } from 'h3-form-renderer-vue';

// import MobileFormRenderer from 'h3-form-renderer-vue/src/components/mobile-form-renderer.vue';

// import { FormRendererHelper } from 'h3-form-renderer-vue/src/components/form-renderer-helper';

// import { renderer.DataItemType, RelevanceFormSelectMode } from 'h3-form-renderer-vue';

import { H3Button } from 'h3-mobile-vue';

import * as ControlFactory from '../../pc/helper/control-factory';
import { form } from '@cloudpivot/api';

@Component({
  name: 'query-form',
  components: {
    MobileFormRenderer : renderer.components.mobile.FormRenderer,
    H3Button
  }
})
export default class QueryForm extends Vue {
  @Prop()
  fields!: any[];

  @Prop({
    default: 3
  })
  cols !: number;

  showMore = false;

  controls = '' as any;

  collapsed = true;

  staffMap:any = {
    0: 'all',
    1: 'user',
    2: 'org'
  }

  staffSelectorDefaultMap:any = {
    0: '',
    1: 'originator',
    2: 'originatorDept'
  }

  addressFormatMap: any = {
    '0': 'pp-cc-aa',
    '1': 'pp-cc',
    '2': 'pp',
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }

  // 重置查询条件
  resetFilters() {
    const formRenderer = this.$refs.formRenderer as any;
    formRenderer.reset();
  }

  // 查询
  query() {
    const formRenderer = this.$refs.formRenderer as any;
    const data = formRenderer.getValue();
    return data;
  }


  @Watch('fields', {
    immediate: true
  })
  setFields(fields: any[]) {
    setTimeout(() => {
      this.init();
    }, 1);
  }

  init() {
    if (!this.fields || !this.fields.length) {
      return;
    }

    const controls: any = {};

    this.fields.forEach((field: any) => {
      controls[field.propertyCode] = this.toFormControl(field);
    });

    const rows = Math.ceil(this.fields.length / this.cols);

    const layout = Array(rows)
      .fill(0)
      .map((_, i) => {
        const start = i * this.cols;
        return Array(this.cols)
          .fill(0)
          .map((__, colIdx) => {
            const field: any = this.fields[start + colIdx];
            return field ? field.propertyCode : '';
          });
      });

    this.showMore = layout.length > 1;

    const arr : any[] = renderer.components.FormRendererHelper.convertDesign(controls, layout);

    const formControls : any[] = [];
    renderer.components.FormRendererHelper.findFormControl(arr, formControls);
    renderer.components.FormRendererHelper.mergeValue(formControls, {}, true);

    this.controls = arr;

    this.callQuery();
  }

  callQuery(){
    setTimeout(() => {
      const formRenderer = this.$refs.formRenderer as any;
      if(formRenderer){
        formRenderer.edit();
        this.$emit('ready');
      }else{
        this.callQuery();
      }
    },300);
  }

  toFormControlType(field: any) {
    switch (field.propertyType) {
      case renderer.DataItemType.Date:
        return FormControlType.DateRange;
      case renderer.DataItemType.Number:
        return FormControlType.NumberRange;
      case renderer.DataItemType.StaffSelector:
        return FormControlType.StaffSelector;
      case renderer.DataItemType.RelevanceForm:
        return FormControlType.RelevanceForm;
      case renderer.DataItemType.Logic:
        return FormControlType.Logic;
      case renderer.DataItemType.Address:
        return FormControlType.Address;
    }

    switch (field.displayType) {
      case 0:
      default:
        return FormControlType.Text;
      case 1:
        return FormControlType.Radio;
      case 2:
        return FormControlType.Checkbox;
      case 3:
        return FormControlType.Dropdown;
    }
  }

  toFormControl(field: any) {
    const type = this.toFormControlType(field);
    const sourceOpts = {
      visible: field.visible,
      name: field.name,
      defaultValue: field.defaultValue,
      options: field.options
    };


    const options = ControlFactory.buildControlOptions(type, sourceOpts);

    switch (type) {
      case FormControlType.StaffSelector:
        options.deptVisible = this.staffMap[field.userOptionType];
        options.multi = true;
        break;
      case FormControlType.RelevanceForm:
        options.queryCode = field.associationCode;
        options.schemaCode = field.relativeSchemaCode;
        options.selectMode = field.choiceType === 2
          ? renderer.RelevanceFormSelectMode.Popup
          : renderer.RelevanceFormSelectMode.Dropdown;
        break;
      case FormControlType.Address:
        options.addressDetail = 'false';
        options.showEmpty = `${!field.accurateSearch}`;
        options.locationType = this.addressFormatMap[field.displayFormat];
         break;
      case renderer.FormControlType.Dropdown:
        if (field.propertyCode === 'sequenceStatus') {
          options.multi = true;
          options.displayEmpty = false;
          
          // application-list里已经转换过了，此处重复转换
          // if(this.$i18n.locale === 'zh' && field.defaultValue){
          //   field.defaultValue = field.defaultValue.split(';').map((val:any) => form.sequenceStatusZh[val]).join(';');
          // }
        }
        break;
      default:
        break;
    }

    const dv = field.defaultValue;
    if (dv !== undefined && dv !== null && dv !== '') {
      if (
        type === FormControlType.StaffSelector
        && typeof field.defaultValue === 'string'
      ) {
        options.defaultValueType = this.staffSelectorDefaultMap[field.defaultValue];
      } else {
        options.defaultValue = field.defaultValue;
      }
    } else {
      switch (type) {
        case FormControlType.StaffSelector:
          options.defaultValueType = this.staffSelectorDefaultMap[
            field.defaultValue
          ];
          break;
        case FormControlType.DateRange:
        case FormControlType.NumberRange:
          options.defaultValue = [field.startValue, field.endValue];
          break;
        case FormControlType.Logic:
          options.defaultValue = field.defaultState;
          break;
        default:
          break;
      }
    }

    const control = {
      key: field.propertyCode,
      writable: true,
      type,
      options
    };
    return control;
  }

  findControl(key: string) {
    const formRenderer = this.$refs.formRenderer as any;
    if (formRenderer) {
      const ctrl = formRenderer.controller.findChild(key);
      return ctrl;
    }
  }
}
</script>
<style lang="less" scoped>
.query-form {
  display: flex;
  &-left {
    flex-grow: 1;
  }

 /*  &-right {
    width: 440px;
    min-width: 440px;
    padding: 8px;
    text-align: right;

    & > button {
      margin-left: 8px;
    }

    & > span {
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      user-select: none;
      margin-right: 16px;

      & > i.collapsed {
        transform: rotate(90deg);
      }
    }
  } */

  &.collapsed {
    // overflow: hidden;
    // height: 48px;
  }
}
</style>
