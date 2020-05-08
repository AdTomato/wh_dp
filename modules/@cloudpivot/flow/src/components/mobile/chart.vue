<template>
  <div class="flow-track-chart" @touchstar.stop>
    <div
      ref="drawer"
      class="flow-track-chart__drawer"
      @touchstart.prevent="touchstart"
      @touchmove.prevent="touchmove"
      @touchend="touchend"
    >
      <workflow-designer
        v-if="chart"
        :size="chartLayoutStyle"
        :style="serializedChartStyle"
        :lineColor="'#666666'"
        :flowData="chart"
        :flowStatus="flowNodeStatus"
        :workflowStatus="workflowStatus"
        :chartOptions="chartOptions"
        @onActivity="clickActivity"
        @touchstart.prevent
        @touchmove.prevent
      />
    </div>
    <div class="flow-track-chart__explain">
      <div class="flow-track-chart__explain-item">
        <i class="flow-track-chart__finish"></i>
        <span>{{ $t('cloudpivot.flow.mobile.FinishNode') }}</span>
      </div>
      <div class="flow-track-chart__explain-item">
        <i class="flow-track-chart__processing"></i>
        <span>{{ $t('cloudpivot.flow.mobile.ProcessNode') }}</span>
      </div>
      <div class="flow-track-chart__explain-item">
        <i class="flow-track-chart__wrong"></i>
        <span>{{ $t('cloudpivot.flow.mobile.WrongNode') }}</span>
      </div>
      <div class="flow-track-chart__explain-item">
        <i class="flow-track-chart__default"></i>
        <span>{{ $t('cloudpivot.flow.pc.UnstartNode') }}</span>
      </div>
    </div>
    <div
      class="chart-guide"
      v-if="!hasGuide"
      @click="hideGuide"
    >
      <div class="guide-content">
        <img src="./images/guide.png"/>
        <p>流程图可手势调整大小</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import flowDrawer from '@cloudpivot/flow-drawer';
import { setGesture } from './touch-scale';
import { workflowApi } from '@cloudpivot/api';
import common from '@cloudpivot/common';




// import WorkflowDesigner from 'h3-flow-drawer/src/components/index.vue';

@Component({
  name: 'workflow-chart',
  components: {
    WorkflowDesigner: flowDrawer.components.WorkflowDesigner
  }
})
export default class WorkflowChart extends Vue {
  // @Prop({ default: () => ({}) }) chart!: any;

  @Prop() workflowStatus?: string;

  @Prop() show!: Boolean;

  // @Prop() chartSize:any;

  // 数据
  chart:any = null;
  chartSize:any;
  chartOptions:any = { clickable:false };
  hasGuide:any = false;
  // 比例
  viewScale:any = 1; // 初始缩放比例
  maxScale:number = 1.2; // 最大放大比例
  minScale:number = 0.3; // 最大缩小比例
  endScale:number = 1; // 缩放后的比例
  // 流程图样式
  chartLayoutStyle:any = {};

