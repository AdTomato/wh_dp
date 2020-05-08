<template>
  <div class="flow-track-chart">
    <div
      class="flow-track-chart__drawer"
      :class="{fullscreen:showFullScreen}"
      :style="`height:${chartLayoutStyle.wrapperHeight}px;`"
      @mousedown.prevent="dragstart"
      @mousewheel.prevent="zoom"
      @DOMMouseScroll.prevent="zoom($event,true)"
    >
      <workflow-designer
        v-if="chart.activities"
        :style="serializedChartStyle"
        :lineColor="'#666666'"
        :flowData="chart"
        :flowStatus="flowNodeStatus"
        :workflowStatus="workflowStatus"
        :chartOptions="chartOptions"
        @onActivity="clickActivity"
      />
    </div>
    <div class="flow-track-chart__explain">
      <div class="flow-track-chart__explain-item">
        <i class="flow-track-chart__finish"></i>
        <span>{{ $t('cloudpivot.flow.pc.FinishNode') }}</span>
      </div>
      <div class="flow-track-chart__explain-item">
        <i class="flow-track-chart__processing"></i>
        <span>{{ $t('cloudpivot.flow.pc.ProcessNode') }}</span>
      </div>
      <div class="flow-track-chart__explain-item">
        <i class="flow-track-chart__wrong"></i>
        <span>{{ $t('cloudpivot.flow.pc.ExceptionNode') }}</span>
      </div>
      <div class="flow-track-chart__explain-item">
        <i class="flow-track-chart__default"></i>
        <span>{{ $t('cloudpivot.flow.pc.UnstartNode') }}</span>
      </div>
    </div>
    <div class="flow-track-chart__fullscreen">
      <a-tooltip placement="top" >
        <template slot="title">
          <span>{{ $t('cloudpivot.form.runtime.biz.fullScreen') }}</span>
        </template>
        <span @click="toggleFullscreen" class="fullscreen icon aufontAll">&#xe8e5;</span>
      </a-tooltip>
    </div>


    <!-- 全屏查看流程图 -->
    <!-- <div class="chart__fullscreen" v-if="showFullScreen">
      <div class="fullscreen__head">
        <div class="fullscreen__head-left">{{ $t('cloudpivot.flow.pc.WorkflowChart') }}</div>
        <div class="fullscreen__head-right">
          <a-tooltip placement="bottom" >
            <template slot="title">
              <span>{{ $t('cloudpivot.flow.pc.SmallScreen') }}</span>
            </template>
            <span @click="restoreScreen" class="fullscreen-restore icon aufontAll">&#xe8e7;</span>
          </a-tooltip>
        </div>
      </div>
      <div v-moveDirective:scroll.full class="fullscreen__content">
        <workflow-designer
          v-if="chart.activities"
          :style="chartLayoutStyle"
          :lineColor="'#666666'"
          :flowData="chart"
          :flowStatus="flowNodeStatus"
          :workflowStatus="workflowStatus"
          :chartOptions="chartOptions"
          @onActivity="clickActivity"
        />
      </div>
    </div> -->

    <div class="fullscreen__head" v-show="showFullScreen">
      <div class="fullscreen__head-left">{{ $t('cloudpivot.flow.pc.WorkflowChart') }}</div>
      <div class="fullscreen__head-right">
        <a-tooltip placement="bottom" >
          <template slot="title">
            <span>{{ $t('cloudpivot.flow.pc.SmallScreen') }}</span>
          </template>
          <span @click="toggleFullscreen" class="fullscreen-restore icon aufontAll">&#xe8e7;</span>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { Tooltip } from 'h3-antd-vue';

import flowDrawer from '@cloudpivot/flow-drawer';
import common from '@cloudpivot/common';

import { workflow } from '@cloudpivot/api';

@Component({
  name: 'flow-track-chart',
  directives: {
    moveDirective: common.directives.moveDirective
  },
  components: {
    ATooltip: Tooltip,
    WorkflowDesigner: flowDrawer.components.WorkflowDesigner
  }
})
export default class FormWorkflowTrackChart extends Vue {
  @Prop({ default: {} }) chart!: workflow.Chart;
  @Prop() workflowStatus?: string;
  @Prop({default:()=>({clickable:true})}) chartOptions:any;


  chartLayoutStyle:any = {};
  zoomWrapperFocus:boolean = false;
  showFullScreen:boolean = false;


