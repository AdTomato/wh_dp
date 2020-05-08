<template>
  <div
    id="workflow-drawer"
    class="workflow-designer"
    tabindex="-1"
    @keydown="doKeyDown"
    @keyup="onKeyUp"
    @mousedown.stop="workflowSpaceDoDown"
    @contextmenu="contextMenu"
    ref="designer"
    :style="desingerSize"
  >
    <lines-instance :dom="$refs.designer" @contextmenu="lineContextmenu"/>
    <div class="activity-box">
      <template v-for="(instance,key) in activities">
        <activity-instance
          :key="key"
          :instance="instance"
          @dragMove="showActivityDockLine"
          @activityMoving="autoFit"
          @activityMovedEnd="activityMovedEnd"
          @resetLine="resetDockLine"
          @contextmenu="activityContextmenu"
          :dom="$refs.designer"
          draggable="true"
          v-h3-activity-drag
        />
      </template>
    </div>
    <div
      v-show="horizontalTopData.show"
      :style="{
        'left': horizontalTopData.left+'px',
        'top': horizontalTopData.top+'px',
        'width': horizontalTopData.width+'px',
      }"
      class="dock-line dock-line-horizontal dock-line-top"
    ></div>
    <div
      class="dock-line dock-line-horizontal dock-line-middle"
      v-show="horizontalMiddleData.show"
      :style="{
        'left': horizontalMiddleData.left+'px',
        'top': horizontalMiddleData.top+'px',
        'width': horizontalMiddleData.width+'px',
      }"
    ></div>
    <div
      class="dock-line dock-line-horizontal dock-line-bottom"
      v-show="horizontalBottomData.show"
      :style="{
        'left': horizontalBottomData.left+'px',
        'top': horizontalBottomData.top+'px',
        'width': horizontalBottomData.width+'px',
      }"
    ></div>
    <div
      class="dock-line dock-line-vertical dock-line-left"
      v-show="verticalLeftData.show"
      :style="{
        'left': verticalLeftData.left+'px',
        'top': verticalLeftData.top+'px',
        'height': verticalLeftData.height+'px',
      }"
    ></div>
    <div
      class="dock-line dock-line-vertical dock-line-center"
      v-show="verticalCenterData.show"
      :style="{
        'left': verticalCenterData.left+'px',
        'top': verticalCenterData.top+'px',
        'height': verticalCenterData.height+'px',
      }"
    ></div>
    <div
      class="dock-line dock-line-vertical dock-line-right"
      v-show="verticalRightData.show"
      :style="{
        'left': verticalRightData.left+'px',
        'top': verticalRightData.top+'px',
        'height': verticalRightData.height+'px',
      }"
    ></div>
    <contextmenu
      v-show="isShowContextmenu"
      :style="{top: contextmenuStyle.top + 'px', left: contextmenuStyle.left + 'px'}"
      :nodetype="contextmenuType"
      @copy="contentmenuCopy"
      @paste="contentmenuPaste"
      @remove="contentmenuRemove"
      @removeAll="contentmenuRemoveAll"
    />
    <div
      class="multiSelectBox"
      v-show="multiSelectData.show"
      :style="{
        'left': multiSelectData.left+'px',
        'top': multiSelectData.top+'px',
        'height': multiSelectData.height+'px',
        'width': multiSelectData.width+'px'
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as TraceType from '@/typings/traceType';
import * as WorkflowNamespace from '@/typings/workflow';
import { H3Droppable } from '@/directives/drag';
import WorkflowManager from '@/common/workflow/workflowManager';
import TraceManager from '@/common/workflow/workflowTrace';
import Line from '@/common/workflow/Line';
import { State, Action, namespace } from 'vuex-class';
import Workflow from '@/views/app/model/workflow.vue';
import { getCompNameByActivityType } from '@/components/apps/workflow/helper/helper';
import Bus from '@/utils/bus';

import ActivityInstance from './activity.vue';
import LinesInstance from './linesInstance.vue';
import contextmenu from './contextmenu.vue';

const WorkflowModule = namespace('Apps/Workflow');
@Component({
  name: 'WorkflowDesigner',
  components: {
    ActivityInstance,
    LinesInstance,
    contextmenu
  }
})
export default class WorkflowDesigner extends Vue implements H3Droppable {
  @WorkflowModule.State('activities') activities: any;

  @WorkflowModule.State('lines') lines: any;

  @WorkflowModule.State('workflow') workflow: any;

  @WorkflowModule.State('traceManager') traceManager: any;

  @WorkflowModule.State('tem_activity') tem_activity: any;

  @WorkflowModule.State('movedActivities') movedActivities: any;

  // 暂存移动后的节点,测试暂时设为单个节点
  @WorkflowModule.State('itemData') itemData: any;

  @WorkflowModule.State('originOffsets') originOffsets: any;

  @WorkflowModule.State('workflowElementType') workflowElementType: any;

  @WorkflowModule.State('currentActivity') currentActivity: any;

  @WorkflowModule.State('activityCopyArray') activityCopyArray: any;

