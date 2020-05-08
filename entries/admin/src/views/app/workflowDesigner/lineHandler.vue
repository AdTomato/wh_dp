<template>
  <span
    class="line-drag-point"
    :style="`left: ${currentPosition.x}px;top: ${currentPosition.y}px`"
  ></span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { H3Draggable } from '@/directives/drag';
import { LINE } from '@/typings/line';
import Bus from '@/utils/bus';

@Component({
  name: "LineHandler"
  })
export default class LineHandler extends Vue implements H3Draggable {
  @Prop() position: any;
  @Prop() index: any;
  currentPosition: LINE.handlerPoint = this.position;

  mounted() {
    this.currentPosition = this.position;
    Bus.$on('setPosition', (position: LINE.handlerPoint) => {
      this.currentPosition.x = position.x;
      this.currentPosition.y = position.y;
    });
  }

  beforeDestroy() {
    Bus.$off('setPosition');
  }

  onDragstart(evt: DragEvent) {
    Bus.$emit('startDragHandler', evt, this.position, this.index);
  }
}
</script>

<style lang="less">
.line-drag-point {
  display: block;
  width: 8px;
  height: 8px;
  position: absolute;
  z-index: 999;
  border: 1px solid #1890FF;
  background-color: #E6F7FF;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
</style>
