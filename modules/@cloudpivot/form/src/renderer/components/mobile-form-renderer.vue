
<script lang='ts'>
import { Component, Vue, Prop, Provide } from "vue-property-decorator";

import {
  FormControl,
  FormControlType,
  RendererLayoutControl,
  RendererFormControl,
  RendererControl
} from "../typings";

import ControlAdapter from "./mobile/control-adapter.vue";
import FormCol from "./mobile/form-col.vue";
import FormRow from "./mobile/form-row.vue";

import numberFilter from "./number-filter";

import FormTabs from "./layout/mobile-form-tabs.vue";

import TabsPane from "./layout/pc-form-tabs-pane.vue"

import FormGroup from "./layout/form-group.vue";

import { FormRenderer } from "./form-renderer";

import { H3SwiperItem } from "h3-mobile-vue";

@Component({
  name: "mobile-form-renderer",
  components: {
    ControlAdapter,
    FormCol,
    FormRow,
    FormGroup,
    FormTabs,
    H3SwiperItem,
    TabsPane
  }
})
export default class MobileFormRenderer extends FormRenderer {
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
  emitScrollTop(top : number){
    this.$emit('scrollTop', top)
  }
  
  @Provide()
  emitScrollLock(lock : boolean){
    this.$emit('scrollLock', lock)
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
    return super.render(h, true);
  }
}
</script>

<style lang="less" scoped>
/deep/.h3-panel {
  & > .h3-panel-header {
    background-color: #f8f8f8;
    border-bottom: 1px solid #eeeeee;
  }

  & > .h3-panel-body{
    // overflow-x: hidden;
  }
}
</style>