  @WorkflowModule.State('selectedActivities') selectedActivities: any;

  // 当前选中数组
  @WorkflowModule.State('isSaveProp') isSaveProp:any;

  @WorkflowModule.State('isShowContextmenu') isShowContextmenu:any;

  @WorkflowModule.Mutation('select') select: any;

  @WorkflowModule.Mutation('unSelect') unSelect: any;

  @WorkflowModule.Mutation('removeLine') removeLine: any;

  @WorkflowModule.Mutation('contextMenuCopy') contextMenuCopy: any;

  @WorkflowModule.Mutation('initWorkflow') initWorkflow: any;

  @WorkflowModule.Mutation('loadWorkflow') loadWorkflow: any;

  @WorkflowModule.Mutation('activityMove') activityMove: any;

  @WorkflowModule.Mutation('setProxyPosition') setProxyPosition: any;

  @WorkflowModule.Mutation('resetCopyArray') resetCopyArray: any;

  @WorkflowModule.Mutation('showPropertyPanel') showPropertyPanel: any;

  @WorkflowModule.Mutation('setIsShowContextmenu') setIsShowContextmenu: any;

  @WorkflowModule.Action('transformData') transformData: any;

  @WorkflowModule.Action('addActivity') addActivity: any;

  @WorkflowModule.Action('onActivityMoved') onActivityMoved: any;

  @WorkflowModule.Action('getWorkflowDraft') getWorkflowDraft: any;

  @WorkflowModule.Action('updateWorkflowDraft') updateWorkflowDraft: any;

  @WorkflowModule.Action('getHistoryWorkflow') getHistoryWorkflow: any;

  @WorkflowModule.Action('removeActivity') removeActivity: any;

  @WorkflowModule.Action('getWorkflowDataItem') getWorkflowDataItem: any;

  @WorkflowModule.Action('getTaskList') getTaskList: any;

  contextmenuType: string | undefined = '';

  // 流程设置查看历史版本时按钮是否置灰
  disable:boolean = false;

  designerDom: any = undefined;

  // 绘图区外层DOM
  designerWrapDom: any = undefined;

  contextmenuStyle: any = {};

  startPoint: any = {};

  // 框选开始节点
  multiSelectData: any = { // 框选区域样式
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    show: false
  };

  desingerSize: any = { // 绘图区尺寸
    width: '100%',
    height: '100%'
  }

  // 记录绘图区宽高
  designerMinWidth: number = 0;

  designerMinHeight: number = 0;

  activityDockStack: any = {
    // 对齐线停靠时计算栈
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY
  };

  horizontalTopData: any = {
    left: 0,
    top: 0,
    width: 0,
    show: false
  };

  horizontalMiddleData: any = {
    left: 0,
    top: 0,
    width: 0,
    show: false
  };

  horizontalBottomData: any = {
    left: 0,
    top: 0,
    width: 0,
    show: false
  };

  verticalLeftData: any = {
    left: 0,
    top: 0,
    height: 0,
    show: false
  };

  verticalCenterData: any = {
    left: 0,
    top: 0,
    height: 0,
    show: false
  };

  verticalRightData: any = {
    left: 0,
    top: 0,
    height: 0,
    show: false
  };

  // 初始化节点
  async mounted() {
    Bus.$on('autoFit', this.autoFit);
    this.designerDom = this.$refs.designer as HTMLElement;
    this.designerWrapDom = document.getElementById('designer-wrap');
    /* eslint-disable-next-line */
    const workflowCode: string = this.$route.params.workflowCode;
    const schemaCode: string = this.$route.params.bizSchemaCode;

    this.initWorkflow(workflowCode);

    if (this.$route.query.version) {
      this.disable = true;
      this.$emit('buttonDisable', this.disable);
      this.getHistoryWorkflow({ workflowCode, workflowVersion: this.$route.query.version });
    } else {
      this.disable = false;
      this.$emit('buttonDisable', this.disable);
      await this.getWorkflowDraft({ workflowCode });

      // 异步问题 固使用bus传递事件
      Bus.$emit('initWorkflowEvent');

      this.designerMinWidth = this.designerDom.clientWidth;
      this.designerMinHeight = this.designerDom.clientHeight;
      this.autoFit();
    }

    // 获取当前流程的数据项
    const params = { schemaCode, hasReturn: false };
    await this.getWorkflowDataItem(params);
    Bus.$emit('initWorkflowDataItem');

    // 获取当前任务表单
    this.getTaskList(schemaCode);

    // 键盘事件
    // document.addEventListener('keydown', this.doKeyDown);
    // this.loadWorkflow();
    this.designerWrapDom.addEventListener('mousedown', this.workflowSpaceDoDown);
  }

  // 节点复制
  copyActivity() {
    if (this.selectedActivities.length) {
      // 开始或结束节点不允许复制
      if (
        this.selectedActivities[0].activityType === 'START'
        || this.selectedActivities[0].activityType === 'END'
      ) {
        this.resetCopyArray();
        return;
      }
      this.contextMenuCopy(this.selectedActivities[0]);
    }
  }

