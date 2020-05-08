


<template>
  <div class="h3-size-rectangle" :class="{ active: active }">
    <span
      v-show="active && !onlyVertical"
      class="h3-size-rectangle__cell h3-size-rectangle__cell-left"
      @mousedown="e => onMousedown(e,'left')"
    ></span>

    <span
      v-show="active && !onlyVertical"
      class="h3-size-rectangle__cell h3-size-rectangle__cell-right"
      @mousedown="e => onMousedown(e,'right')"
    ></span>

    <span
      v-show="active && !onlyHorizontal"
      class="h3-size-rectangle__cell h3-size-rectangle__cell-top"
      @mousedown="e => onMousedown(e,'top')"
    ></span>

    <span
      v-show="active && !onlyHorizontal"
      class="h3-size-rectangle__cell h3-size-rectangle__cell-bottom"
      @mousedown="e => onMousedown(e,'bottom')"
    ></span>

    <span
      v-show="active && !onlyHorizontal && !onlyVertical"
      class="h3-size-rectangle__cell h3-size-rectangle__cell-left-top"
      @mousedown="e => onMousedown(e,'leftTop')"
    ></span>

    <span
      v-show="active && !onlyHorizontal && !onlyVertical"
      class="h3-size-rectangle__cell h3-size-rectangle__cell-right-top"
      @mousedown="e => onMousedown(e,'rightTop')"
    ></span>

    <span
      v-show="active && !onlyHorizontal && !onlyVertical"
      class="h3-size-rectangle__cell h3-size-rectangle__cell-left-bottom"
      @mousedown="e => onMousedown(e,'leftBottom')"
    ></span>

    <span
      v-show="active && !onlyHorizontal && !onlyVertical"
      class="h3-size-rectangle__cell h3-size-rectangle__cell-right-bottom"
      @mousedown="e => onMousedown(e,'rightBottom')"
    ></span>

    <slot></slot>
  </div>
</template>


<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

export enum Direction {
  Left = "left",

  Right = "Right",

  Top = "top",

  Bottom = "bottom",

  LeftTop = "leftTop",

  RightTop = "rightTop",

  LeftBottom = "leftBottom",

  RightBottom = "rightBottom"
}

export class Point {
  readonly x: number;

  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(x: number, y: number) {
    x += this.x;
    y += this.y;
    return new Point(x, y);
  }
}

export class Rectangle {
  readonly northEast: Point;

  readonly southWest: Point;

  get width() {
    return this.southWest.x - this.northEast.x;
  }

  get height() {
    return this.southWest.y - this.northEast.y;
  }

  constructor(northEast: Point, southWest: Point) {
    this.northEast = northEast;
    this.southWest = southWest;
  }
}

@Component({
  name: "h3-size-rectangle",
  components: {}
})
export default class H3SizeRectangle extends Vue {
  
  @Prop({
    default:false
  })
  active !: boolean

  @Prop({
    default:false
  })
  onlyHorizontal !: boolean

  @Prop({
    default:false
  })
  onlyVertical !: boolean


  startPoint: Point | null = null;

  // @Watch('active',{
  //   immediate : true
  // })
  // onActiveChange(){
  //   if(this.active){
  //     this.$nextTick(()=>{
  //       const $el = this.$el;
  //       if($el){
  //         this.onlyHorizontal = $el.offsetHeight === 1;
  //         this.onlyVertical = $el.offsetWidth === 1;
  //       }
  //     });
  //   }
  // }

  isHorizontal(direction: Direction) {
    return direction === Direction.Left || direction === Direction.Right;
  }

  isReverse(direction: Direction) {
    return direction === Direction.Left || direction === Direction.Top;
  }

  getCursorBy(direction: Direction) {
    switch (direction) {
      case Direction.Left:
      case Direction.Right:
        return "e-resize";

      case Direction.Top:
      case Direction.Bottom:
        return "n-resize";

      case Direction.LeftTop:
      case Direction.RightBottom:
        return "se-resize";

      case Direction.RightTop:
      case Direction.LeftBottom:
        return "ne-resize";
    }

    return "e-resize";
  }

  onMousedown(evt: MouseEvent, direction: Direction) {
    evt.stopPropagation();

    const horizontal = this.isHorizontal(direction);

    this.startPoint = new Point(evt.screenX, evt.screenY);

    const cell = evt.target as HTMLSpanElement;
    cell.classList.add("active");
    this.$el.classList.add("resizing");

    const bodyCursor = document.body.style.cursor;

    const moveFn = (e: MouseEvent) => {
      this.onMousemove(e, direction);
    };

    const upFn = (e: MouseEvent) => {
      this.startPoint = null;

      cell.classList.remove("active");
      this.$el.classList.remove("resizing");

      document.body.style.cursor = bodyCursor;

      document.removeEventListener("mousemove", moveFn);
      document.removeEventListener("mouseup", upFn);

      this.$emit("resizeEnd");
    };

    document.body.style.cursor = this.getCursorBy(direction);

    document.addEventListener("mousemove", moveFn);
    document.addEventListener("mouseup", upFn);

    this.$emit("resizeStart");
  }

  onMousemove(evt: MouseEvent, direction: Direction) {

    const startPoint = this.startPoint;
    if(!startPoint){
      return;
    }

    const endPoint = new Point(evt.screenX, evt.screenY);

    const x = endPoint.x - startPoint.x;
    const y = endPoint.y - startPoint.y;

    let point = new Point(x,y);

    this.startPoint = endPoint;

    this.$emit('resize', {
      direction,
      point
    });

  }
}
</script>


<style lang="less" scoped>
@size: 5px;
@offset : (@size - 2) * -1;

.h3-size-rectangle {
  position: relative;
  display: inline-block;
  height: 100%;
  width: 100%;

  &__cell {
    display: inline-block;
    position: absolute;
    user-select: none;
    border: solid 1px @text-color-secondary;
    z-index: 1;
    height: @size;
    width: @size;
    background:#fff;
    
    &-left,
    &-left-top,
    &-left-bottom{
      left: @offset;
    }

    &-top,
    &-left-top,
    &-right-top {
      top: @offset;
    }

    &-bottom,
    &-left-bottom,
    &-right-bottom {
      bottom: @offset;
    }

    &-right,
    &-right-top,
    &-right-bottom {
      right: @offset;
    }

    &-left,
    &-right {
      top: calc(50% - (@offset * -1));
      cursor: e-resize !important;
    }

    &-top,
    &-bottom {
      left: calc(50% - (@offset * -1));
      cursor: n-resize !important;
    }

    &-left-top,
    &-right-bottom {
      cursor: se-resize !important;
    }

    &-right-top,
    &-left-bottom {
      cursor: ne-resize !important;
    }
  }
}

</style>
