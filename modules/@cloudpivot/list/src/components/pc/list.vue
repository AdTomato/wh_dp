
<template>
  <sheet
    class="list"
    :radio="isRadio"
    :checkbox="isCheckbox"
    :checkeds="checkeds"
    :columns="sheetCols"
    :rows="sheetRows"
    :frozenKeys="frozenKeys"
    @check="onCheck"
    @columnResize="onResizeEnd"
    @rowClick="onRowClick"
    @freezeColumn="onFreezeColumn"
  ></sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";

import { schema, renderer } from "@cloudpivot/form";

import Sheet from "@cloudpivot/form/src/renderer/components/pc/form-sheet/sheet.vue";

import { form } from "@cloudpivot/api";

import * as forms from "h3-forms";

@Component({
  name: "list",
  components: {
    Sheet
  }
})
export default class List extends Vue {
  @Prop({
    default: ""
  })
  checkType!: string;

  @Prop({
    default: () => []
  })
  columns!: any[];

  @Prop({
    default: () => []
  })
  rows!: any[];
  
  @Prop({
    default: () => {}
  })
  sheetParams!: any;

  sheetCols: any[] = [];

  sheetCtrl: any;

  checkeds: boolean[] = [];

  sheetRows: any[] = [];

  @Prop({
    default: () => []
  })
  checkedKeys!: string[];

  frozenKeys: string[] = [];

  get isRadio() {
    return this.checkType === "radio";
  }

  get isCheckbox() {
    return this.checkType === "checkbox";
  }

  @Watch("columns")
  onColumnsChange() {
    const cols = this.columns.map(this.convertCol);
    const sheet = {
      type: schema.FormControlType.Sheet,
      key: "list",
      columns: cols,
      options: {
        sheetParams: this.sheetParams
      }
    };
    this.sheetCols = cols;
    const sheetOpts = renderer.FormBuilderHelper.buildOptionsOf(sheet);
    const group = forms.FormBuilder.build({
      list: sheetOpts
    });
    this.sheetCtrl = group.children.list;
  }

  convertCol(col: any) {
    const width = Number(col.width);

    let type = schema.mapToControlType(col.propertyType);

    let options = renderer.FormControlOptionsService.buildFor(type, {
      name: col.name,
      name_i18n: col.name_i18n ? JSON.parse(col.name_i18n) : null
    });

    if (options) {
      if (type === schema.FormControlType.Date) {
        switch (col.displayFormat) {
          default:
          case 2:
            options.format = "YYYY-MM-DD hh:mm:ss";
            break;
          case 1:
            options.format = "YYYY-MM-DD";
            break;
          case 3:
            options.format = "YYYY-MM-DD hh:mm";
            break;
        }
      } else if (type === schema.FormControlType.Number) {
        switch (col.displayFormat) {
          default:
          case 0:
            options.format = schema.NumberFormatType.None;
            break;

          case 1:
            options.format = schema.NumberFormatType.Int;
            break;
          case 2:
            options.format = schema.NumberFormatType.Tenths;
            break;
          case 3:
            options.format = schema.NumberFormatType.Decimal;
            break;
          case 4:
            options.format = schema.NumberFormatType.Ratio;
            break;
          case 5:
            options.format = schema.NumberFormatType.Ratio2;
            break;
          case 6:
            options.format = schema.NumberFormatType.Ratio3;
            break;
          case 7:
            options.format = schema.NumberFormatType.CurrencyRMB;
            break;
          case 8:
            options.format = schema.NumberFormatType.CurrencyDollar;
            break;
          case 9:
            options.format = schema.NumberFormatType.CurrencyEuro;
            break;
          case 10:
            options.format = schema.NumberFormatType.CurrencyHK;
            break;
        }
      } else if (col.propertyType === schema.DataItemType.StaffSelector) {
        options.displayType = schema.DisplayType.Text;
      } else if (col.propertyType === schema.DataItemType.RelevanceForm) {
        options.schemaCode = col.relativeSchemaCode;
      }
    }

    return {
      key: col.propertyCode,
      type,
      width,
      options
    };
  }

  @Watch("checkedKeys")
  onCheckedKeysChange() {
    const checkeds = this.rows.map(() => false);

    if (this.checkedKeys.length > 0) {
      this.rows.forEach(
        (x: any, i) => (checkeds[i] = this.checkedKeys.indexOf(x.id) > -1)
      );
    }
    this.checkeds = checkeds;
  }

  @Watch("rows",{
    immediate: true
  })
  onRowsChange() {
    const isZh = this.$i18n.locale === "zh";

    setTimeout(() => {
      this.sheetRows = this.rows.map((val, i) => {
        if (val.sequenceStatus && isZh) {
          val.sequenceStatus = form.sequenceStatusZh[val.sequenceStatus];
        }

        const g = this.addRow(val, i);
        return this.buildRow(i, g);
      });

      this.onCheckedKeysChange();
    }, 0);
  }

  buildRow(index: number, group: forms.FormGroup) {
    const row: schema.RendererFormControl[] = JSON.parse(
      JSON.stringify(this.sheetCols)
    );
    row.forEach((col, idx) => {
      col.edit = false;

      const sheetParams = this.sheetParams;
      if(sheetParams){
          col.options.sheetParams = sheetParams;
      }
      if (group) {
        const _ctrl = group.findChild(col.key);
        if (_ctrl) {
          col.controller = _ctrl;
        }
      }
    });
    return row;
  }

  addRow(vals?: any, idx?: number) {
    if (vals) {
      this.sheetCols.forEach(col => {
        vals[col.key] = renderer.FormControlValueService.convert(
          col.type,
          vals[col.key]
        );
      });
    }

    // 删除有值表达的值
    this.sheetCols.forEach(col => {
      if (col.options.computeFormula) {
        delete vals[col.key];
      }
    });

    const ctrl = this.sheetCtrl;
    const group =
      idx !== undefined ? ctrl.insertRow(idx, vals) : ctrl.appendRow(vals);
    return group;
  }

  onResizeEnd() {}

  onCheck(checkeds: boolean[], index: number) {
    this.checkeds = checkeds;

    const vals = checkeds
      .map((c, i) => (c ? this.rows[i] : null))
      .filter(x => !!x);

    this.$emit("check", vals);
  }

  onRowClick(index: number) {
    const row = this.rows[index];
    this.$emit("rowClick", row);
  }

  onFreezeColumn(columnKey: string, freeze: boolean) {
    if (freeze) {
      this.frozenKeys.push(columnKey);
    } else {
      const index = this.frozenKeys.findIndex(k => k === columnKey);
      if (index > -1) {
        this.frozenKeys.splice(index, 1);
      }
    }
  }
}
</script>


<style lang="less" scoped>
</style>