  // 节点黏贴
  pasteActivity() {
    if (!this.activityCopyArray) {
      return;
    }
    const pasteData = {
      width: this.activityCopyArray.width,
      height: this.activityCopyArray.height,
      icon: this.activityCopyArray.icon,
      activityName: this.activityCopyArray.activityName,
      name_i18n: this.activityCopyArray.name_i18n,
      activityType: this.activityCopyArray.activityType,
      top: this.activityCopyArray.top,
      left: this.activityCopyArray.left
    };
    Object.assign(pasteData, {
      icon: pasteData.icon,
      activityName: pasteData.activityName,
      top: pasteData.top + 20,
      left: pasteData.left + 20,
      x: pasteData.left + 20,
      y: pasteData.top + 20
    });
    this.addActivity(pasteData);
    // 添加痕迹
    this.traceManager.AddTrace(
      TraceType.Activity.Add,
      this.tem_activity,
      null,
      this
    );
  }

  // 节点删除 delete按钮
  deleteActivity() {
    if (!this.isSaveProp) return;
    const removedActivities: Array<WorkflowNamespace.Activity> = [...this.activities];
    removedActivities.forEach((a: any) => {
      if (a.isSelected) {
        if (a.activityType === 'START') {
          console.log('不能删除开始节点');
          return;
        } if (a.activityType === 'END') {
          console.log('不能删除结束节点');
          return;
        }
        this.removeActivity(a.ID);
        this.traceManager.AddTrace(
          TraceType.Activity.Remove,
          a,
          null,
          this
        );
      }
    });
    // 切换成别的节点，先做赋值操作
    this.transformData(-1);
    // 展示属性面板
    this.showPropertyPanel('WorkflowProperty');
  }

  // 节点删除 delete按钮
  deleteLines() {
    this.lines.forEach((l: Line) => {
      if (l.isSelected) {
        this.removeLine(l);
        this.traceManager.AddTrace(
          TraceType.Line.Remove,
          l,
          null,
          this
        );
      }
    });
    // 切换成别的节点，先做赋值操作
    this.transformData(-1);
    // 展示属性面板
    this.showPropertyPanel('WorkflowProperty');
  }

  workflowSpaceDoDown(e: any) {
    if (!this.isSaveProp) {
      this.transformData(-1); 
      return;
    }
    // 左键事件
    if ((e.button === 0 || e.button === 1) && e.type === 'mousedown') {
      // e.preventDefault();
      if (!(typeof e.target.className === 'string' && (e.target.className.indexOf('contentmenu') !== -1))) {
        this.closeContextmenu();
        this.unSelect();
      }
    } else { // 右键事件
      return;
    }
    const classNames: string[] = typeof e.target.className === 'string' ? e.target.className.split(' ') : [];
    const tagName: string = typeof e.target.nodeName === 'string' ? e.target.nodeName : '';
    if (
      ['activity', 'activity-drag-bar', 'line-rect', 'line-drag-point', 'line-text', 'contentmenu-item'].some((name: string) => classNames.includes(name))
      || ['g', 'text', 'path', 'polygon'].includes(tagName)
    ) {
      // console.log('具体元素上的点击画布不呼出菜单和边框');
    } else { // 点击绘图区
      this.startPoint = {
        x: Math.max(this.designerWrapDom.scrollLeft + (e.clientX - this.designerWrapDom.offsetLeft), 0),
        y: Math.max(this.designerWrapDom.scrollTop + (e.clientY - this.designerWrapDom.offsetTop - 64), 0)
      };
      this.designerWrapDom.addEventListener('mousemove', this.workflowSpaceMouseMove);
      document.addEventListener('mouseup', this.workflowSpaceMouseUp);
      // 展示流程属性面板
      this.transformData(-1);
      this.showPropertyPanel('WorkflowProperty');
    }
  }

  workflowSpaceMouseMove(e: any) {
    // 工作区域鼠标移动事件
    const currentPoint = {
      x: Math.max(this.designerWrapDom.scrollLeft + (e.clientX - this.designerWrapDom.offsetLeft), 0),
      y: Math.max(this.designerWrapDom.scrollTop + (e.clientY - this.designerWrapDom.offsetTop - 64), 0)
    };
    this.multiSelectData = {
      width: Math.abs(currentPoint.x - this.startPoint.x),
      height: Math.abs(currentPoint.y - this.startPoint.y),
      top: Math.min(this.startPoint.y, currentPoint.y) - 30,
      left: Math.min(this.startPoint.x, currentPoint.x) - 30,
      show: true
    };
    this.activities.forEach((a: any, i: string) => {
      if (a.left + 30 >= Math.min(this.startPoint.x, currentPoint.x)
        && a.left + 30 + a.width <= Math.max(this.startPoint.x, currentPoint.x)
        && a.top + 30 >= Math.min(this.startPoint.y, currentPoint.y)
        && a.top + 30 + a.height <= Math.max(this.startPoint.y, currentPoint.y)) {
        if (!a.isSelected) {
          this.select(a);
        }
      } else {
        this.selectedActivities.forEach((s: any, j: string) => {
          if (a.ID === s.ID) {
            this.unSelect(a);
          }
        });
      }
    });
  }

