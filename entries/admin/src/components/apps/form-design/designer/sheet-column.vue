
<template>
  <td v-if="isEntry" class="entry"></td>

  <td
    class="col" 
    v-else-if="control" 
    :tabindex="10" 
    @click="onClick"
    @keyup.46="onDelete" 
    @keydown.ctrl.67.stop.prevent="onCtrlC"
    @keydown.ctrl.86.stop.prevent="onCtrlV"
  >

    <div class="title">{{ label }}</div>
    <div class="control">
      <base-control :control="control"></base-control>
    </div>

    <div class="icon-copy" @click.stop="onCopy($event)">
      <i class="icon aufontAll h-icon-all-paste"></i>
    </div>

    <div class="icon-delete" @click="onDelete($event)">
      <i class="icon aufontAll h-icon-all-delete-o"></i>
    </div>

  </td>

  <td v-else>
    <div class="empty-item">
      <template v-if="index === -2">从左侧拖拽来添加字段</template>
    </div>
  </td>
</template>


<script lang='ts'>
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import "@/directives/drag";
import { H3Draggable, H3Droppable } from "@/directives/drag";

// import { FormControl, FormControlType, ControlOptions, InputOptions } from '@/components/apps/form-design/typings';
import { FormControl, FormControlType, DataItem,FormSheet,FormSheetColumn } from "../typings";

import * as ControlFactory from "../typings/control-factory";
import BaseControl from "./base-control.vue";
// import BaseControl from "./base-control-mobile.vue";

const prefix = "dataitem-parent-";

const empty_key = ".";

