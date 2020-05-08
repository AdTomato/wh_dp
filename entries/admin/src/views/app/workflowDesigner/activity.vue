<template>
  <div
    class="activity activity-instance"
    :id="instance.ID"
    :class="{
      'activity-selected-first':firsttActivityId === instance.ID,
      'activity-selected':instance.isSelected
    }"
    @mousedown.stop="activitySelect"
    @contextmenu.stop="contextmenu"
    :style="{
      'left':instance.left+'px',
      'top':instance.top+'px',
      'width': instance.width+'px',
      'height': instance.height + 'px'
    }"
    ref="instance"
  >
    <div class="activity activity-content">
      <div class="content-wrap">
        <!-- <i class="activity-icon icon aufontAll" :class="instance.icon"></i> -->
        <i class="activity-icon icon aufontAll" v-html="instance.icon"></i>
        <span v-if="isChinese" class="activity">{{ instance.activityName }}</span>
        <span v-else class="activity">{{ instance.name_i18n[$i18n.locale] }}</span>
      </div>
    </div>

    <div class="activity square square-left-top"></div>
    <div class="activity square square-right-top"></div>
    <div class="activity square square-left-bottom"></div>
    <div class="activity square square-right-bottom"></div>

    <template v-if="instance.activityType !== 'END'">
      <!-- 节点边缘拖拽产生线条 -->
      <activity-drag-bar
        v-for="(direct, idx) in directions"
        :key="'bar'+idx"
        :direction="direct"
        :instance="instance"
        :container="dom"
        :showCircle="firsttActivityId === instance.ID"
        v-h3-drag
        @onConnectPoint="onConnectPoint(direct)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import { LINE } from '@/typings/line';
import * as TraceType from '@/typings/traceType';
import * as WorkflowNamespace from '@/typings/workflow';
import { H3AvtivityDraggable } from '@/directives/drag';
import { getCompNameByActivityType } from '@/components/apps/workflow/helper/helper';
import activityDragBar from './activityDragBar.vue';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'Activity',
  components: {
    activityDragBar
  }
})
export default class Activity extends Vue implements H3AvtivityDraggable {
  @WorkflowModule.Mutation('select') select: any;

  @WorkflowModule.Mutation('unSelect') unSelect: any;

  @WorkflowModule.Mutation('setSize') setSize: any;

  @WorkflowModule.Mutation('activityMove') activityMove: any;

  @WorkflowModule.Mutation('setDataTransfer') setDataTransfer: any;

  @WorkflowModule.Mutation('setProxyActivity') setProxyActivity: any;

  @WorkflowModule.Mutation('setProxyPosition') setProxyPosition: any;

  @WorkflowModule.Mutation('switchToFirst') switchToFirst: any;

  @WorkflowModule.Mutation('showPropertyPanel') showPropertyPanel: any;

  @WorkflowModule.Mutation('setTempLine') setTempLine: any;

  @WorkflowModule.State('traceManager') traceManager: any;

  @WorkflowModule.State('movedActivities') movedActivities: any;

  // 暂存移动后的节点,测试暂时设为单个节点
  @WorkflowModule.State('activities') activities: any;

  @WorkflowModule.State('lines') lines: any;

  @WorkflowModule.State('proxyActivity') proxyActivity: any;

  @WorkflowModule.State('selectedActivities') selectedActivities: any;

  @WorkflowModule.State('firsttActivityId') firsttActivityId: any;

  @WorkflowModule.State('curActivityID') curActivityID: any;

  @WorkflowModule.State('isSaveProp') isSaveProp:any;

  @WorkflowModule.Action('onActivityConnect') onActivityConnect: any;

  @WorkflowModule.Action('onActivityMoved') onActivityMoved: any;

  @WorkflowModule.Action('transformData') transformData: any;

  @Prop()
  instance!: any;

  @Prop()
  dom!: any;

  currentDirection: number = 0;

  activityDirection: any = {
    leftTop: -1,
    rightTop: -2,
    leftBottom: 1,
    rihgtBottom: 2
  };

  directions: any[] = ['top', 'right', 'bottom', 'left'];

  squarePrePoint: any = {};

  instanceSize: any = {};

  instanceDom:any = undefined;

  // 当前节点dom
  designWrapDom:any = undefined;

  // 绘图区外层wrap的dom
  originOffsetX:number = 0;

  originOffsetY:number = 0;

  beforeActivities:Array<any> = [];

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  mounted() {
    this.instanceDom = this.$refs.instance as HTMLElement;
    this.designWrapDom = document.getElementById('designer-wrap');
  }

  contextmenu(e:any) {
    this.activitySelect(e);
    this.$emit('contextmenu', this.instance, e);
    e.preventDefault();
  }