  workflowSpaceMouseUp(e: any) {
    // 工作区域鼠标松开事件
    this.designerWrapDom.removeEventListener('mousemove', this.workflowSpaceMouseMove);
    document.removeEventListener('mouseup', this.workflowSpaceMouseUp);
    this.multiSelectData = {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      show: false
    };
  }

  doKeyDown(e: any) {
    // 键盘按下事件
    if (e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    // 不处理单独的Ctrl、Alt事件
    // console.log(e);
    const vm = this;
    if (e.which === 17 || e.which === 18) {
      return;
    }

    if (e.ctrlKey && !e.altkey && !e.shiftKey) {
      if (e.which === 90) {
        // Ctrl+Z
        this.traceManager.Undo();
      } else if (e.which === 89) {
        // Ctrl+Y
        this.traceManager.Redo();
      } else if (e.which === 67) {
        // Ctrl+C
        this.copyActivity();
      } else if (e.which === 86) {
        // Ctrl+V
        // 节点的相关动作
        this.pasteActivity();
      }
    }
    // 方向键
    if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40) {
      e.preventDefault();
      // 移动的方向：左、上、右、下
      const moveDiretion = { x: 0, y: 0 };
      if (e.which === 37) moveDiretion.x = -1;
      else if (e.which === 38) moveDiretion.y = -1;
      else if (e.which === 39) moveDiretion.x = 1;
      else if (e.which === 40) moveDiretion.y = 1;

      let keyMoveInterval: number = 4; // 方向键单次按下时移动的距离
      if (e.shiftKey) {
        // Shift减速
        keyMoveInterval *= 0.25;
      } else if (e.ctrlKey) {
        // Ctrl加速
        keyMoveInterval *= 4;
      }
      const beforeActivities = JSON.parse(JSON.stringify(this.selectedActivities));
      // 单选
      if (this.selectedActivities.length === 1) {
        const movingObject = this.selectedActivities[0];
        const ActivityMoveOffset = {
          x: Math.max(moveDiretion.x * keyMoveInterval, 0 - movingObject.left),
          y: Math.max(moveDiretion.y * keyMoveInterval, 0 - movingObject.top)
        };
        const position = {
          x: movingObject.left + ActivityMoveOffset.x,
          y: movingObject.top + ActivityMoveOffset.y
        };
        if (ActivityMoveOffset.x !== 0 || ActivityMoveOffset.y !== 0) {
          this.activityMove({ itemData: movingObject, activityPosition: position });
          this.traceManager.AddTrace(
            TraceType.Activity.Move,
            this.selectedActivities,
            beforeActivities,
            this
          );
        }
      } else if (this.selectedActivities.length > 1) { // 多选
        this.selectedActivities.forEach((a: any, i: string) => {
          const thisMoveOffset = {
            x: Math.max(moveDiretion.x * keyMoveInterval, 0 - a.left),
            y: Math.max(moveDiretion.y * keyMoveInterval, 0 - a.top)
          };
          const positions = {
            x: a.left + thisMoveOffset.x,
            y: a.top + thisMoveOffset.y
          };
          this.activityMove({ itemData: a, activityPosition: positions });
        });
        this.traceManager.AddTrace(
          TraceType.Activity.Move,
          this.selectedActivities,
          beforeActivities,
          this
        );
      }
    }
    if (e.ctrlKey && e.which === 65) {
      // 全选:Ctrl + A
      e.preventDefault();
      this.select();
    } else if (e.which === 46) {
      // Delete 删除
      e.preventDefault();
      vm.deleteActivity();
      vm.deleteLines();
    } else if (e.which === 27) {
      // ESC取消所有选择
      e.preventDefault();
      this.unSelect();
    }

    this.autoFit({ type: 'keyCtrl', curActivity: this.selectedActivities });
  }

  showContextmenu() {
    this.setIsShowContextmenu(true);
  }

  closeContextmenu() {
    this.setIsShowContextmenu(false);
  }

  setContextPosition(e: any) {
    const designerDom = this.$refs.designer as HTMLElement;
    const _scrollTop = (document.getElementById('designer-wrap') as any).scrollTop;
    const _scrollLeft = (document.getElementById('designer-wrap') as any).scrollLeft;
    // todo
    this.contextmenuStyle.left = e.clientX - designerDom.offsetLeft + _scrollLeft;
    this.contextmenuStyle.top = e.clientY - designerDom.offsetTop + _scrollTop - 65;
  }

  // 绘图区右键菜单
  contextMenu(e: any) {
    e.preventDefault();
    if (!this.activityCopyArray) return;
    // 设置菜单位置
    this.setContextPosition(e);
    this.showContextmenu();
    this.contextmenuType = 'Workflow';
  }