@Component({
  name: "sheet-column",
  components: {
    BaseControl
  }
})
export default class SheetColumn extends Vue
  implements H3Draggable, H3Droppable {
  @Prop()
  readonly index!: number;

  @Prop()
  readonly control!: FormControl;

  @Prop()
  readonly parentControl!: FormSheet;

  private _moveIndex?: number;

  get id(){
    return `${this.parentControl.key}_${this.control.key}`;
  }

  @Inject()
  emitControlSelect!: Function;

  @Inject()
  emitDataItemAdd!: (item: DataItem) => void;

  /**
   * 拖动从主表移入子表时，需要清除显示空的定时器
   */
  @Inject()
  clearParentShowEmptyTask !: () => void;

  get isEntry() {
    return this.control && this.control.key === empty_key;
  }

  get label() {
    if (!this.control || !this.control.options) {
      return "";
    }

    let name = this.control.options.name;
    const name_i18n = this.control.options.name_i18n;
    if (name_i18n) {
      // const map = JSON.parse(name_i18n);
      const map = name_i18n;
      const locale = this.$i18n.locale;
      if (map[locale]) {
        name = map[locale];
      }
    }
    
    return name;
  }


  onDragstart(evt: DragEvent) {
    evt.stopPropagation();
    const transfer = evt.dataTransfer;
    if (!transfer) {
      return;
    }
    transfer.setData("control", this.control.key);
    transfer.setData("control-key-" + this.control.key, "");
    transfer.setData(prefix + this.parentControl.key, "");
  }

  onDragover(evt: DragEvent) {
    evt.stopPropagation();

    if(this.clearParentShowEmptyTask){
      this.clearParentShowEmptyTask();
    }

    const transfer = evt.dataTransfer;

    if (
      !transfer ||
      !transfer.types.some(t => t === "block" || t === "control")
    ) {
      return;
    }

    let checkParent = true;

    if (transfer.types.indexOf("block") > -1) {
      let temp = transfer.types.find(t => t.indexOf("control-type-") > -1);
      if (temp) {
        checkParent = false;
        const type = Number(temp.substr(temp.lastIndexOf("-") + 1));
        if (type >= 90 || type === FormControlType.ApprovalOpinion) {
          return;
        }
      }
    } else {
      if (this.control) {
        let temp = "control-key-" + this.control.key.toLowerCase();
        if (transfer.types.indexOf(temp) > -1) {
          return;
        }
      }
    }

    if (checkParent) {
      let temp = transfer.types.find(t => t.indexOf(prefix) > -1);
      if (!temp) {
        return;
      }

      const code = temp.substr(temp.lastIndexOf("-") + 1);
      const parentKey = this.parentControl.key.toLowerCase();
      if (code !== parentKey) {
        return;
      }
    }

    this.$el.classList.add('entry');

    let idx = this.computeIndex(evt);

    if (idx > -1) {
      (this.$parent as any).setHideEmptyTask();

      if (this.control.key !== empty_key) {
        const emptyIndex = (this.$parent as any).findColumnIndex(empty_key);
        if(emptyIndex > -1 && emptyIndex < idx){
          idx--;
        }
        console.log('onDragover',this._moveIndex,idx);
        if (this._moveIndex !== idx){
          this._moveIndex = idx;
          (this.$parent as any).setShowEmptyTask(idx);
        }
      }

    }

    evt.preventDefault();

  }

  onDragleave() {
    this._moveIndex = undefined;
    this.$el.classList.remove("entry");
  }

  onDrop(evt: DragEvent) {
    evt.stopPropagation();

    this.$el.classList.remove("entry");

    const transfer = evt.dataTransfer;
    if (!transfer) {
      return;
    }

    const isControl = transfer.types.indexOf("control") > -1;

    if (isControl) {
      (this.$parent as any).setHideEmptyTask(true);
      const key = transfer.getData("control");
      if (!key) {
        return;
      }

      let idx = this.computeIndex(evt);
      this.emitColumnMove(idx, key);
    } else {
      const json = transfer.getData("block");
      if (!json) {
        return;
      }
      
      (this.$parent as any).clearHideEmptyTask();

      const block = JSON.parse(json);
      const blockType = transfer.getData("block-type");

      this.addControl(blockType, block);
    }
  }

  computeIndex(evt: DragEvent): number {
    if (this.index < 0 || this.isEntry) {
      return this.index;
    }

    let offsetLeft = evt.offsetX;
    let ele = evt.srcElement as HTMLElement;

    if (ele) {
      while (ele.tagName !== "TD") {
        if (!ele.parentElement) {
          break;
        }
        ele = ele.parentElement;
      }
    }

    const newlineThreshold = ele.offsetHeight / 2;

    if (offsetLeft < newlineThreshold) {
      return this.index;
    }

    return this.index + 1;
  }

  addControl(blockType: string, block: any) {
    let control: FormControl;
    if (blockType === "control") {
      const dataItem = ControlFactory.buildDataItemOf(
        block,
        this.parentControl.key
      );
      this.emitDataItemAdd(dataItem);

      control = ControlFactory.buildControlOf(dataItem, block.type);
    } else {
      control = ControlFactory.buildControlOf(block);
    }

    (control as FormSheetColumn).width = ControlFactory.getSheetColumnWidth(control.type);

    if (control.type === FormControlType.RelevanceForm) {
      control.options.schemaCode = block.relativeCode || "";
    }

    // if ((this.$parent as any).replaceEmpty(control)) {
    //   this.emitControlSelect(control);
    // }else{
    //   this.emitColumnAdd(this.index, control);
    // }
    (this.$parent as any).hideEmptyCol();
    this.emitColumnAdd(this.index, control);
    this.emitControlSelect(control);
  }

  // onControlDrop(index: number, controlType: FormControlType) {
  //   const _this = this;
  //   const _parent = this.$parent as any;

  //   if (this.openDataItemSelectModal) {
  //     this.openDataItemSelectModal(controlType, this.parentControl.key).then(
  //       (item: DataItem) => {
  //         _parent.setHideEmptyTask(true);
  //         const control = {
  //           type: controlType,
  //           key: item.code,
  //           options: ControlFactory.buildControlOptions(controlType)
  //         };
  //         control.options.name = item.name;
  //         _this.emitColumnAdd(index, control);
  //       },
  //       () => {
  //         _parent.setHideEmptyTask(true);
  //       }
  //     );
  //   }
  // }

  onDelete(evt: KeyboardEvent | MouseEvent) {
    evt.stopPropagation();

    const _this = this;
    if ((evt as KeyboardEvent).key) {
      _this.emitColumnDelete(_this.control.key);
    } else {
      this.$confirm({
        title: this.$t("languages.Apps.FormDesignPage.DeleteControlTitle", {
          name: this.control.options.name
        }).toString(),
        okText: this.$t("languages.Apps.Ok").toString(),
        cancelText: this.$t("languages.Apps.Cancel").toString(),
        onOk() {
          _this.emitColumnDelete(_this.control.key);
        }
      });
    }
  }

  onCopy(){
    this.coping(this.control);
  }

  coping(control : FormControl){
    const copy = ControlFactory.copyControlFrom(control);

    const dataItem = ControlFactory.buildDataItemOf(
        {
        type: copy.type,
        code: copy.key,
        name: copy.options.name
      },
        this.parentControl.key
      );
    this.emitDataItemAdd(dataItem);
    this.emitColumnAdd(this.index + 1, copy);
    this.emitControlSelect(copy);
  }

  onCtrlC(){
    (this.$parent as any).ctrlCKey = this.control.key;
  }
  
  onCtrlV(){
    const copyKey = (this.$parent as any).ctrlCKey;
    if(!copyKey){
      return;
    }

    (this.$parent as any).ctrlCKey = '';

    const col = this.parentControl.columns.find(c => c.key === copyKey);

    if(!col){
      return;
    }

    this.coping(col);
  }

  onClick(evt: Event) {
    evt.stopPropagation();
    this.emitControlSelect(this.control);
  }

  emitColumnAdd(index: number, control: FormControl) {
    this.$emit("column-add", {
      index,
      control
    });
  }

  emitColumnMove(index: number, controlKey: string) {
    this.$emit("column-move", {
      index,
      controlKey
    });
  }

  emitColumnDelete(controlKey: string) {
    this.$emit("column-delete", controlKey);
  }

  // @Watch('$i18n.locale')
  // onLanguageChange() {
    
  //   this.globalName = this.fieldName();
  // }
}
</script>


<style lang="less" scoped>
div.title {
  background-color: #fafafa;
  height: 38px;
  padding: 8px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid #d9d9d9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

div.control {
  padding: 4px 8px;

  & > textarea, & > .address textarea{
    height: 30px;
  }

  & > .ant-btn {
    font-size: 12px;
  }

}
div.empty-item{
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 78px;
}

td.col{
  cursor:move;
}
</style>