  onDragstart(evt: DragEvent) {
    /* 开始操作节点 */
    if (evt.dataTransfer) {
      // evt.dataTransfer.setData('item-data', JSON.stringify(this.instance));
      // evt.dataTransfer.setData('workflow-element-type', 'activity');
      // evt.dataTransfer.setData(
      //   'origin-offsets',
      //   JSON.stringify({
      //     x: evt.offsetX,
      //     y: evt.offsetY
      //   })
      // );
      evt.dataTransfer.setData(
        `width-${this.instance.width}`,
        this.instance.width.toString()
      );
      evt.dataTransfer.setData(
        `height-${this.instance.height}`,
        this.instance.height.toString()
      );
      evt.dataTransfer.setData(
        `offsetx-${evt.offsetX}`,
        evt.offsetX.toString()
      );
      evt.dataTransfer.setData(
        `offsety-${evt.offsetY}`,
        evt.offsetX.toString()
      );
      this.setDataTransfer({
        itemData: this.instance,
        originOffsets: {
          x: evt.offsetX,
          y: evt.offsetY
        },
        workflowElementType: 'activity'
      });
    }
    const curdom: any = evt.target;
    if (!curdom.className || curdom.className.indexOf('activity-instance') < 0) {
      return;
    }

    this.beforeActivities = JSON.parse(JSON.stringify(this.selectedActivities));

    this.selectedActivities.forEach((a: WorkflowNamespace.Activity, i: string) => {
      const activityDom = document.getElementById(`${a.ID}`);
      if (activityDom && a) {
        const dom = activityDom.cloneNode(true);
        const proxyData = { ...a, dom };
        this.setProxyActivity(proxyData);
      }
    });
    this.originOffsetX = evt.offsetX;
    this.originOffsetY = evt.offsetY;
    this.instanceSize = { ...this.instance };
    document.addEventListener('mousemove', this.activityDragMove);
    document.addEventListener('mouseup', this.activityDragEnd);
    evt.preventDefault();
  }

  activitySelect(e: any) {
    if (!this.isSaveProp) return;
    // 点击当前活动节点事件
    // 如果摁中Ctrl,加选当前活动,mac电脑为command+单击
    const isMac = /macintosh|mac os x/i.test(window.navigator.userAgent);
    console.log('--------isMac', isMac);
    if (e.ctrlKey || (isMac && e.metaKey)) {
      if (this.instance.isSelected) {
        this.unSelect(this.instance);
      } else {
        this.select(this.instance);
      }
    } else if (this.instance.isSelected) {
      this.switchToFirst(this.instance);
    } else {
      // 清空所有选中活动
      this.unSelect();
      this.select(this.instance);
    }
    if (e.target.className.indexOf('square') !== -1) {
      this.instanceSize = { ...this.instance };
      if (e.target.className.indexOf('square-left-top') !== -1) {
        this.currentDirection = this.activityDirection.leftTop;
        this.squarePrePoint = {
          X: e.offsetX + this.instanceSize.left - 12,
          Y: e.offsetY + this.instanceSize.top - 12
        };
      } else if (e.target.className.indexOf('square-right-top') !== -1) {
        this.currentDirection = this.activityDirection.rightTop;
        this.squarePrePoint = {
          X: e.offsetX + this.instanceSize.left + this.instanceSize.width - 1,
          Y: e.offsetY + this.instanceSize.top - 11
        };
      } else if (e.target.className.indexOf('square-left-bottom') !== -1) {
        this.currentDirection = this.activityDirection.leftBottom;
        this.squarePrePoint = {
          X: e.offsetX + this.instanceSize.left - 11,
          Y: e.offsetY + this.instanceSize.top + this.instanceSize.height - 1
        };
      } else if (e.target.className.indexOf('square-right-bottom') !== -1) {
        this.currentDirection = this.activityDirection.rihgtBottom;
        this.squarePrePoint = {
          X: e.offsetX + this.instanceSize.left + this.instanceSize.width,
          Y: e.offsetY + this.instanceSize.top + this.instanceSize.height
        };
      }
      e.preventDefault();
      this.dom.addEventListener('mousemove', this.mouseMove);
      document.addEventListener('mouseup', this.mouseUp);
    }

    // 展示不同的属性面板 组件的name
    if ((e.button === 0 || e.button === 1) && e.type === 'mousedown') {
      const _activityType = this.instance.activityType;
      let propertyCompName:string|undefined = '';
      if (_activityType === 'START' || _activityType === 'END') return;
      propertyCompName = getCompNameByActivityType(_activityType);
      if (this.curActivityID !== this.instance.ID && this.instance.ID) {
        // 切换成别的节点，先做赋值操作
        this.transformData(this.instance.ID);
        // 展示属性面板
        this.showPropertyPanel(propertyCompName);
      }
    }
  }

