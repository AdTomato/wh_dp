
<script lang='ts'>
import { Component, Vue, Prop, Provide } from "vue-property-decorator";

import ControlAdapter from "./pc/control-adapter.vue";
import FormCol from "./pc/form-col.vue";
import FormRow from "./pc/form-row.vue";

import FormGroup from "./layout/form-group.vue";

import FormTabs from "./layout/pc-form-tabs.vue";

import FormTabsPane from "./layout/pc-form-tabs-pane.vue";

import { FormRenderer } from "./form-renderer";
import { Tabs } from "h3-antd-vue";

@Component({
  name: "pc-form-renderer",
  components: {
    ControlAdapter,
    FormCol,
    FormRow,
    FormGroup,
    FormTabs,
    FormTabsPane,
    ATabPane: Tabs.TabPane,
  }
})
export default class PcFormRenderer extends FormRenderer {

  @Provide()
  getController(){
    return this.controller;
  }

  @Provide()
  findController(key: string | number) {
    if (!this.controller) {
      return;
    }
    return this.controller.findChild(key);
  }

  @Provide()
  getFormControls(keys?: string[]) {
    return super.findFormControls(keys);
  }
  
  @Provide()
  emitSheetColumnResize(data: any) {
      this.$emit('sheetColumnResize', data);
  }

  @Provide()
  valChange(keys:string, fun: Function) {
    if (this && this.controller) {
      const  _ctrl:any = this.controller.findChild(keys);
      // if (!_ctrl) return;
      _ctrl.valueChange.subscribe(change => {
        fun(change);
      });
    }
  }
  
  @Provide()
  getDataItem(keys:string, parentKey?: string) {
    if (parentKey) {
      const sheet = this.dataItems.find(res => {
        return res.code === parentKey;
      });
      if (sheet && sheet.subSchema) {
        return sheet.subSchema.properties.find(res => res.code === keys);
      }
    } else {
      return this.dataItems.find(res => res.code === keys);
    }
  }


  render(h: Function) {
    return super.render(h, false);
  }
}
</script>


<style lang="less" scoped>

/deep/.ant-select-selection__rendered {
  overflow-x: hidden;
}
</style>