  // activity组件emit的鼠标右键事件
  activityContextmenu(activityModel: WorkflowNamespace.Activity, activityEvent: any) {
    if (
      this.currentActivity.activityType === 'START'
      || this.currentActivity.activityType === 'END'
    ) {
      this.resetCopyArray();
      return;
    }
    this.closeContextmenu();
    this.setContextPosition(activityEvent);
    this.showContextmenu();
    if (activityModel) {
      this.contextmenuType = activityModel.WorkflowElementType;
      if (this.selectedActivities.length >= 2) {
        this.contextmenuType = 'mutilSelected';
      }
    }
  }

  // line组件emit的鼠标右键事件
  lineContextmenu(lineModel: Line, lineEvent: any) {
    lineEvent.stopPropagation();
    this.closeContextmenu();
    this.setContextPosition(lineEvent);
    this.showContextmenu();
    if (lineModel) {
      this.contextmenuType = lineModel.WorkflowElementType;
    }
  }

  /**
   * 右键菜单的按钮事件
  */
  contentmenuCopy() {
    if (this.contextmenuType === 'Activity' || this.contextmenuType === 'mutilSelected') {
      this.copyActivity();
      this.closeContextmenu();
    }
  }

  contentmenuPaste() {
    this.pasteActivity();
    this.closeContextmenu();
  }

  contentmenuRemove() {
    if (this.contextmenuType === 'Activity') {
      this.deleteActivity();
      this.closeContextmenu();
    } else if (this.contextmenuType === 'Line') {
      this.deleteLines();
      this.closeContextmenu();
    }
  }

  contentmenuRemoveAll() {
    this.deleteActivity();
    this.closeContextmenu();
  }

  onDragenter(evt: DragEvent) {
    this.transformData(-1);
    // console.log('拖拽进入到绘图区：', evt);
  }

  onDragover(evt: DragEvent) {
    evt.preventDefault();
  }

  onDragleave(evt: DragEvent) {
    evt.preventDefault();
  }

  onDrop(evt: DragEvent) {
    if (!this.isSaveProp) return;
    // console.log('放置了节点到绘图区：', evt);
    this.resetDockLine();
    const transferResult = this.getTransferData(evt);
    if (!transferResult) {
      return;
    }

    const activityPosition = this.getActivityPosition(
      evt,
      transferResult.offsetsToActivityJson,
      this.$refs.designer
    );

    /* 处理新增或移动节点的对应数据变化 */
    const itemData = JSON.parse(transferResult.activityDataJson);
    if (transferResult.activityTypeJson === 'activity') {
      this.activityMove({ itemData, activityPosition });
      this.traceManager.AddTrace(
        TraceType.Activity.Move,
        this.movedActivities,
        itemData,
        this
      );
      this.$nextTick(() => {
        const activity = this.activities.find((item: WorkflowNamespace.Activity) => item.activityCode === itemData.activityCode);
        this.onActivityMoved(activity);
      });
    } else if (transferResult.activityTypeJson === 'activityModel') {
      // 节点的相关动作
      Object.assign(itemData, {
        width: 158,
        height: 40,
        icon: itemData.icon,
        activityName: itemData.activityName,
        name_i18n: itemData.name_i18n,
        top: activityPosition.y,
        left: activityPosition.x,
        x: activityPosition.x,
        y: activityPosition.y
      });
      this.addActivity(itemData);
      // 添加痕迹[]
      this.traceManager.AddTrace(
        TraceType.Activity.Add,
        this.tem_activity,
        null,
        this // 传vue实例以便在类里面访问store
      );
      this.unSelect();
      this.select(this.tem_activity);

      // 展示当前添加节点的属性
      let propertyCompName:string|undefined = '';
      propertyCompName = getCompNameByActivityType(itemData.activityType);
      // 切换成别的节点，先做赋值操作
      this.transformData(this.tem_activity.ID);
      // 展示属性面板
      this.showPropertyPanel(propertyCompName);

      this.autoFit({ type: 'add', curActivity: [this.tem_activity] });
    }
  }

  getActivityPosition(evt: DragEvent, offsetsToActivityJson: any, dom: any) {
    const offsetsToActivity = JSON.parse(offsetsToActivityJson);
    const offsetToClient = {
      x: evt.clientX,
      y: evt.clientY
    };

    const designerDom: any = dom;
    /* 计算得出节点左上角原点相对于画布坐标轴（左上角）的相对坐标位置 */
    const activityPosition = {
      x: Math.max(
        this.designerWrapDom.scrollLeft
        + (offsetToClient.x - designerDom.offsetLeft)
        - offsetsToActivity.x,
        0
      ),
      y: Math.max(
        this.designerWrapDom.scrollTop
        + (offsetToClient.y - designerDom.offsetTop - 64)
        - offsetsToActivity.y,
        0
      )
    };

    return activityPosition;
  }

  activityMovedEnd() {
    this.autoFit();
  }

  onKeyUp() {
    this.autoFit();
  }

