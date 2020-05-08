
<template>
  <div>
    <div class="query-form">
      <div class="query-form-left">
        <pc-form-renderer ref="formRenderer" :controls="controls"></pc-form-renderer>
      </div>
      <div class="query-form-right">
        <!-- <span v-if="showMore" @click="toggle">
        {{ collapsed ? $t('cloudpivot.list.pc.More') : $t('cloudpivot.list.pc.TakeUp') }}
        <a-icon type="down" :class="{ collapsed : collapsed }"/>
        </span>-->
        <a-button
          @click="resetFilters"
          v-if="fields && fields.length"
        >{{ $t('cloudpivot.list.pc.Reset') }}</a-button>
        <a-button type="primary" @click="query">{{ $t('cloudpivot.list.pc.Query') }}</a-button>
      </div>
    </div>
    <div class="filter-mask" @click="closeQueryItem"></div>
  </div>
</template>


<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { renderer } from "@cloudpivot/form";

import { Button, Icon } from "h3-antd-vue";
import * as ControlFactory from "../helper/control-factory";

@Component({
  name: "query-form",
  components: {
    PcFormRenderer: renderer.components.pc.FormRenderer,
    AButton: Button,
    AIcon: Icon
  }
})
export default class QueryForm extends Vue {
  @Prop()
  fields!: any[];

  @Prop({
    default: 3
  })
  cols!: number;

  // 判断当前是否是中文版本
  // get isChinese() {
  //   return this.$i18n.locale === 'zh';
  // }

  showMore = false;

  controls = "" as any;

  collapsed = true;

  staffMap: any = {
    0: "all",
    1: "user",
    2: "org"
  };

  staffSelectorDefaultMap: any = {
    0: "",
    1: "originator",
    2: "originatorDept"
  };

  addressFormatMap: any = {
    "0": "pp-cc-aa",
    "1": "pp-cc",
    "2": "pp"
  };

  toggle() {
    this.collapsed = !this.collapsed;
  }

  @Watch("fields", {
    immediate: true
  })
  setFields(fields: any[]) {
    setTimeout(() => {
      this.init();
    }, 1);
  }

  // @Watch('$i18n.locale')
  // onLanguageChange() {
  //   setTimeout(() => {
  //     this.init();
  //   }, 1);
  // }

