<template>
  <div
    class="pop-model"
    :style="{'width':popWidth,'top':popTop,'left':left,'right':right}"
    v-if="showPop"
  >
    <div class="pop-arrow" :style="{'left':arrowLeft}"></div>
    <div class="pop-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

@Component({
  name: 'Pop-model'
})
export default class PopModel extends Vue {
  @Prop() width!:string;

  @Prop() arrowLeft!:string;

  @Prop() top!:string;

  @Prop() left!:string;

  @Prop() right!:string;

  @Prop() show!:boolean;

  showPop:boolean = false;

  popWidth:string = '';

  popTop:string = '';

  /*
  * 隐藏浮窗
  */
  hidePop() {
    this.showPop = false;
    this.$emit('visibleChange', false);
  }

  /*
  * 浮窗显示隐藏事件
  */
  popVisible(event:any) {
    if (event.target.className.indexOf('pop') !== -1) {
      return;
    }
    this.hidePop();
  }

  @Watch('top')
  onTopChange(v:string) {
    this.popTop = v;
  }

  @Watch('show')
  onVisibleChange(v:boolean) {
    this.showPop = v;
    if (v) {
      this.popWidth = this.width;
      document.addEventListener('mousedown', this.popVisible);
      window.addEventListener('resize', this.hidePop);
    } else {
      window.removeEventListener('resize', this.hidePop);
      document.removeEventListener('mousedown', this.popVisible);
    }
  }
}
</script>

<style lang="less" scoped>
.pop-model{
  position: absolute;
  top: 0;
  z-index: 1010;
  border: 1px solid @primary-color;
  border-radius: @border-radius-lg;
  background: #F0F7FF;
  padding: 1px 0;
  .pop-arrow{
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    top: -4px;
    box-shadow: -1px -1px 0px @primary-color;
    background: #F0F7FF;
    width: 8.48528137px;
    height: 8.48528137px;
    position: absolute;
    display: block;
    border-color: transparent;
    border-style: solid;
  }
  .pop-content{
    overflow-y: auto;
    min-height: 106px;
    max-height: 318px;
    padding-left: @base4-padding-xs;
    padding-top: @base4-padding-md;
    .workflow-wrap{
      background: @dark-color-1 !important;
    }
  }
}
</style>
