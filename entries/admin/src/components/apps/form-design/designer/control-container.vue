
<template>
  <a-row
    type="flex"
    justify="center"
    align="middle"
  >
    <template v-for="(key) in controlKeys">
      <control-item
        v-if="isTitle(key)"
        :key="key"
        :control="controls[key]"
        :span="span"
        :class="{ selected : isSelected(controls[key]) }"
      ></control-item>

      <control-item
        v-else
        :key="key"
        :control="controls[key]"
        :span="span"
        :class="{ selected : isSelected(controls[key]) }"
        @delete="emitControlDelete(key)"
        @copy="onCopy"
        v-h3-drag
      ></control-item>
    </template>
  </a-row>
</template>

<script lang='ts'>
import {
  Component,
  Vue,
  Prop,
  Emit,
  Watch,
  Provide,
  Inject
} from "vue-property-decorator";

import "@/directives/drag";
import { H3Droppable } from "@/directives/drag";

// import { FormControl, FormControlType, ControlOptions, InputOptions } from '@/components/apps/form-design/typings';
import { FormControl, FormControlType, DataItem } from "../typings";

import * as ControlFactory from "../typings/control-factory";

import ControlItem from "./control-item.vue";

import * as dataitemStore from "../stores/data-items.store-helper";

import { Layouter } from "./layouter";

const css = ["ant-col", "ant-row", "ant-row-flex"];

@Component({
  name: "control-container",
  components: {
    ControlItem
  }
})
export default class ControlContainer extends Vue implements H3Droppable {
  @Prop()
  controlKeys!: string[];

  @Prop()
  readonly controls!: { [key: string]: FormControl };

  @Prop()
  index!: number;

  private _coordinate: [number, number] | null = null;

  @Inject()
  emitDataItemAdd!: (item: DataItem) => void;

  @Inject()
  emitControlSelect!: (control?: FormControl) => void;

  get span() {
    const _parent = this.$parent as any;
    return _parent.device === "mobile" ? 24 : 24 / this.controlKeys.length;
  }

  // get controls() {
  //   if (!this.controlKeys) {
  //     return [];
  //   }
  //   return this.controlKeys.map(k => this.$parent.$props.controls[k]);
  // }

  @Inject()
  isSelected!: (control: FormControl) => boolean;

  isSheet(key: string) {
    const control = this.controls[key];
    return control.type === FormControlType.Sheet;
  }

  isTitle(key: string) {
    const control = this.controls[key];
    return control.type === FormControlType.Title;
  }

  get layouter() {
    return (this.$parent as any) as Layouter;
  }

  computeCoordinate(
    evt: DragEvent,
    controlKey?: string
  ): [number, number, boolean] {
    if (
      !this.controlKeys ||
      !this.controlKeys.length ||
      !evt.srcElement ||
      !evt.dataTransfer ||
      (this.controlKeys.length === 1 && this.controlKeys[0] === ".")
    ) {
      return [this.index, 0, true];
    }

    let [offsetLeft, offsetTop] = this.computeOffset(evt);

    const el = this.$el as HTMLElement;

    const newlineThreshold = el.offsetHeight / 4;

    if (offsetTop <= newlineThreshold) {
      return [this.index, 0, true];
    }

    if (el.offsetHeight - offsetTop <= newlineThreshold) {
      return [this.index + 1, 0, true];
    }

    let type = evt.dataTransfer.types.find(
      x => x.indexOf("control-type-") > -1
    );

    if (
      type &&
      ControlFactory.isFullRow(Number(type.substr(type.lastIndexOf("-") + 1)))
    ) {
      return [this.index + 1, 0, true];
    }

    type = evt.dataTransfer.types.find(x => x.indexOf("dataitem-type-") > -1);
    if (type) {
      const ct = ControlFactory.mapToControlType(
        Number(type.substr(type.lastIndexOf("-") + 1))
      );
      if (ControlFactory.isFullRow(ct)) {
        return [this.index + 1, 0, true];
      }
    }

    let add = controlKey && this.controlKeys.indexOf(controlKey) > -1 ? 0 : 1;
    let childWidth = el.offsetWidth / (this.controlKeys.length + add);

    let col = Math.floor(offsetLeft / childWidth);
    return [this.index, col, false];
  }

  computeOffset(evt: DragEvent): [number, number] {
    let offsetLeft = evt.offsetX;
    let offsetTop = evt.offsetY;
    let ele = evt.srcElement as HTMLElement;

    if (ele) {
      // 当ant-row是flex布局时，偏移父节点是最外层的div.layout
      while (true) {
        if (
          Array(ele.classList.length)
            .fill(0)
            .some((x, i) => css.indexOf(ele.classList[i]) > -1)
        ) {
          break;
        }

        offsetLeft += ele.offsetLeft;
        offsetTop += ele.offsetTop;
        ele = ele.offsetParent as HTMLElement;
      }

      const el = this.$el as HTMLElement;
      offsetLeft += ele.offsetLeft - el.offsetLeft;
      offsetTop += ele.offsetTop - el.offsetTop;
    }

    return [offsetLeft, offsetTop];
  }