  /**
   *@params type: mouseCtrl  keyCtrl
   *@params curActivity: 移动中的活动
   *@params undefinded： 拖拽完成计算尺寸
   * */
  autoFit(params?: any) {
    const designerDom = this.$refs.designer as HTMLElement;
    // 取右侧最大right 和 最大bottom
    let _right:number = 0;
    let _bottom:number = 0;
    this.activities.forEach((activity:WorkflowNamespace.Activity) => {
      if (activity.right > _right) {
        _right = activity.right;
      }
      if (activity.bottom > _bottom) {
        _bottom = activity.bottom;
      }
    });

    if (!params || params.type === 'add') {
      if (_right < this.designerMinWidth) {
        this.desingerSize.width = '100%';
      } else {
        this.desingerSize.width = `${_right.toString()}px`;
      }

      if (_bottom < this.designerMinHeight) {
        this.desingerSize.height = '100%';
      } else {
        this.desingerSize.height = `${_bottom.toString()}px`;
      }
      return;
    }


    if (!params.type || !params.curActivity || params.curActivity.length <= 0) return;
    const _width = params.curActivity[0].width; // 拖动节点宽度
    const _height = params.curActivity[0].height; // 拖动节点高度

    const _type = params.type;
    const _activity = params.curActivity[0];

    let activityRightEdage:number = 0;
    let activityBottomEdage:number = 0;

    if (_type === 'mouseCtrl') {
      activityRightEdage = this.parsePxToNumber(_activity.dom.style.left) + _width; // 节点的最右边
      activityBottomEdage = this.parsePxToNumber(_activity.dom.style.top) + _height; // 节点的最下边
    } else {
      activityRightEdage = _activity.right;
      activityBottomEdage = _activity.bottom;
    }

    // 设置画布的宽度
    if (designerDom.clientWidth <= activityRightEdage) { // 节点已经超出画布
      this.desingerSize.width = `${activityRightEdage.toString()}px`;

      // 滚动到最右边
      this.designerWrapDom.scrollLeft = activityRightEdage;
    } else { // 节点没有超出画布
      // eslint-disable-next-line no-lonely-if
      if (_activity.right >= _right) {
        this.desingerSize.width = `${activityRightEdage.toString()}px`;
        this.designerWrapDom.scrollLeft = _activity.right;
        // console.log('节点在最右边');
      }
      // else {
      //   this.desingerSize.width = `${_right.toString()}px`;
      //   this.designerWrapDom.scrollLeft = activityRightEdage - _activity.width;
      //   console.log('节点不在最右边');
      // }
    }

    // 设置画布的高度
    if (designerDom.clientHeight <= activityBottomEdage) { // 节点已超出画布
      this.desingerSize.height = `${activityBottomEdage.toString()}px`;

      this.designerWrapDom.scrollTop = _activity.bottom;
    } else { // 节点没有超出画布
      // eslint-disable-next-line no-lonely-if
      if (_activity.bottom >= _bottom) {
        this.desingerSize.height = `${activityBottomEdage.toString()}px`;
        this.designerWrapDom.scrollTop = _activity.bottom;
      }
    }
  }

  parsePxToNumber(px:string) {
    if (!px) return;
    const strNum = px.split('px')[0];
    return parseInt(strNum, 10);
  }

  getTransferData(evt: DragEvent) {
    // 获取拖拽传输的数据
    const transfer = evt.dataTransfer;
    // 如果传入的数据中不包含指定的type，则判定传入数据不完整，不作处理。
    if (
      !transfer
      || !transfer.types.some((t: string) => ['origin-offsets', 'item-data', 'workflow-element-type'].includes(t))
    ) {
      return;
    }
    /* 拖拽节点上传送的光标位置相对于节点的偏移量json */
    const offsetsToActivityJson: string = transfer.getData('origin-offsets');
    /* 施放节点时光标位置相对于画布的偏移量json */
    const activityDataJson: string = transfer.getData('item-data');
    /* 施放节点的类型 */
    const activityTypeJson: string = transfer.getData('workflow-element-type');
    if (!offsetsToActivityJson || !activityDataJson || !activityTypeJson) {
      return;
    }
    const transferData: any = {
      offsetsToActivityJson,
      activityDataJson,
      activityTypeJson
    };
    return transferData;
  }