  /**
   * 获取流程节点状态
   */
  get flowNodeStatus() {
    const flowStatus: any = [];
    if (this.chart.activityStatus) {
      this.chart.activityStatus.forEach((activity: any) => {
        let status = '';
        switch (activity.status) {
          case 0:
            status = 'finish';
            break;
          case 1:
            status = 'processing';
            break;
          case 2:
            status = 'wrong';
            break;
          default:
            break;
        }
        flowStatus.push({ activityCode: activity.activityCode, status });
      });
    }
    return flowStatus;
  }

  @Watch('chart.activities', {immediate:true})
  onActivitiesChange(val:[]) {
    if ( !val || !Array.isArray(val) || !val.length ) return;
    // 样式相关
    // this.chartLayoutSize  = this.getChartLayoutSize();
    this.chartLayoutStyle = this.initChartLayoutStyle();
  }
  // 获取流程图尺寸
  initChartLayoutStyle(isFullScreen?:boolean) {
    // 1. 水平最大值和垂直最大值
    let width=0, height=0, tempVal;
    (this.chart.activities||[]).forEach((item:any) => {
      if ( (tempVal=item.x+item.width)>width ) width=tempVal;
      if ( (tempVal=item.y+item.height)>height ) height=tempVal;
    });
    // 因为这里的最大宽高只取 activity, 考虑到有线的存在, 宽高需要+=120
    width+=120;
    height+=120;

    // 2. 缩放
    let wrapper       = document.querySelector('.flow-track-chart__drawer') as any;
    let wrapperOffset = 100;
    let wrapperWidth  = wrapper.clientWidth - wrapperOffset;
    let scale         = +(wrapperWidth/width).toFixed(2);
    let wrapperHeight = height*scale;
    let minScale      = 0;
    let maxScale      = 0;

    // 不支持缩放
    if ( scale>1 ) {
      maxScale = scale;
      scale =
      minScale = 1;
    }
    else {
      minScale = scale;
      maxScale = 1;
    }

    // 3. 位置偏移
    let offsetLeft = -((width-wrapperWidth)>>1);
    let offsetTop  = -((height-wrapperHeight)>>1);

    // 4. 拖放, 是动态的, 根据其他参数而来
    let scaleWidth  = width * scale;
    let scaleHeight = height * scale;
    // let maxDraggingLeft = offsetLeft - 100;
    // let maxDraggingTop  = offsetTop - 100;

    // 返回
    return {
      // 流程图实际宽高
      width, height,
      // 容器宽高&侧边偏移
      wrapperWidth,
      wrapperHeight,
      wrapperOffset:100,
      // 偏移
      centerOffsetLeft:offsetLeft,
      centerOffsetTop:offsetTop,
      offsetLeft,
      offsetTop,
      moveDistanX:0,
      moveDistanY:0,
      // 缩放
      scale,
      minScale,
      maxScale,
      scaleStep:0.1,
      // 拖拽
      minDraggingLeft:offsetLeft-scaleWidth + 100,
      maxDraggingLeft:offsetLeft+scaleWidth - 100,
      minDraggingTop:offsetTop-scaleHeight + 100,
      maxDraggingTop:offsetTop+scaleHeight - 100
    };
  }
  // 获取流程图详细样式
  get serializedChartStyle() {
    let { width,height,offsetLeft,offsetTop,scale } = this.chartLayoutStyle;
    return {
      width: width+'px',
      height:height+'px',
      transform:`translate3d(${offsetLeft}px,${offsetTop}px,0) scale(${scale})`,
      transformOrigin:'center center'
    }
  }