  /**
   * 获取流程节点状态
   */
  get flowNodeStatus() {
    const flowStatus: any = [];
    if (this.chart && this.chart.activityStatus) {
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

  // beforeCreate() {
  //   if ( this.$route.query && this.$route.query.token ) {
  //     window.localStorage.setItem('token', String(this.$route.query.token));
  //   }
  // }

  created() {
    this.onShowChange(true);
    /* eslint-disable-next-line */
    // const VConsole = require('vconsole');
    // new VConsole();
  }

  // 居中
  makeChartCenter() {
    this.chartLayoutStyle = this.initChartLayoutStyle();
    this.$nextTick(this.$h3.toast.hide)
  }

  @Watch('show')
  onShowChange(val:boolean) {
    if ( !val ) return;
    // if ( !!(window as any).___at___chart ) {
    //   this.chart = (window as any).___at___chart;
    //   this.$nextTick(this.makeChartCenter)
    if ( !!this.chart ) {
      this.$nextTick(this.makeChartCenter);
      return;
    }


    this.$h3.toast.show({iconType:'loading', duration:99999999});

    workflowApi.getWorkflowChart({ workflowInstanceId:this.$route.params.workflowInstanceId })
    .then((resp:any)=>{
      if ( resp.errcode!==0 ) throw resp.errmsg;
      if ( !resp || !resp.data || typeof(resp.data)!=='object' || !Array.isArray(resp.data.activities) ) throw '找不到流程节点信息';

      let vMax=0,hMax=0,value;
      resp.data.activities.forEach((item:any) => {
        // 记录横向和纵向的最大值, 用以做缩放处理
        if ( (value=item.x+item.width)>hMax ) hMax=value;
        if ( (value=item.y+item.height)>vMax ) vMax=value;
        // 兼容处理(多语言)
        item = common.utils.compatible(item, 'activityName');
      });
      // 赋值
      this.chart = resp.data;
      // (window as any).___at___chart = resp.data;
      // 计算样式
      this.makeChartCenter();
    })
    .catch(err=>this.$h3.toast.show({text:err.toString()}));
  }



  // 获取流程图尺寸
  drawerWrapper:any;
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
    let wrapper       = this.drawerWrapper || (this.drawerWrapper=this.$el.querySelector('.flow-track-chart__drawer') as any);
    let wrapperOffset = 30;   // 增加侧边的偏移, 计算合适的偏移让初始缩放不碰到边
    let wrapperWidth  = wrapper.clientWidth - wrapperOffset;
    let wrapperHeight = wrapper.clientHeight - wrapperOffset;
    let baseOnWidth   = wrapperWidth / wrapperHeight < width / height;
    let scale         = baseOnWidth? +(wrapperWidth/width).toFixed(2): +(wrapperHeight/height).toFixed(2);
    // let wrapperHeight = height*scale;
    let minScale      = 0;
    let maxScale      = 0;

    console.log( wrapperWidth )

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
    let offsetLeft = -((width-wrapperWidth + wrapperOffset )/2);
    let offsetTop  = -((height-wrapperHeight + wrapperOffset )/2);

    // 4. 拖放, 是动态的, 根据其他参数而来
    // let scaleWidth  = width * scale;
    // let scaleHeight = height * scale;
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
      // NOTE: 移动端不能再按照比例缩放, 而是应该按照距离缩放
      scale,
      minScale,
      maxScale,
      scaleStep:0.1,
      // 按距离缩放
      // baseOnWidth,
      // scaleWidth:wrapperWidth,
      // scaleHeight:wrapperHeight,
      // maxScaleWidth:wrapperWidth>width? wrapperWidth: width,
      // maxScaleHeight:wrapperHeight>height? wrapperHeight: height,
      // minScaleWidth:wrapperWidth>width? width: wrapperWidth,
      // minScaleHeight:wrapperHeight>height? height: wrapperHeight,
      // 拖拽
      // minDraggingLeft:offsetLeft-scaleWidth + 100,
      // maxDraggingLeft:offsetLeft+scaleWidth - 100,
      // minDraggingTop:offsetTop-scaleHeight + 100,
      // maxDraggingTop:offsetTop+scaleHeight - 100
    };
  }
  // 获取流程图详细样式
  get serializedChartStyle() {
    // if ( !this.chartLayoutStyle ) return {
    //     opacity:0,
    //     transform:`translate3d(0,0,0) scale(1)`,
    // };

    let { width,height,offsetLeft,offsetTop,scale,hidden } = this.chartLayoutStyle;


    return hidden? {
      width: width + 'px',
      height:height + 'px',
      opacity:0,
    }: {
      width: width + 'px',
      height:height + 'px',
      transform:`translate3d(${offsetLeft}px,${offsetTop}px,0) scale(${scale})`,
      transformOrigin:'center center',
    }
  }

  // 拖拽事件
  isDragging=false;
  dragStarX:number=0;
  dragStarY:number=0;
  dragDistX:number=0;
  dragDistY:number=0;
  dragOrigL:number=0;
  dragOrigT:number=0;
  touchstart(e) {
    // TODO: 鼠标是否有不同平台/浏览器的兼容问题?

    // console.log(e);

    let touches = e.changedTouches;
    let finger  = touches[0];
    if ( touches.length>1 ) return;
    this.isDragging = true;
    // this.zoomOrigin = null;
    this.dragStarX = finger.pageX;
    this.dragStarY = finger.pageY;
    this.dragOrigL = this.chartLayoutStyle.offsetLeft;
    this.dragOrigT = this.chartLayoutStyle.offsetTop;

    // console.log( this.dragOrigL, this.dragOrigT )
  }

