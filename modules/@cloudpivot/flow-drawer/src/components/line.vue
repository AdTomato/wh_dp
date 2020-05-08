<template>
  <svg class="lines-instance">
    <!-- 基础定义 -->
    <defs>
      <filter
        x="0"
        y="0"
        width="1"
        height="1"
        id="solid"
      >
        <feFlood flood-color="white"></feFlood>
        <feComposite in="SourceGraphic"></feComposite>
      </filter>
    </defs>
    <!-- 每条存储线条的渲染绘制 -->
    <template v-for="(line,index) in lines">
      <!-- 线条 -->
      <path
        :key="`path-${index}`"
        :stroke="lineColor"
        :d="line.Path"
        :stroke-dasharray="(line.formula || line.utilizeElse) ? '5,5' : ''"
        fill="none"
        stroke-width="1"
      ></path>
      <!-- 箭头 -->
      <polygon
        :key="`arrow-${index}`"
        :fill="lineColor"
        fill-opacity="1"
        :stroke="lineColor"
        stroke-width="1"
        :points="line.Arrow"
      ></polygon>
      <!-- 文字 -->
      <text
        :key="`text-${index}`"
        v-if="line.text"
        :x="line.textPosition.x - line.text.length * 5"
        :y="line.textPosition.y + 5"
        filter="url(#solid)"
      >{{ line.text }}</text>
    </template>
  </svg>
</template>

<script lang="ts">
import {
  Component, Vue, Prop
} from 'vue-property-decorator';
import Line from '../class/Line';

@Component({
  name: 'LinesInstance',
})

export default class LinesInstance extends Vue {
  @Prop() lines!: Line[];
  @Prop({ default: '#3C9600' }) lineColor!: string; /* 连接线颜色 */
}
</script>

<style lang="less">
.lines-instance {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  &:not(:root) {
    overflow: visible;
    // z-index: 10;
  }
  text {
    font-size: 14px;
    line-height: 1;
  }
}
</style>