  mouseMove(e: any) {
    // mousemove时调整节点尺寸
    const squareCurrentPoint = {
      X: Math.max(this.designWrapDom.scrollLeft + (e.clientX - this.dom.offsetLeft), 0),
      Y: Math.max(this.designWrapDom.scrollTop + (e.clientY - this.dom.offsetTop - 64), 0)
    };
    let newWidth = 0;
    let newHeight = 0;
    switch (this.currentDirection) {
      case this.activityDirection.leftTop:
        newWidth = this.instanceSize.width
          + this.squarePrePoint.X
          - squareCurrentPoint.X;
        newHeight = this.instanceSize.height
          + this.squarePrePoint.Y
          - squareCurrentPoint.Y;
        this.activityMove({
          itemData: this.instance,
          activityPosition: this.limitPosition(
            squareCurrentPoint.X,
            squareCurrentPoint.Y
          )
        });
        this.setSize({
          instance: this.instance,
          activitySize: this.limitScope(newWidth, newHeight)
        });
        break;
      case this.activityDirection.rightTop:
        newWidth = this.instanceSize.width
          + squareCurrentPoint.X
          - this.squarePrePoint.X;
        newHeight = this.instanceSize.height
          + this.squarePrePoint.Y
          - squareCurrentPoint.Y;
        this.activityMove({
          itemData: this.instance,
          activityPosition: this.limitPosition(undefined, squareCurrentPoint.Y)
        });
        this.setSize({
          instance: this.instance,
          activitySize: this.limitScope(newWidth, newHeight)
        });
        break;
      case this.activityDirection.leftBottom:
        newWidth = this.instanceSize.width
          + this.squarePrePoint.X
          - squareCurrentPoint.X;
        newHeight = this.instanceSize.height
          + squareCurrentPoint.Y
          - this.squarePrePoint.Y;
        this.activityMove({
          itemData: this.instance,
          activityPosition: this.limitPosition(squareCurrentPoint.X, undefined)
        });
        this.setSize({
          instance: this.instance,
          activitySize: this.limitScope(newWidth, newHeight)
        });
        break;
      case this.activityDirection.rihgtBottom:
        newWidth = this.instanceSize.width
          + squareCurrentPoint.X
          - this.squarePrePoint.X;
        newHeight = this.instanceSize.height
          + squareCurrentPoint.Y
          - this.squarePrePoint.Y;
        this.setSize({
          instance: this.instance,
          activitySize: this.limitScope(newWidth, newHeight)
        });
        break;
      default:
        break;
    }
  }

  // 鼠标松开事件 -- 改变节点尺寸
  mouseUp(e: any) {
    // 添加痕迹
    this.traceManager.AddTrace(
      TraceType.Activity.Resize,
      this.movedActivities,
      this.instanceSize,
      this
    );

    // 调整节点尺寸mousemove后松开鼠标
    this.dom.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('mouseup', this.mouseUp);
  }

  activityDragMove(e: any) {
    /* 清空当前的线 */
    this.setTempLine();
    // 活动节点拖拽移动
    this.proxyActivity.forEach((a: any, i: string) => {
      this.instanceDom.parentNode.appendChild(a.dom);
    });
    const position = {
      x: `${Math.max(this.designWrapDom.scrollLeft + (e.clientX - this.dom.offsetLeft - this.originOffsetX), 0)}px`,
      y: `${Math.max(this.designWrapDom.scrollTop + (e.clientY - this.dom.offsetTop - this.originOffsetY - 64), 0)}px`
    };
    this.setProxyPosition({ item: this.instance, position });
    if (this.proxyActivity.length === 1) {
      // 如果移动对象是单个，启用对齐计算
      this.$emit('dragMove', e);
    }
    this.$emit('activityMoving', { type: 'mouseCtrl', curActivity: this.proxyActivity });
    e.preventDefault();
  }

  activityDragEnd(e: any) {
    // 活动节点拖拽移动结束-鼠标松开
    this.$emit('resetLine', e);
    document.removeEventListener('mousemove', this.activityDragMove);
    document.removeEventListener('mouseup', this.activityDragEnd);
    // console.log('end');
    let activityPosition = {};
    // const movedActivities:Array<WorkflowNamespace.Activity> = [];
    this.proxyActivity.forEach((a: any, i: string) => {
      activityPosition = {
        x: parseInt(a.dom.style.left, 10),
        y: parseInt(a.dom.style.top, 10)
      };
      this.activityMove({ itemData: a, activityPosition });
    });

    this.traceManager.AddTrace(
      TraceType.Activity.Move,
      this.selectedActivities,
      this.beforeActivities,
      this
    );
    this.$nextTick(() => {
      const activity = this.activities.find((item: WorkflowNamespace.Activity) => item.activityCode === this.instance.activityCode);
      this.onActivityMoved(activity);
    });
    this.proxyActivity.forEach((a: any, i: string) => {
      this.instanceDom.parentNode.removeChild(a.dom);
    });
    this.setProxyActivity();
    this.$emit('activityMovedEnd');
    e.preventDefault();
  }