  // 缩放
  zoomWrapper:any;
  zoomWrapperPageOffsetLeft:number =0;
  zoomWrapperPageOffsetTop:number = 0;
  zoomWrapperNormalWidth:number=0;
  zoomWrapperNormalHeight:number=0;
  zoomWrapperCenterX:number = 0;
  zoomWrapperCenterY:number = 0;
  zoom(e, isFirefix?:boolean) {

    // console.log('wheel', e.wheelDelta)
    // if ( !this.zoomWrapperFocus ) return;
    // e.preventDefault();

    let layerStyle  = this.chartLayoutStyle;
    let isZoomWrapperLoaded = !!this.zoomWrapper;
    let zoomWrapper = (this.zoomWrapper || (this.zoomWrapper=this.$el.querySelector('.flow-track-chart__drawer')));
    let zoomWrapperPageOffsetLeft  = 0,// this.zoomWrapperPageOffsetLeft,
        zoomWrapperPageOffsetTop   = 0// this.zoomWrapperPageOffsetTop;

    // 记录普通状态下缩放容器的宽高值
    if ( !isZoomWrapperLoaded ) {
      this.zoomWrapperNormalWidth = zoomWrapper.clientWidth;
      this.zoomWrapperNormalHeight = zoomWrapper.clientHeight;
    }

    // 外部容器的偏移量
    if ( !this.showFullScreen ) {
      let node = document.querySelector('.ant-tabs-content') as any;
      let html = document.documentElement;
      do {
        if ( node.offsetLeft && !node.classList.contains('content') ) {
          zoomWrapperPageOffsetLeft += node.offsetLeft;
        }
        if ( node.offsetTop ) {
          zoomWrapperPageOffsetTop += node.offsetTop;
        }
        node = node.parentNode;
      } while( node!==html )

      zoomWrapperPageOffsetLeft = zoomWrapperPageOffsetLeft<0? 0: zoomWrapperPageOffsetLeft;

      this.zoomWrapperPageOffsetLeft = zoomWrapperPageOffsetLeft;
      this.zoomWrapperPageOffsetTop  = zoomWrapperPageOffsetTop;
    } else {
      zoomWrapperPageOffsetLeft = 0;
      zoomWrapperPageOffsetTop  = 64;
    }

    // console.log('______ wrapper', this.showFullScreen)
    // console.log( zoomWrapperPageOffsetLeft, zoomWrapperPageOffsetTop )

    // 当前画布数据
    let { width, height, scale, minScale, maxScale, scaleStep, centerOffsetLeft, centerOffsetTop, offsetLeft, offsetTop } = layerStyle;

    // 画布缩放大小及其中心偏移
    let canvasWidth  = width * scale,
        canvasHeight = height * scale,
        canvasCenterW = width * scale / 2,
        canvasCenterH = height * scale / 2;

    // 已手动调整的偏移量
    let movingLeft = centerOffsetLeft-offsetLeft,
        movingTop  = centerOffsetTop-offsetTop;

    // 容器及其位置
    let layerX = e.pageX - zoomWrapperPageOffsetLeft,
        layerY = e.pageY - zoomWrapperPageOffsetTop + ((document.querySelector('.main') as any).scrollTop||0),
        layerCenterX = this.zoomWrapperCenterX || (this.zoomWrapperCenterX=zoomWrapper.clientWidth / 2),
        layerCenterY = this.zoomWrapperCenterY || (this.zoomWrapperCenterY=zoomWrapper.clientHeight / 2);

    // 鼠标对于画布的偏移+历史偏移
    let mouseOffsetX = layerX - layerCenterX + movingLeft,
        mouseOffsetY = layerY - layerCenterY + movingTop,
        mouseOffsetXScale = mouseOffsetX / canvasWidth * 2,
        mouseOffsetYScale = mouseOffsetY / canvasHeight * 2;


    if ( mouseOffsetXScale>1 ) mouseOffsetXScale = 1;
    else if ( mouseOffsetXScale<-1 ) mouseOffsetXScale = -1;
    if ( mouseOffsetYScale>1 ) mouseOffsetYScale = 1;
    else if ( mouseOffsetYScale<-1 ) mouseOffsetYScale = -1;

    // 计算实际需要缩放的比例(考虑最大最小的情况)
    // 向上, 放大
    if ( (isFirefix? -e.detail: e.wheelDelta)<0 ) {
      if ( scale + scaleStep > maxScale ) scaleStep = maxScale - scale;
    }
    // 缩小
    else {
      if ( scale-scaleStep < minScale ) scaleStep = -(scale - minScale);
      else scaleStep = -scaleStep;
    }
    // 如果不变, 返回
    // if ( scale === layerStyle.scale ) return;

    // 实际需要偏移位置
    let scaleW = width * scaleStep/2,
        scaleH = height * scaleStep/2;


    layerStyle.offsetLeft -= scaleW * mouseOffsetXScale;
    layerStyle.offsetTop  -= scaleH * mouseOffsetYScale;
    layerStyle.scale += scaleStep;


  }