  init() {
    if (!this.fields || !this.fields.length) {
      return;
    }
    const controls: any = {};
    this.fields.forEach((field: any) => {
      // const fieldData = JSON.parse(JSON.stringify(field));
      // if (!this.isChinese) {
      //   fieldData.name = fieldData.name_i18n[this.$i18n.locale];
      // }
      const control = this.toFormControl(field);
      controls[field.propertyCode] = control;
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
            return field ? field.propertyCode : "";
          });
      });

    this.showMore = layout.length > 1;

    const arr: any[] = renderer.components.FormRendererHelper.convertDesign(
      controls,
      layout
    );

    const formControls: any[] = [];
    renderer.components.FormRendererHelper.findFormControl(arr, formControls);
    renderer.components.FormRendererHelper.mergeValue(formControls, {}, true);

    this.controls = arr;

    this.callQuery();
  }

  callQuery() {
    setTimeout(() => {
      const formRenderer = this.$refs.formRenderer as any;
      if (formRenderer) {
        formRenderer.edit();
        this.query();
      } else {
        this.callQuery();
      }
    }, 300);
  }

  // 重置查询条件
  resetFilters() {
    this.collapsed = true;
    const formRenderer = this.$refs.formRenderer as any;
    formRenderer.reset();
    const data = formRenderer.getValue();
    // const data:any = [];
    this.$emit("setFilterData", data);
  }

  // 清空值
  clearFilters() {
    const formRenderer = this.$refs.formRenderer as any;
    formRenderer.clear();
    const data = formRenderer.getValue();
    this.$emit("setFilterData", data);
  }

  // 查询
  query() {
    this.$nextTick(() => {
      const formRenderer = this.$refs.formRenderer as any;
      let data = [];
      if (formRenderer) {
        data = formRenderer.getValue();
        console.log("value", data);
        let flag: boolean = false;
        Object.values(data).some((a: any) => {
          if ((Array.isArray(a) && a[0]) || (!Array.isArray(a) && a)) {
            flag = true;
            return true;
          }
          return false;
        });
      }
      this.$emit("setFilterData", data);
      this.collapsed = true;
    });
  }

  toFormControlType(field: any) {
    switch (field.propertyType) {
      case renderer.DataItemType.Date:
        return renderer.FormControlType.DateRange;
      case renderer.DataItemType.Number:
        return renderer.FormControlType.NumberRange;
      case renderer.DataItemType.StaffSelector:
        return renderer.FormControlType.StaffSelector;
      case renderer.DataItemType.RelevanceForm:
        return renderer.FormControlType.RelevanceForm;
      case renderer.DataItemType.Logic:
        return renderer.FormControlType.Logic;
      case renderer.DataItemType.Address:
        return renderer.FormControlType.Address;
    }

    switch (field.displayType) {
      case 0:
      default:
        return renderer.FormControlType.Text;
      case 1:
        return renderer.FormControlType.Radio;
      case 2:
        return renderer.FormControlType.Checkbox;
      case 3:
        return renderer.FormControlType.Dropdown;
    }
  }

  toFormControl(field: any) {
    // debugger
    const type = this.toFormControlType(field);
    const sourceOpts = {
      visible: field.visible,
      name: field.name,
      defaultValue: field.defaultValue,
      options: field.options
    };
    // console.log('11111111111111111111111',field)

    const options = ControlFactory.buildControlOptions(type, sourceOpts);

    switch (type) {
      case renderer.FormControlType.StaffSelector:
        options.deptVisible = this.staffMap[field.userOptionType];
        options.multi = true;
        break;
      case renderer.FormControlType.RelevanceForm:
        options.queryCode = field.associationCode;
        options.schemaCode = field.relativeSchemaCode;
        options.selectMode =
          field.choiceType === 2
            ? renderer.RelevanceFormSelectMode.Popup
            : renderer.RelevanceFormSelectMode.Dropdown;
        break;
      case renderer.FormControlType.Address:
        options.addressDetail = "false";
        options.showEmpty = `${!field.accurateSearch}`;
        options.locationType = this.addressFormatMap[field.displayFormat];
        break;
      case renderer.FormControlType.Dropdown:
        if (field.propertyCode === "sequenceStatus") {
          options.multi = true;
          options.displayEmpty = false;
        }
        break;
      default:
        break;
    }

    const dv = field.defaultValue;
    if (dv !== undefined && dv !== null && dv !== "") {
      if (
        type === renderer.FormControlType.StaffSelector &&
        typeof field.defaultValue === "string"
      ) {
        options.defaultValueType = this.staffSelectorDefaultMap[
          field.defaultValue
        ];
      } else {
        options.defaultValue = field.defaultValue;
      }
    } else {
      switch (type) {
        case renderer.FormControlType.StaffSelector:
          options.defaultValueType = this.staffSelectorDefaultMap[
            field.defaultValue
          ];
          break;
        case renderer.FormControlType.DateRange:
        case renderer.FormControlType.NumberRange:
          options.defaultValue = [field.startValue, field.endValue];
          break;
        case renderer.FormControlType.Logic:
          options.defaultValue = field.defaultState;
          break;
        default:
          break;
      }
    }

    // console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',typeof field.name_i18n)
    // debugger
    if (typeof field.name_i18n === "object" && field.name_i18n !== null) {
      field.name_i18n = JSON.stringify(field.name_i18n);
    }

    options.name_i18n = field.name_i18n;

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

  backWriteData(value: any) {
    const formRenderer = this.$refs.formRenderer as any;
    if (formRenderer) {
      formRenderer.controller.value = value;
    }
  }

  closeQueryItem() {
    this.$emit("hide");
  }
}
</script>

<style lang="less" scoped>
.filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
}
.query-form {
  // display: flex;
  padding: 10px 8px;
  box-shadow: 0px 4px 8px 0px rgba(30, 85, 255, 0.1);
  border-radius: 4px;
  background: #fff;
  max-height: 510px;
  overflow-y: auto;
  position: relative;
  z-index: 9;
  &-left {
    flex-grow: 1;
  }

  &-right {
    flex-shrink: 0;
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

  &.collapsed {
    height: 48px;
    box-shadow: none;
  }

  &.collapsed.showmore {
    overflow: hidden;
  }

  /deep/.field__label {
    min-width: 1em;
    max-width: 6em;

    & > div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  /deep/.h3-organization {
    max-height: 34px;
    overflow: auto;
  }
}
</style>