  startMaxFingerDistance:number = 0;
  preMaxFingerDistance:number = 0;
  touchmove(e) {
    let touches = e.touches;
    let touchesLen = touches.length;

    if ( touchesLen>1 ) {
      if ( !this.startMaxFingerDistance ) {
        this.startMaxFingerDistance =
        this.preMaxFingerDistance = this.getMaxFingerDistance(touches);
      }
      // if ( !this.zoomOrigin ) {
      //   this.zoomOrigin = {
      //     x:[].reduce.call(touches,(s,c)=>s+c.pageX,0)/touchesLen,
      //     y:[].reduce.call(touches,(s,c)=>s+(c.pageY),0)/touchesLen - 44,
      //     poleCoordins: this.getPoleCoordin(touches),
      //     scale: this.chartLayoutStyle.scale
      //   }
      // }
      this.isDragging = false;
      this.zoom(e, touches);
    } else {
      // 如果是从zoom转为drag, 需要重新确定锚点
      if ( !this.isDragging ) {
        this.touchstart(e);
        return;
      }
      // if ( !this.isDragging ) return;
      this.dragmove(e, touches[0])
    }
  }
  dragmove(e, touch) {
    if ( !this.isDragging ) return;
    // e.preventDefault();
    let layoutStyle = this.chartLayoutStyle;

    this.dragDistX = this.dragOrigL + touch.pageX - this.dragStarX;
    this.dragDistY = this.dragOrigT + touch.pageY - this.dragStarY;

    // console.log( this.dragDistX, this.dragDistY );
    layoutStyle.offsetLeft = this.dragDistX; //Math.max(this.dragDistX, layoutStyle.minDraggingLeft);
    layoutStyle.offsetTop  = this.dragDistY; //Math.max(this.dragDistY, layoutStyle.minDraggingTop);
  }
  touchend(e) {
    this.isDragging = false;
    this.startMaxFingerDistance =
    this.preMaxFingerDistance = 0;
    // this.zoomOrigin = null;
  }

  // 缩放
  zoomWrapper:any;
  zoomWrapperPageOffsetLeft:number =0;
  zoomWrapperPageOffsetTop:number = 44;
  zoomWrapperCenterX:number = 0;
  zoomWrapperCenterY:number = 0;
  // zoomOrigin:any;
  zoomPreMoveDistance:number =0;
  zoom(e:any, touches:any) {

    // console.log('wheel', e.wheelDelta)
    // if ( !this.zoomWrapperFocus ) return;
    // e.preventDefault();

    let layerStyle  = this.chartLayoutStyle;

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
    let layerX = [].reduce.call(touches,(s,c,i)=>s+c.pageX,0)/touches.length,
        layerY = [].reduce.call(touches,(s,c,i)=>s+c.pageY,0)/touches.length - this.zoomWrapperPageOffsetTop,
        layerCenterX = this.zoomWrapperCenterX || (this.zoomWrapperCenterX=(this.zoomWrapper||(this.zoomWrapper=this.$el.querySelector('.flow-track-chart__drawer'))).clientWidth / 2),
        layerCenterY = this.zoomWrapperCenterY || (this.zoomWrapperCenterY=(this.zoomWrapper||(this.zoomWrapper=this.$el.querySelector('.flow-track-chart__drawer'))).clientHeight / 2);


    // 鼠标对于画布的偏移+历史偏移
    let mouseOffsetX = layerX - layerCenterX + movingLeft,
        mouseOffsetY = layerY - layerCenterY + movingTop,
        mouseOffsetXScale = mouseOffsetX / canvasWidth * 2,
        mouseOffsetYScale = mouseOffsetY / canvasHeight * 2;


    if ( mouseOffsetXScale>1 ) mouseOffsetXScale = 1;
    else if ( mouseOffsetXScale<-1 ) mouseOffsetXScale = -1;
    if ( mouseOffsetYScale>1 ) mouseOffsetYScale = 1;
    else if ( mouseOffsetYScale<-1 ) mouseOffsetYScale = -1;


    // 手指缩放的距离, 取最大移动
    // let zoomOrigin = this.zoomOrigin;
    // let startPoleCoordins = zoomOrigin.poleCoordins;
    // let movePoleCoordins  = this.getPoleCoordin(touches);
    // let maxFingerDistance = Math.max( movePoleCoordins.maxDistanceX,movePoleCoordins.maxDistanceY )
    let zoomDistance = this.getMaxFingerDistance(touches);
    let zoomDistanceOffset = zoomDistance - this.preMaxFingerDistance;
    let zoomScaleInRealSize = zoomDistanceOffset / Math.max(width, height) * 10;
    this.preMaxFingerDistance = zoomDistance;

    console.log( '_______ ddd' )
    console.log( zoomDistance, zoomScaleInRealSize );
    console.log( maxScale,', ', minScale, ',' , zoomScaleInRealSize );


    if ( zoomDistanceOffset === 0 ) return;


    // 放大
    if ( zoomDistanceOffset > 0 ) {
      if ( scale + zoomScaleInRealSize > maxScale ) zoomScaleInRealSize = maxScale - scale;
    }
    else if ( zoomDistanceOffset < 0 ) {
      if ( scale + zoomScaleInRealSize < minScale ) zoomScaleInRealSize = -(scale - minScale);
    }


    // if ( zoomDistanceOffset === 0 ) return;



    // scaleStep =

    // 计算实际需要缩放的比例(考虑最大最小的情况)
    // 向上, 放大
    // if ( (isFirefix? -e.detail: e.wheelDelta)<0 ) {
    //   if ( scale + scaleStep > maxScale ) scaleStep = maxScale - scale;
    // }
    // // 缩小
    // else {
    //   if ( scale-scaleStep < minScale ) scaleStep = -(scale - minScale);
    //   else scaleStep = -scaleStep;
    // }
    // 如果不变, 返回
    // if ( scale === layerStyle.scale ) return;

    // 实际需要偏移位置
    let scaleW = width * zoomScaleInRealSize/2,
        scaleH = height * zoomScaleInRealSize/2;


    // 做放大和偏移
    layerStyle.offsetLeft -= scaleW * mouseOffsetXScale;
    layerStyle.offsetTop  -= scaleH * mouseOffsetYScale;
    layerStyle.scale += zoomScaleInRealSize;

    // console.log('_______ sss');
    // console.log( layerStyle.scale )
  }