  onDragover(evt: DragEvent) {
    const transfer = evt.dataTransfer;

    if (
      !transfer ||
      !transfer.types.some(t => t === "block" || t === "control")
    ) {
      return;
    }

    const hasKey = this.controlKeys && this.controlKeys.length;
    const onlyOne = hasKey && this.controlKeys.length === 1;

    if (onlyOne && this.controls[this.controlKeys[0]].type === FormControlType.Title) {
      return;
    }

    if (transfer.types.some(t => t.indexOf("dataitem-parent-") > -1)) {
      return;
    }

    const isControl = transfer.types.indexOf("control") > -1;

    if (isControl) {
      if (onlyOne) {
        // dataTransfer会自动转为小写
        const temp = "control-key-" + this.controlKeys[0].toLowerCase();
        if (transfer.types.indexOf(temp) > -1) {
          return;
        }
      }
    } else {
      let temp = transfer.types.find(x => x.indexOf("control-type-") > -1);

      if (temp) {
        let type = Number(temp.substr(temp.lastIndexOf("-") + 1));

        if (type >= 100 && type < 200) {
          const code = ControlFactory.mapToSystemDataItemCode(type);

          const has = dataitemStore
            .getDataItems(this)
            .some(
              (x: any) => x.isSystem && x.used === false && x.code === code
            );

          if (has === false) {
            return;
          }
        }
      }
    }

    this.layouter.setHideEmptyTask();

    // 如果在空行之上
    if (onlyOne && this.controlKeys[0] === ".") {
      evt.preventDefault();
      return;
    }

    let [row, col, full] = this.computeCoordinate(evt, ".");
    // console.log(
    //   `over comput ${this.index}` +
    //     row +
    //     "," +
    //     col +
    //     " coord " +
    //     (this._coordinate
    //       ? this._coordinate[0] + "," + this._coordinate[1]
    //       : "")
    // );

    // 如果在空列之上
    if (row === this.index && hasKey && this.controlKeys[col] === ".") {
      evt.preventDefault();
      return;
    }

    if (
      !this._coordinate ||
      row !== this._coordinate[0] ||
      col !== this._coordinate[1]
    ) {
      this._coordinate = [row, col];
      // console.log('over render ---------- this ' + this.index + ' ------------||||' + row + ',' + col);
      this.layouter.setShowEmptyTask(row, col, full);
    }

    evt.preventDefault();
  }

  onDragleave() {
    this._coordinate = null;
  }

  onDrop(evt: DragEvent) {
    if (this.index === -2) {
      this._coordinate = null;
    }

    const transfer = evt.dataTransfer;
    if (!transfer) {
      return;
    }

    const isControl = transfer.types.indexOf("control") > -1;

    if (isControl) {
      this.layouter.hideEmptyCol();
      const key = transfer.getData("control");
      if (!key) {
        return;
      }

      let [row, col, newline] = this.computeCoordinate(evt, key);
      this.emitControlMove(row, col, newline, key);
    } else {
      const json = transfer.getData("block");
      if (!json) {
        return;
      }

      this.layouter.clearHideEmptyTask();

      const block = JSON.parse(json);
      const blockType = transfer.getData("block-type");

      //let [row, col, newline] = this.computeCoordinate(evt);
      //console.log('drop coord ' + row + ',' + col + ',' + newline);
      this.buildControlOf(blockType, block);
    }
  }

  buildControlOf(blockType: string, block: any) {
    let control: FormControl;
    let dataItem: DataItem | undefined;

    if (blockType === "control") {
      const controlType = block.type;

      // 只有基础控件和子表需要选择数据项
      if (controlType >= 90 && controlType !== FormControlType.Sheet) {
        control = ControlFactory.buildControl(block);
      } else {
        dataItem = ControlFactory.buildDataItemOf(block);
        control = ControlFactory.buildControlOf(dataItem, controlType);
      }
    } else {
      control = ControlFactory.buildControlOf(block);
    }

    if (control.type === FormControlType.RelevanceForm) {
      control.options.schemaCode = block.relativeCode || '';
    }

    if (this.layouter.replaceEmpty(control)) {
      if (dataItem !== undefined) {
        this.emitDataItemAdd(dataItem);
        this.emitControlSelect(control);
      }
    }else{
      
    }
  }
  
  onCopy(key: string){
    const control = this.controls[key];
    
    const copy = ControlFactory.copyControlFrom(control);

    // let dataItem: DataItem | undefined;
    // // 只有基础控件和子表需要选择数据项
    // if (!(control.type >= 90 && control.type !== FormControlType.Sheet)) {
    //   dataItem = ControlFactory.buildDataItemOf({
    //     type: copy.type,
    //     code: copy.key,
    //     name: copy.options.name
    //   });

    //   if(copy.type === FormControlType.RelevanceForm){
    //     dataItem.relativeCode = copy.options.schemaCode;
    //   }
    // }

    this.emitControlAdd(this.index + 1,0,true,copy,key);
    this.emitControlSelect(copy);
    // if (dataItem !== undefined) {
    //   this.emitDataItemAdd(dataItem);
    //   this.emitControlSelect(copy);
    // }
  }

  emitControlAdd(
    row: number,
    col: number,
    newline: boolean,
    control: FormControl,
    copyKey?:string
  ) {
    this.$emit("control-add", {
      row: row,
      col: col,
      newline: newline,
      control,
      copyKey
    });
  }

  emitControlMove(
    row: number,
    col: number,
    newline: boolean,
    controlKey: string
  ) {
    this.$emit("control-move", {
      row: row,
      col: col,
      newline: newline,
      controlKey
    });
  }

  emitControlDelete(controlKey: string) {
    this.$emit("control-delete", controlKey);
  }
}
</script>


<style lang="less" scoped>
.ant-row,
.ant-row-flex {
  min-height: 52px;
  flex-shrink: 0;

  &:not(.group) {
    border-bottom: 1px dashed rgba(232, 232, 232, 1);
  }
}

.ant-row-flex:last-child {
  flex-grow: 1;
  flex-shrink: 1;
  border-bottom: none;
  min-height: 156px;
}
.mobile {
  .ant-row-flex {
    min-height: 45px;
    &:not(.group) {
      border-bottom: none;
    }
  }
}

.mobile > .ant-row-flex,
.mobile .ant-col {
  min-height: 45px;
  border: none;
}
</style>