  showActivityDockLine(evt: DragEvent) {
    // 显示对齐线逻辑
    this.resetDockLine();
    const _width = this.itemData.width;
    const _height = this.itemData.height;
    const activityPosition = this.getActivityPosition(
      evt,
      JSON.stringify(this.originOffsets),
      this.$refs.designer
    );
    const _center = activityPosition.x + _width / 2;
    const _middle = activityPosition.y + _height / 2;
    const _right = activityPosition.x + _width;
    const _bottom = activityPosition.y + _height;
    this.activityDockStack.x = Number.POSITIVE_INFINITY;
    this.activityDockStack.y = Number.POSITIVE_INFINITY;
    this.initHorizontalDock();
    this.initVerticalDock();
    const vm: any = this;
    this.activities.forEach((e: any, i: string) => {
      if (activityPosition.x) {
        // 左
        if (
          Math.abs(e.left - activityPosition.x) <= 10
          && Math.abs(e.left - activityPosition.x)
          < Math.abs(vm.activityDockStack.x)
        ) {
          vm.activityDockStack.x = e.left - activityPosition.x;
          this.initHorizontalDock();
          vm.activityDockStack.OffsetLeftDockActivities.push(e);
        } else if (e.left - activityPosition.x === vm.activityDockStack.x) {
          vm.activityDockStack.OffsetLeftDockActivities.push(e);
        }
        // 中
        if (
          Math.abs(e.center + -_center) <= 10
          && Math.abs(e.center + -_center) < Math.abs(vm.activityDockStack.x)
        ) {
          vm.activityDockStack.x = e.center - _center;
          this.initHorizontalDock();
          vm.activityDockStack.CenterDockActivities.push(e);
        } else if (e.center - _center === vm.activityDockStack.x) {
          vm.activityDockStack.CenterDockActivities.push(e);
        }
        // 右
        if (
          Math.abs(e.right - _right) <= 10
          && Math.abs(e.right - _right) < Math.abs(vm.activityDockStack.x)
        ) {
          vm.activityDockStack.x = e.right - _right;
          this.initHorizontalDock();
          vm.activityDockStack.RightDockActivities.push(e);
        } else if (e.right - _right === vm.activityDockStack.x) {
          vm.activityDockStack.RightDockActivities.push(e);
        }
      }
      if (activityPosition.y) {
        // 上
        if (
          Math.abs(e.top - activityPosition.y) <= 10
          && Math.abs(e.top - activityPosition.y)
          < Math.abs(vm.activityDockStack.y)
        ) {
          vm.activityDockStack.y = e.top - activityPosition.y;
          this.initVerticalDock();
          vm.activityDockStack.TopDockActivities.push(e);
        } else if (e.top - activityPosition.y === vm.activityDockStack.y) {
          vm.activityDockStack.TopDockActivities.push(e);
        }
        // 中
        if (
          Math.abs(e.middle - _middle) <= 10
          && Math.abs(e.middle - _middle) < Math.abs(vm.activityDockStack.y)
        ) {
          vm.activityDockStack.y = e.middle - _middle;
          this.initVerticalDock();
          vm.activityDockStack.MiddleDockActivities.push(e);
        } else if (e.middle - _middle === vm.activityDockStack.y) {
          vm.activityDockStack.MiddleDockActivities.push(e);
        }
        // 下
        if (
          Math.abs(e.bottom - _bottom) <= 10
          && Math.abs(e.bottom - _bottom) < Math.abs(vm.activityDockStack.y)
        ) {
          vm.activityDockStack.y = e.bottom - _bottom;
          this.initVerticalDock();
          vm.activityDockStack.BottomDockActivities.push(e);
        } else if (e.bottom - _bottom === vm.activityDockStack.y) {
          vm.activityDockStack.BottomDockActivities.push(e);
        }
      }
    });
    if (
      vm.activityDockStack.x !== Number.POSITIVE_INFINITY
      || vm.activityDockStack.y !== Number.POSITIVE_INFINITY
    ) {
      if (Math.abs(vm.activityDockStack.x) < Number.POSITIVE_INFINITY) {
        activityPosition.x += vm.activityDockStack.x;
        const positionX = {
          x: `${activityPosition.x}px`,
          y: undefined
        };
        this.setProxyPosition({ item: this.itemData, position: positionX });
      }
      if (Math.abs(vm.activityDockStack.y) < Number.POSITIVE_INFINITY) {
        activityPosition.y += vm.activityDockStack.y;
        const positionY = {
          x: undefined,
          y: `${activityPosition.y}px`
        };
        this.setProxyPosition({ item: this.itemData, position: positionY });
      }
      // 显示对齐线
      if (Math.abs(vm.activityDockStack.x) <= 10) {
        // 左对齐
        if (
          vm.activityDockStack.OffsetLeftDockActivities
          && vm.activityDockStack.OffsetLeftDockActivities.length > 0
        ) {
          let _minBottom = activityPosition.y + _height;
          let _maxTop = activityPosition.y;
          vm.activityDockStack.OffsetLeftDockActivities.forEach((e: any, i: string) => {
            if (_minBottom > e.bottom) {
              _minBottom = e.bottom;
            }
            if (_maxTop < e.top) {
              _maxTop = e.top;
            }
          });
          vm.verticalLeftData = {
            left: activityPosition.x,
            top: _minBottom,
            height: (_maxTop - _minBottom) > 0 ? (_maxTop - _minBottom) : 0,
            show: true
          };
        }
        // 中
        if (
          vm.activityDockStack.CenterDockActivities
          && vm.activityDockStack.CenterDockActivities.length > 0
        ) {
          let _minBottom = activityPosition.y + _height;
          let _maxTop = activityPosition.y;
          vm.activityDockStack.CenterDockActivities.forEach((e: any, i: string) => {
            if (_minBottom > e.bottom) {
              _minBottom = e.bottom;
            }
            if (_maxTop < e.top) {
              _maxTop = e.top;
            }
          });
          vm.verticalCenterData = {
            left: activityPosition.x + _width / 2,
            top: _minBottom,
            height: (_maxTop - _minBottom) > 0 ? (_maxTop - _minBottom) : 0,
            show: true
          };
        }
        // 右对齐
        if (
          vm.activityDockStack.RightDockActivities
          && vm.activityDockStack.RightDockActivities.length > 0
        ) {
          let _minBottom = activityPosition.y + _height;
          let _maxTop = activityPosition.y;
          vm.activityDockStack.RightDockActivities.forEach((e: any, i: string) => {
            if (_minBottom > e.bottom) {
              _minBottom = e.bottom;
            }
            if (_maxTop < e.top) {
              _maxTop = e.top;
            }
          });
          vm.verticalRightData = {
            left: activityPosition.x + _width,
            top: _minBottom,
            height: (_maxTop - _minBottom) > 0 ? (_maxTop - _minBottom) : 0,
            show: true
          };
        }
      }
      if (Math.abs(vm.activityDockStack.y) <= 10) {
        // 上对齐
        if (
          vm.activityDockStack.TopDockActivities
          && vm.activityDockStack.TopDockActivities.length > 0
        ) {
          let _minRight = activityPosition.x + _width;
          let _maxOffsetLeft = activityPosition.x;
          vm.activityDockStack.TopDockActivities.forEach((e: any, i: string) => {
            if (_minRight > e.right) {
              _minRight = e.right;
            }
            if (_maxOffsetLeft < e.left) {
              _maxOffsetLeft = e.left;
            }
          });
          vm.horizontalTopData = {
            left: _minRight,
            top: activityPosition.y,
            width: (_maxOffsetLeft - _minRight) > 0 ? (_maxOffsetLeft - _minRight) : 0,
            show: true
          };
        }
        // 中
        if (
          vm.activityDockStack.MiddleDockActivities
          && vm.activityDockStack.MiddleDockActivities.length > 0
        ) {
          let _minRight = activityPosition.x + _width;
          let _maxOffsetLeft = activityPosition.x;
          vm.activityDockStack.MiddleDockActivities.forEach((e: any, i: string) => {
            if (_minRight > e.right) {
              _minRight = e.right;
            }
            if (_maxOffsetLeft < e.left) {
              _maxOffsetLeft = e.left;
            }
          });
          vm.horizontalMiddleData = {
            left: _minRight,
            top: activityPosition.y + _height / 2,
            width: (_maxOffsetLeft - _minRight) > 0 ? (_maxOffsetLeft - _minRight) : 0,
            show: true
          };
        }
        // 下
        if (
          vm.activityDockStack.BottomDockActivities
          && vm.activityDockStack.BottomDockActivities.length > 0
        ) {
          let _minRight = activityPosition.x + _width;
          let _maxOffsetLeft = activityPosition.x;
          vm.activityDockStack.BottomDockActivities.forEach((e: any, i: string) => {
            if (_minRight > e.right) {
              _minRight = e.right;
            }
            if (_maxOffsetLeft < e.left) {
              _maxOffsetLeft = e.left;
            }
          });
          vm.horizontalBottomData = {
            left: _minRight,
            top: activityPosition.y + _height,
            width: (_maxOffsetLeft - _minRight) > 0 ? (_maxOffsetLeft - _minRight) : 0,
            show: true
          };
        }
      }
    }
  }