  // 拖拽事件
  isDragging=false;
  dragStarX:number=0;
  dragStarY:number=0;
  dragDistX:number=0;
  dragDistY:number=0;
  dragOrigL:number=0;
  dragOrigT:number=0;
  dragstart(e) {
    // TODO: 鼠标是否有不同平台/浏览器的兼容问题?
    if (e.button!==0) return;

    this.isDragging = true;
    this.dragStarX = e.pageX;
    this.dragStarY = e.pageY;
    this.dragOrigL = this.chartLayoutStyle.offsetLeft;
    this.dragOrigT = this.chartLayoutStyle.offsetTop;

    console.log( this.dragOrigL, this.dragOrigT )

  }
  dragmove(e) {
    if ( !this.isDragging ) return;
    e.preventDefault();
    let layoutStyle = this.chartLayoutStyle;

    this.dragDistX = this.dragOrigL + e.pageX - this.dragStarX;
    this.dragDistY = this.dragOrigT + e.pageY - this.dragStarY;

    // console.log( this.dragDistX, this.dragDistY );
    layoutStyle.offsetLeft = Math.max(this.dragDistX, layoutStyle.minDraggingLeft);
    layoutStyle.offsetTop  = Math.max(this.dragDistY, layoutStyle.minDraggingTop);
  }
  dragend(e) {
    this.isDragging = false;
  }

  // 注册&注销事件
  created() {
    document.addEventListener('mouseup', this.dragend);
    document.addEventListener('mousemove', this.dragmove);
      // @mousewheel="zoom"
    // document.addEventListener('DOMMouseScroll', this.zoom)
    // document.addEventListener('mousewheel', this.zoom)
  }
  destroy() {
    document.removeEventListener('mouseup', this.dragend);
    document.removeEventListener('mousemove', this.dragmove);
  }


  /*
  * 全屏
  */
 toggleFullscreen() {
    if ( !this.zoomWrapper ) {
      let zoomWrapper = (this.zoomWrapper=this.$el.querySelector('.flow-track-chart__drawer'));
      if ( !zoomWrapper ) return this.$message.error('找不到缩放容器!');
      this.zoomWrapperCenterX=zoomWrapper.clientWidth / 2;
      this.zoomWrapperCenterY=zoomWrapper.clientHeight / 2;
      this.zoomWrapperNormalWidth = zoomWrapper.clientWidth;
      this.zoomWrapperNormalHeight = zoomWrapper.clientHeight;
    }

    let body    = (document.body as any);

    let wrapperW = this.zoomWrapperNormalWidth||0;
    let wrapperH = this.zoomWrapperNormalHeight||0;
    let bodyW    = body.clientWidth||0;
    let bodyH    = body.clientHeight||0;

    let widthOffset, heightOffset;

    // if ( !this.showFullScreen ) {
    if ( bodyW===wrapperW ) widthOffset=0;
    else widthOffset = this.showFullScreen? (bodyW-wrapperW)/2: (wrapperW-bodyW)/2;
    if ( bodyH===wrapperH ) heightOffset=0;
    else heightOffset = this.showFullScreen? (bodyH-wrapperH)/2: (wrapperH-bodyH)/2;
    // }

    this.chartLayoutStyle.offsetLeft -= widthOffset;
    this.chartLayoutStyle.offsetTop  -= heightOffset;

    this.showFullScreen = !this.showFullScreen;
 }

  /**
   * 事件回调
   */
  clickActivity(activity: any, e: Event) {
    this.$emit('clickActivity', activity, e);
  }
}
</script>
<style lang="less">
// @import "../../../../styles/themes/default";
@finish-bg-color: rgba(0, 255, 156, 0.1);
@finish-hover-bg-color: rgba(0, 255, 156, 0.15);
@finish-border-color: rgba(23, 188, 148, 0.5);
@finish-hover-border-color: rgba(50, 182, 131, 1);

@process-bg-color: rgba(41, 112, 255, 0.1);
@process-hover-bg-color: rgba(41, 112, 255, 0.15);
@process-border-color: rgba(41, 112, 255, 0.5);
@process-hover-border-color: rgba(41, 112, 255, 1);

@wrong-bg-color: rgba(244, 69, 78, 0.1);
@wrong-hover-bg-color: rgba(244, 69, 78, 0.15);
@wrong-border-color: rgba(244, 69, 78, 0.5);
@wrong-hover-border-color: rgba(207, 48, 61, 1);

