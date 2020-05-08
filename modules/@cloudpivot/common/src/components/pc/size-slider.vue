


<template>
  <div class="h3-size-slider">
    <span
      v-show="left"
      class="h3-size-slider__sider h3-size-slider__sider-left"
      @mousedown="e => onMousedown(e,'left')"
    ></span>

    <span
      v-show="right"
      class="h3-size-slider__sider h3-size-slider__sider-right"
      @mousedown="e => onMousedown(e,'right')"
    ></span>

    <span
      v-show="top"
      class="h3-size-slider__sider h3-size-slider__sider-top"
      @mousedown="e => onMousedown(e,'top')"
    ></span>

    <span
      v-show="bottom"
      class="h3-size-slider__sider h3-size-slider__sider-bottom"
      @mousedown="e => onMousedown(e,'bottom')"
    ></span>

    <slot></slot>
  </div>
</template>


<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";


@Component({
  name: "h3-size-slider",
  components: {}
})
export default class H3SizeSlider extends Vue {
  @Prop({
    default: false
  })
  left!: boolean;

  @Prop({
    default: false
  })
  right!: boolean;

  @Prop({
    default: false
  })
  top!: boolean;

  @Prop({
    default: false
  })
  bottom!: boolean;

  @Prop({
    default: 1
  })
  minWidth!: number;

  @Prop({
    default: -1
  })
  maxWidth!: number;

  @Prop({
    default: 1
  })
  minHeight!: number;

  @Prop({
    default: -1
  })
  maxHeight!: number;

  /**
   * 原点
   */
  base: number | null = null;

  sum = 0;

  isHorizontal(direction: string) {
    return direction === "left" || direction === "right";
  }

  isReverse(direction: string) {
    return direction === "left" || direction === "top";
  }

  onMousedown(evt: MouseEvent, direction: string) {
    evt.preventDefault();

    const horizontal = this.isHorizontal(direction);

    const _el = this.$el as HTMLElement;

    this.base = horizontal ? evt.screenX : evt.screenY;
    this.sum = horizontal ? _el.offsetWidth : _el.offsetHeight;

    const sider = evt.target as HTMLSpanElement;
    sider.classList.add("active");
    this.$el.classList.add("resizing");

    const bodyCursor = document.body.style.cursor;

    const moveFn = (e: MouseEvent) => {
      e.preventDefault();

      this.onMousemove(e, direction);
    };

    const upFn = (e: MouseEvent) => {
      e.preventDefault();
      
      this.base = null;
      this.sum = 0;

      sider.classList.remove("active");
      this.$el.classList.remove("resizing");

      document.body.style.cursor = bodyCursor;

      document.removeEventListener("mousemove", moveFn);
      document.removeEventListener("mouseup", upFn);

      this.$emit("resizeEnd");
    };

    document.body.style.cursor = horizontal ? "e-resize" : "n-resize";

    document.addEventListener("mousemove", moveFn);
    document.addEventListener("mouseup", upFn);

    this.$emit("resizeStart");
  }

  onMousemove(evt: MouseEvent, direction: string) {
    if (this.base === null) {
      return;
    }

    const horizontal = this.isHorizontal(direction);

    const move = horizontal ? evt.screenX : evt.screenY;
    const offset = this.isReverse(direction)
      ? this.base - move
      : move - this.base;
    this.base = move;

    if (horizontal) {
      let width = this.sum + offset;
      if (width < this.minWidth) {
        width = this.minWidth;
      } else if (this.maxWidth !== -1 && width > this.maxWidth) {
        width = this.maxWidth;
      }

      this.sum = width;
      this.$emit("resize", {
        width
      });
    } else {
      let height = this.sum + offset;
      if (height < this.minHeight) {
        height = this.minHeight;
      } else if (this.maxHeight !== -1 && height > this.maxHeight) {
        height = this.maxHeight;
      }

      this.sum = height;
      this.$emit("resize", {
        height
      });
    }
  }
}
</script>


<style lang="less" scoped>
@size: 3px;

@offset : @size / 2 * -1;

.h3-size-slider {
  position: relative;

  &__sider {
    cursor: e-resize;
    display: inline-block;
    position: absolute;
    user-select: none;

    z-index: 1;

    &:hover,
    &.active {
      width: @size !important;
      background-color: @primary-color !important;
    }

    &-left,
    &-right {
      top: 0;
      width: @size;
      height: 100%;

      &:hover,
      &.active {
        cursor: e-resize;
      }
    }

    &-left {
      left: @offset;
    }

    &-right {
      right: @offset;
    }

    &-top,
    &-bottom {
      left: 0;
      height: @size;
      width: 100%;
      
      &:hover,
      &.active {
        cursor: n-resize;
      }

    }

    &-top {
      top: @offset;
    }

    &-bottom {
      bottom: @offset;
    }
  }
}

</style>