  initHorizontalDock() {
    this.activityDockStack.OffsetLeftDockActivities = [];
    this.activityDockStack.CenterDockActivities = [];
    this.activityDockStack.RightDockActivities = [];
  }

  initVerticalDock() {
    this.activityDockStack.TopDockActivities = [];
    this.activityDockStack.MiddleDockActivities = [];
    this.activityDockStack.BottomDockActivities = [];
  }

  resetDockLine() {
    this.horizontalTopData = {};
    this.horizontalMiddleData = {};
    this.horizontalBottomData = {};
    this.verticalLeftData = {};
    this.verticalCenterData = {};
    this.verticalRightData = {};
  }

  @Watch('$route')
  onRouteChange() {
    /* eslint-disable-next-line */
    const workflowCode: string = this.$route.params.workflowCode;
    this.initWorkflow(workflowCode);
    this.showPropertyPanel('WorkflowProperty');
    this.unSelect();
    this.getWorkflowDraft({ workflowCode });
    this.traceManager.Clear();
  }
}
</script>

<style lang="less">
.workflow-designer {
  width: 100%;
  height: 100%;
  position: relative;
  .multiSelectBox {
    position: absolute;
    border: 2px dotted black;
    z-index: 999;
  }
  #workflow-drawer {
    position: relative;
  }
  .dock-line {
    position: absolute;
  }
  .dock-line-horizontal {
    height: 0;
    border-style: dotted;
    border-width: 1px 0 0 0;
  }
  .dock-line-vertical {
    width: 0;
    border-style: dotted;
    border-width: 0 1px 0 0;
  }

}
</style>