@default-font-color: rgba(0, 0, 0, 0.85);
@default-hover-bg-color: rgba(102, 102, 102, 0.15);
@default-border-color: rgba(153, 153, 153, 1);
@default-hover-border-color: rgba(102, 102, 102, 1);

.flow-track-chart {
  position: relative;
  overflow: hidden;
  &__drawer {
    position:relative;
    padding: 50px;
    overflow:hidden;
    box-sizing:content-box;
    cursor: move;
    &.fullscreen {
      // background-color:#eaeaea;
      // height:calc(100vh - 64px);
      // .flow-track-chart {
        position:fixed;
        left:0;
        top:64px;
        z-index:900;
        width:calc(100vw - 100px);
        height:calc(100vh - 64px)!important;
        background-color:#fff;
      // }
    }
  }
  .workflow-designer {
    margin: 0;
    min-width: 100%;
    .activity-instance {
      color: @default-font-color;
      border-color: @default-border-color;
    }
    .activity-instance:hover {
      border-color: @default-hover-border-color;
      background-color: @default-hover-bg-color;
    }
    .finish {
      // border-radius: 2px;
      background: @finish-bg-color;
      border-color: @finish-border-color !important;
      &:hover {
        background: @finish-hover-bg-color;
        border-color: @finish-hover-border-color !important;
      }
      i {
        color: @finish-hover-border-color;
      }
    }
    .wrong {
      background: @wrong-bg-color;
      border-color: @wrong-border-color !important;
      &:hover {
        background: @wrong-hover-bg-color;
        border-color: @wrong-hover-border-color !important;
      }
      i {
        color: @wrong-hover-border-color;
      }
    }
    .processing {
      // border-radius: 2px;
      background: @process-bg-color;
      border-color: @process-border-color !important;
      &:hover {
        background: @process-hover-bg-color;
        border-color: @process-hover-border-color !important;
      }
      i {
        color: @process-hover-border-color;
      }
    }
  }

  &__fullscreen{
    position: absolute;
    top: 0;
    right: 10px;
    cursor: pointer;
  }

  &__explain {
    position: absolute;
    top: 0;
    left: 10px;
    width: 200px;
    pointer-events:none;
  }
  &__explain-item {
    display: flex;
    align-items: center;
    margin-bottom: @base4-padding-xs;
    i {
      flex: 0 0 14px;
      height: 14px;
      margin-right: @base4-padding-md;
      border-radius: @border-radius-lg;
    }
    span {
      flex: 1 1;
      font-size: @font-size-14;
      color: @light-color-2;
    }
  }
  &__finish {
    background-color: @finish-bg-color;
    border: 1px solid @finish-border-color !important;
  }
  &__wrong {
    background-color: @wrong-bg-color;
    border: 1px solid @wrong-border-color !important;
  }
  &__processing {
    background-color: @process-bg-color;
    border: 1px solid @process-border-color !important;
  }
  &__default {
    border: 1px solid @default-border-color !important;
  }


  // 全屏时的头部
  .fullscreen__head{
    position:fixed; left:0; top:0; z-index:901;
    width:100%; height: 64px;
    line-height: 64px;
    padding: 0 24px;
    background-color:#fff;
    border-bottom:1px solid #eaeaea;
    box-shadow: 0 2px 8px rgba(30, 85, 255, 0.1);
    &-left{
      float: left;
      font-size: 18px;
      font-weight: 600;
      color: rgba(0,0,0,0.85);
    }
    &-right{
      float: right;
      margin-right: 8px;
      cursor: pointer;
    }
  }

  // .chart__fullscreen{
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   z-index: 100;
  //   background: #fff;
  //   .fullscreen__head{
  //     height: 64px;
  //     line-height: 64px;
  //     padding: 0 24px;
  //     &-left{
  //       float: left;
  //       font-size: 18px;
  //       font-weight: 600;
  //       color: rgba(0,0,0,0.85);
  //     }
  //     &-right{
  //       float: right;
  //       margin-right: 8px;
  //       cursor: pointer;
  //     }
  //   }
  //   .fullscreen__content{
  //     padding: 30px;
  //     height: calc(100% - 74px);
  //     width: 100%;
  //     overflow: auto;
  //     cursor: move;
  //   }
  // }
}
</style>
