
<template>
  <div class="designer">
    <div :class="warpCls">
      <div :class="`${warpCls}-header`"></div>
      <div :class="`${warpCls}-content`">
        <template v-for="(keys,index) in layout">
          <control-container
            :key="index"
            :index="index"
            :controlKeys="keys"
            :controls="controls"
            @control-add="onControlAdd"
            @control-move="onControlMove"
            @control-delete="onControlDelete"
            v-h3-drop
          ></control-container>
        </template>

        <control-container
          :index="-2"
          @control-add="onControlAdd"
          v-h3-drop
        ></control-container>
      </div>
    </div>
    <div class="designer-drag-tips" v-if="showDragTips">
      <div>
        <img src="~@/assets/images/drag-tips.svg" />
        <p>请从左侧拖入控件</p>
      </div>
    </div>
  </div>
</template>


<script lang='ts'>
import {
  Component,
  Vue,
  Prop,
  Emit,
  Watch,
  Provide
} from "vue-property-decorator";
//import { namespace } from 'vuex-class';

import ControlContainer from "./control-container.vue";
import { FormControl, DataItem, FormControlType } from "../typings";

import * as ControlFactory from "../typings/control-factory";

import { Layouter } from "./layouter";

const empty_Key = ".";

@Component({
  name: "designer",
  components: {
    ControlContainer
  }
})
export default class Designer extends Vue implements Layouter {
  @Prop()
  readonly controls!: { [key: string]: FormControl };

  @Prop()
  readonly initLayout!: string[][];

  @Prop()
  readonly device!: string;

  @Prop() warpCls!: string;

  @Prop() formData:any;

  @Prop() showDragTips!:boolean;

  selected: any = "";

  ctrlCKey = '';

  created() {
    // debugger;
  }

  // get isShowTips() {
  //   debugger;
  //   this.controls
  // }

  @Provide()
  isSelected(control: FormControl) {
    const selected = this.selected;
    if (!selected) {
      return false;
    }
    return (
      selected.key === control.key && selected.parentKey === control.parentKey
    );
  }

  @Provide()
  isMobile() {
    return this.device === "mobile";
  }

  @Provide()
  layoutTypeFn() {
    this.$set(this.formData,'layoutTypeFn', true); //请勿删除 ---作用为触发计算属性重新计算
    return localStorage.getItem('layoutType') === 'vertical'; //使用本地缓存 防止上下布局发布时渲染数据先左右布局
  }

  @Provide()
  setCtrlCKey(key: string){
    this.ctrlCKey = key;
  }

  @Provide()
  getCtrlCKey(){
    return this.ctrlCKey;
  }

  isTitle(code: string) {
    return (
      this.controls &&
      this.controls[code] &&
      this.controls[code].type === FormControlType.Title
    );
  }

  layout: string[][] = [];

  colsLimit = 3;

  private _showTimeoutRef: any;

  private _hideTimeoutRef: any;

  private layoutSnapshot: any[] | null = null;


  getLayout() {
    return this.layout;
  }

  mounted(){
    console.log(this)
  }

  isSheet(item: any) {
    return (
      item.length === 1 &&
      this.controls[item[0]] &&
      this.controls[item[0]].type === FormControlType.Sheet
    );
  }

  // get showTip() {
  //   debugger;
  //   this.layout
  //   return false;
  // }

  @Watch("initLayout")
  setInitLayout(val: any) {
    this.layout = val;
  }

  onControlAdd(add: {
    row: number;
    col: number;
    newline: boolean;
    control: FormControl;
    copyKey?: string
  }) {
    //console.log('onControlAdd ' + JSON.stringify(add));
    //必须在rearrange之前
    this.emitControlAdd(add.control,add.copyKey);
    this.rearrange(add.row, add.col, add.newline, add.control.key);
  }

  onControlMove(move: {
    row: number;
    col: number;
    newline: boolean;
    controlKey: string;
  }) {
    let [row, col] = this.findIndex(move.controlKey);
    if ((row === -1 && col === -1) || (row === move.row && col === move.col)) {
      return;
    }

    let cols = this.layout[row] as string[];
    cols.splice(col, 1);

    this.rearrange(move.row, move.col, move.newline, move.controlKey);
  }

  rearrange(row: number, col: number, newline: boolean, controlKey: string) {
    // console.log(`rearrange ${row},${col},${newline}`);
    const layout = this.layout;

    if (row === -2) {
      if (layout.length > 0 && layout[layout.length - 1].length === 0) {
        layout.splice(layout.length - 1, 1, [controlKey]);
      } else {
        layout.push([controlKey]);
      }
      return;
    }

    if (row === -1) {
      layout.splice(0, 0, [controlKey]);
    } else {
      if (newline) {
        layout.splice(row, 0, [controlKey]);
      } else {
        let cols = layout[row] as string[];
        if (
          !cols ||
          (cols.length === 1 &&
            ControlFactory.isFullRow(this.controls[cols[0]].type))
        ) {
          layout.splice(row, 0, [controlKey]);
        } else {
          if (cols.length < this.colsLimit) {
            cols.splice(col, 0, controlKey);
          } else {
            const limit = this.colsLimit - 1;
            const nextline = cols.splice(limit, 1);
            cols.splice(col, 0, controlKey);
            layout.splice(row + 1, 0, nextline);
          }
        }
      }
    }

    layout
      .map((x, i) => (x.length === 0 ? i : -1))
      .filter(i => i !== -1)
      .reverse()
      .forEach(i => layout.splice(i, 1));
  }

