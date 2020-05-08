
<template>
  <div :class="{ long : isDataItem}" :title="text">
    <i
      class="icon aufontAll"
      v-if="options.icon"
      :class="[options.icon]"
    ></i>
    {{ text }}
  </div>
</template>


<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

import "@/directives/drag";
import { H3Draggable } from "@/directives/drag";

@Component({
  name: "control-block"
})
export default class ControlBlock extends Vue implements H3Draggable {
  @Prop()
  options!: any;

  @Prop()
  isDataItem!: boolean;

  get text() {
    const opts = this.options;

    let name = opts.name;

    if (opts.name_i18n) {
      const locales = JSON.parse(opts.name_i18n);
      if (locales[this.$i18n.locale]) {
        name = locales[this.$i18n.locale];
      }
    }

    if (this.isDataItem && opts.code && opts.code !== opts.name) {
      return `${name} [${opts.code}]`;
    }

    return name;
  }

  dispatchMouseUpEvent() {
    const e = document.createEvent("MouseEvents");
    e.initEvent("mouseup", true, true);
    document.dispatchEvent(e);
  }

  onDragstart(evt: DragEvent) {
    this.dispatchMouseUpEvent();

    // 添加拖动的样式
    (evt.target as any).style.background = "#E8FCF4";

    if (evt.dataTransfer) {
      evt.dataTransfer.setData("block", JSON.stringify(this.options));
      evt.dataTransfer.setData(
        "block-type",
        this.isDataItem ? "data-item" : "control"
      );
      if (this.isDataItem) {
        evt.dataTransfer.setData("dataitem-type-" + this.options.type, "");
        if (this.options.parentCode) {
          evt.dataTransfer.setData(
            "dataitem-parent-" + this.options.parentCode,
            ""
          );
        }
      } else {
        evt.dataTransfer.setData("control-type-" + this.options.type, "");
      }
    }
  }
}
</script>


<style lang="less" scoped>
div {
  display: inline-block;
  align-items: center;
  font-size: 12px;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  width: 98px;
  height: 30px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px dashed #d1d1d1;
  padding-left: 8px;
  cursor: move;
  margin-right: 8px;
  margin-bottom: 8px;
  line-height: 29px;
}

div.long {
  display: block;
  margin-bottom: 8px;
  width: calc(100% - 8px);
  height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

div > i {
  font-size: 12px;
  width: 12px;
  height: 12px;
  margin-right: 3px;
}

div.dragging,
div:hover {
  &:not(.disabled) {
    color: @primary-color;
    border-color: @primary-color;
  }
}
div.disabled {
  cursor: not-allowed;
  color: #d1d1d1;
}
</style>