  limitScope(width: number, height: number) {
    // 最大最小宽高限制范围
    if (width <= 80) {
      width = 80;
    } else if (width >= 388) {
      width = 388;
    }
    if (height <= 40) {
      height = 40;
    } else if (height >= 200) {
      height = 200;
    }
    const activitySize = { width, height };
    return activitySize;
  }

  onConnectPoint(direction: string) {
    let startPoint: LINE.point;
    let startDirection: LINE.ArrowDirection = LINE.ArrowDirection.down;
    const vm = this;
    switch (direction) {
      case 'bottom':
        startPoint = {
          x: this.instance.center,
          y: this.instance.bottom
        };
        startDirection = LINE.ArrowDirection.down;
        break;
      case 'top':
        startPoint = {
          x: this.instance.center,
          y: this.instance.top
        };
        startDirection = LINE.ArrowDirection.up;
        break;
      case 'left':
        startPoint = {
          x: this.instance.left,
          y: this.instance.middle
        };
        startDirection = LINE.ArrowDirection.left;
        break;
      case 'right':
        startPoint = {
          x: this.instance.right,
          y: this.instance.middle
        };
        startDirection = LINE.ArrowDirection.right;
        break;
      default:
        startPoint = {
          x: this.instance.center,
          y: this.instance.bottom
        };
        break;
    }
    this.onActivityConnect({
      startActivity: this.instance,
      startPoint,
      startDirection
    }).then((res:any) => {
      if (!res) return;
      this.traceManager.AddTrace(TraceType.Line.Add, res, null, this);
    });
  }

  limitPosition(pointX: any, pointY: any) {
    // 调整尺寸时位移的限制范围
    let activityPosition = {};
    if (pointX !== undefined) {
      if (pointX >= this.instanceSize.left + this.instanceSize.width - 80) {
        pointX = this.instanceSize.left + this.instanceSize.width - 80;
      } else if (
        pointX
        <= this.instanceSize.left + this.instanceSize.width - 388
      ) {
        pointX = this.instanceSize.left + this.instanceSize.width - 388;
      }
      activityPosition = {
        x: pointX,
        y: this.instanceSize.top
      };
    }
    if (pointY !== undefined) {
      if (pointY >= this.instanceSize.top + this.instanceSize.height - 40) {
        pointY = this.instanceSize.top + this.instanceSize.height - 40;
      } else if (
        pointY
        <= this.instanceSize.top + this.instanceSize.height - 200
      ) {
        pointY = this.instanceSize.top + this.instanceSize.height - 200;
      }
      activityPosition = {
        x: this.instanceSize.left,
        y: pointY
      };
    }
    if (pointX !== undefined && pointY !== undefined) {
      activityPosition = {
        x: pointX,
        y: pointY
      };
    }
    return activityPosition;
  }
}
</script>

<style lang="less">
.activity-instance {
  width: 158px;
  height: 40px;
  cursor: move;
  position: absolute;
  line-height: 30px;
  padding: 5px;
  background: #fff;
  border-radius: 2px;
  border: 1px solid #052535;
  font-size: 14px;
  color: #000;
  z-index: 9;
  &:hover {
    border: 1px solid @primary-color;
  }
  .activity-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: Center;
    word-break: break-all;
    .content-wrap{
      max-height: 100%;
      i {
        font-size: 14px;
        margin-right: 5px;
      }
    }
  }
}
.activity-selected-first {
  border: 1px solid @primary-color !important;
  background: #E8FCF4 !important;
  .square {
    width: 12px;
    height: 12px;
    z-index: 991;
    position: absolute;
    &:after {
      width: 5px;
      height: 5px;
      border: 1px solid #666;
      content: "";
      display: block;
      background: #fff;
    }
  }
  .square-left-top {
    top: -11px;
    left: -11px;
    cursor: nw-resize;
    &:after {
      margin-top: 7px;
      margin-left: 7px;
    }
  }
  .square-left-bottom {
    bottom: -11px;
    left: -11px;
    cursor: sw-resize;
    &:after {
      margin-left: 7px;
    }
  }
  .square-right-top {
    right: -11px;
    top: -11px;
    cursor: ne-resize;
    &:after {
      margin-top: 7px;
    }
  }
  .square-right-bottom {
    bottom: -11px;
    right: -11px;
    cursor: se-resize;
  }
}
.activity-selected {
  border: 1px solid @primary-color !important;
  background: #E8FCF4 !important;
}
</style>