  onControlDelete(controlKey: string) {
    let [row, col] = this.findIndex(controlKey);
    //console.log('onControlDelete ' + row + ',' + col);
    if (row === -1 && col === -1) {
      return;
    }

    const cols = this.layout[row] as string[];
    cols.splice(col, 1);

    if (cols.length === 0) {
      this.layout.splice(row, 1);
    }

    this.emitControlDelete(controlKey);
  }

  /**
   * 快照
   */
  snapshot() {
    this.layoutSnapshot = JSON.parse(JSON.stringify(this.layout));
  }

  showEmptyCol(rowIndex: number, colIndex: number, newline: boolean) {
    const key = empty_Key;
    if (!this.controls[key]) {
      this.snapshot();

      this.onControlAdd({
        row: rowIndex,
        col: colIndex,
        newline: newline,
        control: {
          key: key
        } as any
      });
    } else {
      this.onControlMove({
        row: rowIndex,
        col: colIndex,
        newline: newline,
        controlKey: key
      });
    }
  }

  hideEmptyCol() {
    clearTimeout(this._showTimeoutRef);
    if (this.layoutSnapshot) {
      //console.log('DeleteEmptry');
      this.layout = this.layoutSnapshot;
      this.layoutSnapshot = null;
      //delete this.controls[empty_Key];
      //this.emitLayoutChange(this.layoutSnapshot);
      this.emitControlDelete(empty_Key);
    }
  }

  setHideEmptyTask(now = false) {
    clearTimeout(this._hideTimeoutRef);
    if (now) {
      this.hideEmptyCol();
    } else {
      this._hideTimeoutRef = setTimeout(() => this.hideEmptyCol(), 300);
    }
  }

  clearHideEmptyTask() {
    clearTimeout(this._hideTimeoutRef);
  }

  @Provide()
  clearParentShowEmptyTask(){
    clearTimeout(this._showTimeoutRef);
  }

  setShowEmptyTask(rowIndex: number, colIndex: number, full = false) {
    clearTimeout(this._showTimeoutRef);
    this._showTimeoutRef = setTimeout(
      // () => this.showEmptyCol(rowIndex, colIndex, full),
      () => {
        this.showEmptyCol(rowIndex, colIndex, full);
        this.setHideEmptyTask();
      },
      300
    );
  }

  replaceEmpty(control: FormControl) {
    const key = empty_Key;

    let [rowIndex, colIndex] = this.findIndex(key);

    if (rowIndex === -1 && colIndex === -1) {
      return false;
    }

    const row = this.layout[rowIndex];
    this.emitControlAdd(control);
    this.emitControlDelete(key);

    row.splice(colIndex, 1, control.key);

    this.layoutSnapshot = null;
    
    // this.layout.splice(rowIndex, 1, row);
    // this.snapshot();

    return true;
  }

  dispatchMouseUpEvent() {
    const e = document.createEvent("MouseEvents");
    e.initEvent("mouseup", true, true);
    document.dispatchEvent(e);
  }

  selectControl(key: string, parentKey?: string) {}

  findIndex(controlKey: string): [number, number] {
    for (let rowIdx = 0; rowIdx < this.layout.length; rowIdx++) {
      const cols = this.layout[rowIdx] as string[];

      for (let colIdx = 0; colIdx < cols.length; colIdx++) {
        if (cols[colIdx] === controlKey) {
          return [rowIdx, colIdx];
        }
      }
    }

    return [-1, -1];
  }

  replace(rowIndex:number,colIndex:number,key:string){
    const row = this.layout[rowIndex];
    row.splice(colIndex, 1, key);
    this.layout.splice(rowIndex,1,row);
  }

  emitControlAdd(control: FormControl,copyKey?:string) {
    this.$emit("control-add", control,copyKey);
  }

  @Provide()
  emitControlUpdate(key: string, properties: { [key: string]: any }) {
    this.$emit("control-update", key, properties);
  }

  emitControlDelete(controlKey: string) {
    this.$emit("control-delete", controlKey);
  }

  @Provide()
  emitControlSelect(control?: FormControl) {
    this.selected = control;
    this.$emit("control-select", control);
    if(control && this.$el){
    let parentkey = control.parentKey?control.parentKey:''
      if((!parentkey || !/^Sheet/.test(parentkey))) {
        this.$nextTick(()=>{
          const item = this.$el.querySelector(`[id="${control.key}"]`) as HTMLDivElement;
          if(item){
            item.focus();
          }
        });
      }
    }
  }

  @Provide()
  emitDataItemAdd(item: DataItem) {
    this.$emit("dataitem-add", item);
  }

  @Provide()
  emitDataItemDelete(code: string, parentCode?: string) {
    this.$emit("dataitem-delete", code, parentCode);
  }
}
</script>


<style lang="less" scoped>
.designer {
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  .designer-drag-tips {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 290px;
    width: 100%;
    & > div {
      width: 160px;
      p {
        font-size:14px;
        color: rgba(0, 0, 0, 0.65);
        margin-top: 14px;
        font-weight:400;
      }
    }
  }

  & > .web-view {
    flex-grow: 1;
    display: flex;

    & > .web-view-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 0 10px;
    }
  }

  /deep/.h-icon-all-down-o{
    font-size: 12px;
  }

}

/deep/.ant-radio-wrapper{
  white-space:pre-wrap;
}

</style>
