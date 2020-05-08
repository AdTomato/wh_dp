
<template>
  <div>
    <div class="query-form" v-if="fields && fields.length">
      <div class="query-form-left">
        <pc-form-renderer ref="formRenderer" :controls="controls"></pc-form-renderer>
      </div>
      <div class="query-form-right">
        <!-- <span v-if="showMore" @click="toggle">
        {{ collapsed ? $t('languages.Apps.More') : $t('languages.Apps.Retract') }}
        <a-icon type="down" :class="{ collapsed : collapsed }"/>
      </span> -->
        <a-button v-if="fields && fields.length">{{ $t('languages.Apps.Reset') }}</a-button>
        <a-button type="primary">{{ $t('languages.Apps.Query') }}</a-button>
      </div>
    </div>
    <div v-else class="content-box__empty">
      <p>{{ $t('languages.Apps.QueryIsNullTips2') }}</p>
    </div>
  </div>
</template>


<script lang='ts'>
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  FormControlType,
  StaffSelectorSelectType,
  RelevanceFormSelectMode
} from '@cloudpivot/form/schema';

import PcFormRenderer from '@cloudpivot/form/src/renderer/components/pc-form-renderer.vue';

import { FormRendererHelper } from '@cloudpivot/form/src/renderer/components/form-renderer-helper';

import { DataItemType } from '../form-design/typings';

import * as ControlFactory from '../form-design/typings/control-factory';

@Component({
  name: 'query-form',
  components: {
    PcFormRenderer
  }
})
export default class QueryForm extends Vue {
  @Prop()
  fields!: any[];

  @Prop({
    default: 3
  })
  cols!: number;

  showMore = false;

  controls = '' as any;

  collapsed = true;

  staffMap: any = {
    0: 'all',
    1: 'user',
    2: 'org'
  };

  staffSelectorDefaultMap: any = {
    0: '',
    1: 'originator',
    2: 'originatorDept'
  };

  addressFormatMap: any = {
    0: 'pp-cc-aa',
    1: 'pp-cc',
    2: 'pp',
  }

  // created() {
  //   debugger
  // }
  toggle() {
    this.collapsed = !this.collapsed;
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

    const arr = FormRendererHelper.convertDesign(controls, layout);

    const formControls: any[] = [];
    FormRendererHelper.findFormControl(arr, formControls);
    FormRendererHelper.mergeValue(formControls, {}, true);

    this.controls = arr

    this.callQuery();
  }

  callQuery(){
    setTimeout(() => {
      const formRenderer = this.$refs.formRenderer as any;
      if(formRenderer){
        formRenderer.edit();
      }else{
        this.callQuery();
      }
    }, 500);
  }

  toFormControlType(field: any) {
    switch (field.propertyType) {
      case DataItemType.Date:
        return FormControlType.DateRange;
      case DataItemType.Number:
        return FormControlType.NumberRange;
      case DataItemType.StaffSelector:
        return FormControlType.StaffSelector;
      case DataItemType.RelevanceForm:
        return FormControlType.RelevanceForm;
      case DataItemType.Logic:
        return FormControlType.Logic;
      case DataItemType.Address:
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
          ? RelevanceFormSelectMode.Popup
          : RelevanceFormSelectMode.Dropdown;
        break;
      case FormControlType.Address:
        options.addressDetail = 'false';
        options.locationType = this.addressFormatMap[field.displayFormat];
        options.showEmpty = `${!field.accurateSearch}`;
        break;
      case FormControlType.Dropdown:
        if (field.propertyCode === 'sequenceStatus') {
          options.multi = true;
          options.displayEmpty = false;
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
      type,
      options
    };
    return control;
  }
}
</script>

<style lang="less" scoped>
.query-form {

  &-left {
    /deep/.ant-col > div.field {
      align-items: center;
    }
    /deep/.field__label {
      align-self: center;
    }
  }

  &-right {
    padding: 8px;
    text-align: center;

    & > button {
      margin-left: 8px;
    }

    & > span {
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      user-select: none;
      margin-right: 16px;

      & > i {
        transform: rotate(180deg);
      }
      & > i.collapsed {
        transform: rotate(0);
      }
    }
  }
}

.content-box__empty{
    text-align: center;
    font-weight:400;
    color:rgba(0,0,0,0.45);
    line-height: 60px;
  }
</style>