  // 获取极点坐标
  getPoleCoordin(touches) {
    let minFingerX, maxFingerX, minFingerY, maxFingerY;
    [].forEach.call(touches, (t,i)=>{
      minFingerX = minFingerX? Math.min(t.pageX, minFingerX): t.pageX
      minFingerY = minFingerY? Math.min(t.pageY, minFingerY): t.pageY
      maxFingerX = maxFingerX? Math.max(t.pageX, maxFingerX): t.pageX
      maxFingerY = maxFingerY? Math.max(t.pageY, maxFingerY): t.pageY
    })

    return { minFingerX, maxFingerX, minFingerY, maxFingerY, maxDistanceX:maxFingerX-minFingerX, maxDistanceY:maxFingerY-minFingerY };
  }

  getMaxFingerDistance(touches) {
    let minFingerX, maxFingerX, minFingerY, maxFingerY;
    [].forEach.call(touches, (t,i)=>{
      minFingerX = minFingerX? Math.min(t.pageX, minFingerX): t.pageX
      minFingerY = minFingerY? Math.min(t.pageY, minFingerY): t.pageY
      maxFingerX = maxFingerX? Math.max(t.pageX, maxFingerX): t.pageX
      maxFingerY = maxFingerY? Math.max(t.pageY, maxFingerY): t.pageY
    })

    return Math.max( (maxFingerX-minFingerX), (maxFingerY-minFingerY) );
  }

  /**
   * 事件回调
   */
  clickActivity(activity: any, e: Event) {
    this.$emit('clickActivity', activity, e);
  }

  /*
  * 隐藏指引图
  */
  hideGuide() {
    this.hasGuide = true;
    window.localStorage.setItem('chartGuide', 'true');
  }

  mounted() {
    this.hasGuide = window.localStorage.getItem('chartGuide');
  }
}
</script>


<style lang="less">
@import "~@cloudpivot/common/styles/mixins.less";

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
  height: 100%;
  background-color: #fff;
  &__drawer {
    // .px2rem(padding, 10px);
    // display:flex; align-items:center; justify-content:center;
    // padding:15px;
    // cursor: move;
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    .workflow-designer {
      margin: 0;
      min-width: 100%;
      .activity-instance {
        .px2rem(border-radius, 4px);
      }
      .activity-instance {
        border-color: #052535;
        i {
          color: #052535;
        }
      }
      .finish {
        background: @finish-bg-color;
        border-color: @finish-border-color !important;
        i {
          color: @finish-hover-border-color;
        }
      }
      .wrong {
        background: @wrong-bg-color;
        border-color: @wrong-border-color !important;
        i {
          color: @wrong-hover-border-color;
        }
      }
      .processing {
        background: @process-bg-color;
        border-color: @process-border-color !important;
        i {
          color: @process-hover-border-color;
        }
      }
    }

    // 隐藏滚动条
    &::-webkit-scrollbar {
      width:0; height:0;
    }
  }

  &__explain {
    position: absolute;
    .px2rem(top, 30px);
    .px2rem(right, 0);
    .px2rem(width, 200px);
    z-index: 10;
  }
  &__explain-item {
    display: flex;
    align-items: center;
    .px2rem(margin-bottom, 16px);
    i {
      flex: 0 0;
      .px2rem(flex-basis, 26px);
      .px2rem(height, 26px);
      .px2rem(border-radius, 4px);
      .px2rem(margin-right, 16px);
    }
    span {
      flex: 1 1;
      text-align: left;
      .px2rem(font-size, 26px);
      color: rgba(0, 0, 0, 0.65);
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
}

.chart-guide{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 989;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  .guide-content{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    .px2rem(margin-left, -140px);
    .px2rem(margin-top, -200px);
    text-align: center;
    img{
      .px2rem(width, 280px);
    }
    p{
      color: rgba(255,255,255,0.85);
      .px2rem(font-size, 28px);
    }
  }
}
</style>
