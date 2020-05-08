<template>
  <div class="workflow">
    <div class="workflow-head" @click="closeContextmenu">
      <div class="workflow-head-l">
        <span class="workflow-name" :title="workflowName">{{ workflowName }}</span>
        <span
          class="workflow-version"
          v-if="workflowVersion !== 0"
        >版本{{ workflowVersion }}</span>
        <span
          class="workflow-version"
          v-else-if="workflowData.workflowVersion !== 0 && workflowVersion === 0"
        >版本{{ workflowData.workflowVersion }}</span>
        <span v-else class="workflow-version">草稿</span>
      </div>
      <div class="workflow-head-c">
        <ul>
          <li
            class="toolbar"
            :class="{'disabled': dicDisabled}"
            @click="horizontal"
          >
            <i class="icon aufontAll h-icon-all-same-high"></i>
            <span>水平等距</span>
          </li>
          <li
            class="toolbar"
            :class="{'disabled': dicDisabled}"
            @click="vertical"
          >
            <i class="icon aufontAll h-icon-all-same-width"></i>
            <span>垂直等距</span>
          </li>
          <li class="toolbar" @click="saveImage">
            <i class="icon aufontAll h-icon-all-picture-o"></i>
            <span>存为图片</span>
          </li>
          <li
            class="toolbar"
            :class="{'disabled': sizeDisabled}"
            @click="sameSize"
          >
            <i class="icon aufontAll h-icon-all-same-size"></i>
            <span>等大小</span>
          </li>
          <li
            class="toolbar"
            :class="{'disabled': sizeDisabled}"
            @click="sameHeight"
          >
            <i class="icon aufontAll h-icon-all-highly-adaptive-o"></i>
            <span>等高</span>
          </li>
          <li
            class="toolbar"
            :class="{'disabled': sizeDisabled}"
            @click="sameWidth"
          >
            <i class="icon aufontAll h-icon-all-width-adaptive-o"></i>
            <span>等宽</span>
          </li>
          <li
            class="toolbar"
            :class="{'disabled': undoDisabled}"
            @click="revoke"
          >
            <i class="icon aufontAll h-icon-all-rollback-o"></i>
            <span>撤销</span>
          </li>
          <li
            class="toolbar"
            :class="{'disabled': redoDisabled}"
            @click="goBack"
          >
            <i class="icon aufontAll h-icon-all-cancell-o"></i>
            <span>返回</span>
          </li>
          <!-- <li class="toolbar" @click="reset">
            <i class="icon aufontAll h-icon-all-reload-o"></i>
            <span>重置</span>
          </li>-->
        </ul>
      </div>
      <div class="workflow-head-r">
        <button
          class="workflow-btn"
          :class="{'disabled': isDisabled}"
          :disabled="isDisabled"
          @click="openWorkflowSetting"
        >
          <i class="icon aufontAll h-icon-all-setting-o"></i>
          <span>流程设置</span>
        </button>
        <button
          class="workflow-btn"
          :class="{'disabled': isDisabled}"
          :disabled="isDisabled"
          @click="validate"
        >
          <i class="icon aufontAll h-icon-all-file-searching-o"></i>
          <span>检验</span>
        </button>
        <button
          class="workflow-btn"
          :class="{'disabled': isDisabled}"
          @click="saveWorkflow"
          :disabled="isDisabled"
        >
          <i class="icon aufontAll h-icon-all-save-o"></i>
          <span>保存</span>
        </button>
        <button
          class="workflow-btn publish"
          :class="{'disabled': isDisabled}"
          :disabled="isDisabled"
          @click="showPublishModal"
        >
          <i class="icon aufontAll h-icon-all-plane-o"></i>
          <span>发布</span>
        </button>
      </div>
    </div>
    <div class="workflow-content">
      <!-- 节点仓库 -->
      <div @click="closeContextmenu">
        <h3-sider
          :options="leftPanel"
          class="workflow-panel"
          @toggle="doAutoFit"
        >
          <model-contain/>
        </h3-sider>
      </div>
      <!-- 流程绘图区 -->
      <div id="designer-wrap" class="designer-wrap">
        <workflow-designer @buttonDisable="buttonDisable" v-h3-drop/>
      </div>
      <!-- 节点属性/流程属性 -->
      <div @click="closeContextmenu">
        <h3-sider
          :options="rightPanel"
          class="workflow-panel"
          @toggle="doAutoFit"
        >
          <div
            class="property-name"
          >
            {{ curComponent === 'WorkflowProperty' ? '流程属性' : (curComponent === 'LineProperty'?'连接线属性':'节点属性') }}
          </div>
          <component :is="curComponent"/>
        </h3-sider>
      </div>
    </div>

    <tip-modal
      v-model="isShowErrorValidate"
      :warningMsg="warningMsg"
      :errorMsg="errMsg"
      :type="validateOrPublish"
      @release="stillRelease"
    />

    <a-modal
      v-model="isShowPublishModal"
      class="publish-modal"
      okText="发布"
      cancelText="取消"
      @ok="publish"
      :maskClosable="false"
      :keyboard="false"
    >
      <p slot="title">
        发布说明
        <span class="title-tip">用于历史版本介绍</span>
      </p>

      <div class="desc-box">
        <textarea
          placeholder="请输入说明（120字以内）必填"
          v-model="publishDesc"
          maxlength="120"
        ></textarea>
        <div class="desc-num">{{ publishDesc.length }}/120</div>
      </div>
    </a-modal>

    <a-modal
      v-model="isShowSaveConfirm"
      :closable="false"
      :maskClosable="false"
      :width="400"
      wrapClassName="unsave-confirm">
      <div class="unsave-confirm--content">
        <i class="icon aufontAll h-icon-all-question-circle"></i>
        <strong>您刚对流程设置进行了修改，是否保存后再离开？</strong>
      </div>

      <template slot="footer">
        <a-button key="cancel" @click="handleConfirmCancel">{{ $t("languages.Apps.Cancel") }}</a-button>
        <a-button key="unsave" @click="handleConfirmUnsave">{{ $t("languages.Apps.Unsave") }}</a-button>
        <a-button
          key="save"
          type="primary"
          @click="handleConfirmOk"
        >{{ $t("languages.Apps.SaveAndLeave") }}</a-button>
      </template>
    </a-modal>

    <!-- 校验loading -->
    <div :class="isValidated ? 'validate-loading-box active' : 'validate-loading-box'">
      <span><a-icon type="loading"/></span>
      流程检验中
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import '@/directives/drag';
import html2canvas from 'html2canvas';
import canvg from 'canvg';
import H3Sider from '@/common/sider/sider.vue';
import * as WorkflowNamespace from '@/typings/workflow';

import WorkflowProperty from '@/components/apps/workflow/workflowProperty.vue';
import UserActivityProperty from '@/components/apps/workflow/userActivityProperty.vue';
import SystemActivityProperty from '@/components/apps/workflow/systemActivityProperty.vue';
import SubInstanceProperty from '@/components/apps/workflow/subIntanceProperty.vue';
import ConnectionProperty from '@/components/apps/workflow/connectionProperty.vue';
import CirculateProperty from '@/components/apps/workflow/circulateProperty.vue';
import LineProperty from '@/components/apps/workflow/lineProperty.vue';

import MappingModal from '@/components/apps/workflow/modals/mapping.vue';
import { LINE } from '@/typings/line';

import Bus from '@/utils/bus';

import BizMethodApi from '@/apis/biz-method/index.api';

import ModelContain from '../workflowDesigner/modelContain.vue';
import WorkflowDesigner from '../workflowDesigner/workflowDesigner.vue';
import tipModal from '../workflowDesigner/tipModal.vue';


const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'workflow',
  components: {
    H3Sider,
    ModelContain,
    WorkflowDesigner,
    tipModal,

    /* 引入属性组件 */
    WorkflowProperty,
    UserActivityProperty,
    SystemActivityProperty,
    SubInstanceProperty,
    ConnectionProperty,
    CirculateProperty,
    LineProperty
  },
  beforeRouteUpdate(to, from, next) {
    (this as any).validRoute().then(
        () => { 
          next();
        },
        () => {
          next(false);
        }
      );
  },
  beforeRouteLeave(to, from, next) {
    const vm = this as any;
    vm.validRoute().then(
        () => { 
          next();
          vm.showPropertyPanel('WorkflowProperty');
          vm.unSelect();
          vm.traceManager.Clear();
        },
        () => { 
          next(false);
        }
      );
    
  }
})

export default class Workflow extends Vue {
  @WorkflowModule.State('traceManager') traceManager: any;

  @WorkflowModule.State('activities') activities: any;

  @WorkflowModule.State('lines') lines: any;

  @WorkflowModule.State('workflowData') workflowData: any;

  @WorkflowModule.State('workflow') workflow: any;

  @WorkflowModule.State('selectedActivities') selectedActivities: any;

  @WorkflowModule.State('beforeMovedActivities') beforeMovedActivities: any;

  @WorkflowModule.State('WorkflowDataItem_origin') WorkflowDataItemOrigin:any;

  @WorkflowModule.State('curComponent') curComponent: any;

  @WorkflowModule.State('isSaveProp') isSaveProp:any;

  @WorkflowModule.Mutation('initTraceManager') initTraceManager: any;

  @WorkflowModule.Mutation('resetWorkflow') resetWorkflow: any;

  @WorkflowModule.Mutation('setIsShowContextmenu') setIsShowContextmenu: any;

  @WorkflowModule.Mutation('setWorkflowVersion') setWorkflowVersion: any;

  @WorkflowModule.Mutation('unSelect') unSelect: any;

  @WorkflowModule.Mutation('showPropertyPanel') showPropertyPanel: any;

  @WorkflowModule.Mutation('setBizMethodList') setBizMethodList: any;

  @WorkflowModule.Mutation('propsToData') propsToData: any;

  @WorkflowModule.Mutation('dataToProps') dataToProps: any;

  @WorkflowModule.Mutation('setCurActivityID') setCurActivityID: any;

  @WorkflowModule.Action('updateWorkflowDraft') updateWorkflowDraft: any;

  @WorkflowModule.Action('validateWorkflow') validateWorkflow: any;

  @WorkflowModule.Action('transformData') transformData: any;

  @WorkflowModule.Action('releaseWorkflow') releaseWorkflow: any;

  @WorkflowModule.Action('getWorkflowList') getWorkflowList: any;

  @Prop({ type: String }) appCode: any;

  @Prop({ type: String }) workflowCode: any;

  @Prop({ type: String }) bizSchemaCode: any;

  leftPanel: any = {
    width: 160,
    minWidth: 160,
    maxWidth: 700,
    direction: 'left',
    collapsible: true
  };

  rightPanel: any = {
    width: 394,
    minWidth: 300,
    maxWidth: 800,
    direction: 'right',
    collapsible: true
  };

  validateOrPublish:string = '';

  isShowErrorValidate: boolean = false;

  isShowPublishModal: boolean = false;

  isShow: boolean = false;

  isDisabled: boolean = false;

  dicDisabled:boolean = true; // 水平等距、垂直等距按钮是否禁用

  sizeDisabled:boolean = true; // 等大小、等高、等宽按钮是否禁用

  publishDesc:string = '';

  lastTraceIndex:number = -1; // 保存后的痕迹序号

  warningMsg = [];

  errMsg = [];

  workflowVersion:any = 0;

  flag:boolean = true;

  // 流程检验loading
  isValidated:boolean = false;

  // 是否展示未保存提示弹窗
  isShowSaveConfirm: boolean = false;

  saveConfirmPromiseResolve : Function | null = null
  
  saveConfirmPromiseReject : Function | null = null

  get workflowName() {
    const { locale } = this.$i18n;
    if (locale === 'zh') {
      return this.workflowData.workflowName;
    }
    if (!this.workflowData.name_i18n) {
      return this.workflowData.workflowName;
    }
    return this.workflowData.name_i18n[locale];
  }

  // 撤销按钮是否禁用
  get undoDisabled() {
    if (this.traceManager.LastTraceIndex > -1) {
      return false;
    }
    return true;
  }

  // 返回按钮是否禁用
  get redoDisabled() {
    if (this.traceManager.LastTraceIndex < this.traceManager.TraceStack.length - 1) {
      return false;
    }
    return true;
  }

  created() {
    this.initTraceManager();
    if (this.$route.query.version) {
      this.workflowVersion = this.$route.query.version;
    }
    this.getMethodList();
  }

  // 路由变化时检测做了修改的需要保存
  validRoute() {
    const vm = this as Workflow;
    const changed: boolean = vm.traceManager && vm.traceManager.LastTraceIndex !== vm.lastTraceIndex;
    if (!changed) {
      return Promise.resolve();
    }
    this.isShowSaveConfirm = true;
    return new Promise((resolve, reject) => {
      this.saveConfirmPromiseResolve = resolve;
      this.saveConfirmPromiseReject = reject;
    })
  }

  /**
   * 点击取消按钮
   */
  handleConfirmCancel(){
    this.isShowSaveConfirm = false;
    if(this.saveConfirmPromiseReject){
      this.saveConfirmPromiseReject();
      this.saveConfirmPromiseReject = null;
    }
  }
  /**
   * 点击不保存按钮
   */
  handleConfirmUnsave(){
    this.isShowSaveConfirm = false;
    if(this.saveConfirmPromiseResolve){
      this.saveConfirmPromiseResolve();
      this.saveConfirmPromiseResolve = null;
    }
  }
  /**
   * 点击保存按钮
   */
  handleConfirmOk(){
    this.saveWorkflow().then(
      () => {
      this.handleConfirmUnsave();
    }, () => {
      this.handleConfirmCancel();
    }
    );
  }

  // validRoute(fn:any) {
  //   const vm = this as Workflow;
  //   if (vm.traceManager && vm.traceManager.LastTraceIndex !== vm.lastTraceIndex) {
  //     this.$confirm({
  //       title: '您刚对流程设置进行了修改，是否保存后再离开？',
  //       okText: '保存并离开',
  //       cancelText: '不保存',
  //       async onOk() {
  //         await vm.saveWorkflow();
  //         fn();
  //       },
  //       onCancel() {
  //         fn();
  //       }
  //     });
  //   } else {
  //     fn();
  //   }
  // }

  // 关闭右键菜单
  closeContextmenu() {
    this.setIsShowContextmenu(false);
  }

  // 水平等距
  horizontal() {
    this.workflow.setSameStyle(WorkflowNamespace.SameStyle.HorizontalDistance, this);
    Bus.$emit('autoFit');
  }

  // 垂直等距
  vertical() {
    this.workflow.setSameStyle(WorkflowNamespace.SameStyle.VerticalDistance, this);
    Bus.$emit('autoFit');
  }

  // 存为图片
  saveImage() {
    if (!this.flag) {
      return;
    }
    this.flag = false;
    const svg = document.getElementsByClassName('lines-instance')[0] as HTMLElement;
    if (typeof html2canvas !== 'undefined') {
      // 以下是对svg的处理
      const parentNode = document.getElementsByClassName('lines-wrap')[0];
      const svg2 = svg.outerHTML.trim();
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      canvg(canvas, svg2, { ignoreMouse: true, ignoreAnimation: true });
      svg.style.display = 'none';

      // 对图标的处理--开始
      const icon = document.getElementsByClassName('activity-icon');
      for (let i = 0; i < icon.length; i += 1) {
        const iconparentNode = icon[i].parentNode as HTMLElement;
        const icon2 = icon[i] as HTMLElement;
        const iconcanvas = document.createElement('canvas');
        iconcanvas.width = 14;
        iconcanvas.height = 14;
        iconcanvas.style.marginRight = '5px';
        iconcanvas.style.verticalAlign = 'middle';
        const content = document.getElementsByClassName('activity-icon')[i].textContent;

        // 获取画布
        const context:any = iconcanvas.getContext('2d');
        // 设置字体，能实现的关键点2
        context.font = '14px aufontAll';
        // 绘制内容
        context.fillText(content, 0, 12);

        iconparentNode.insertBefore(iconcanvas, icon2);
        icon2.style.display = 'none';
      }
      // 对图标的处理--完成

      // html2canvas将DOM转为canvas存为图片
      const timer = setTimeout(() => {
        const dom = document.querySelector('#workflow-drawer') as HTMLElement;
        html2canvas(dom, {
          allowTaint: true,
          height: dom.offsetHeight,
        }).then((canva:any) => {
          svg.style.display = 'block';
          parentNode.removeChild(canvas);
          for (let i = 0; i < icon.length; i += 1) {
            const iconparentNode = icon[i].parentNode as HTMLElement;
            const icon2 = icon[i] as HTMLElement;
            const iconcanvas = document.getElementsByTagName('canvas')[0];
            iconparentNode.removeChild(iconcanvas);
            icon2.style.display = 'inline-block';
          }
          const image = new Image();
          image.src = canva.toDataURL('image/png');
          const aLink = document.createElement('a');
          aLink.href = image.src;
          aLink.download = `${this.workflowData.workflowName}.png`;
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          const canvas2 = document.createElement('canvas');
          canvas2.id = 'canvas';
          parentNode.appendChild(canvas2);
          this.flag = true;
          clearTimeout(timer);
        });
      }, 1000);
    }
  }

  // 等大小
  sameSize() {
    this.workflow.setSameStyle(WorkflowNamespace.SameStyle.Size, this);
    Bus.$emit('autoFit');
  }

  // 等高
  sameHeight() {
    this.workflow.setSameStyle(WorkflowNamespace.SameStyle.Height, this);
    Bus.$emit('autoFit');
  }

  // 等宽
  sameWidth() {
    this.workflow.setSameStyle(WorkflowNamespace.SameStyle.Width, this);
    Bus.$emit('autoFit');
  }

  // 撤销
  revoke() {
    this.traceManager.Undo();
    Bus.$emit('autoFit');
  }

  // 监听sider收起
  doAutoFit() {
    Bus.$emit('autoFit');
  }

  // 返回
  goBack() {
    this.traceManager.Redo();
    Bus.$emit('autoFit');
  }
  // 重置
  // 功能已实现，后因某些原因撤销此按钮
  // 20181211
  // reset() {
  //   const vm = this;
  //   this.$warning({
  //     title: "重置会清空全部节点操作，确定重置吗？",
  //     onOk() {
  //       vm.resetWorkflow();
  //     }
  //   });
  // }

  /**
   * 格式化消息通知数据
   */
  notifyDataForamt(data:any) {
    let array:any = [];
    if (typeof data === 'string')  {
      array = JSON.parse(data)
    } else {
      array = JSON.parse(JSON.stringify(data));
    }
    // const array:Array<any> = JSON.parse(JSON.stringify(data));
    let obj:any = {};
    const json:Array<any> = [];
    array.forEach((item:any) => {
      item = item.trim();
      if (item) {
        const isItemData:boolean = this.WorkflowDataItemOrigin.findIndex((dataItem:any) => dataItem.code === item) > -1;
        if (isItemData) {
          obj = {
            isDataItem: 1,
            code: item
          };
        } else {
          obj = {
            isDataItem: 0,
            code: item
          };
        }
        json.push(obj);
      } 
    });

    return json;
  }

  // 消息内容
  summaryDataForamt(data:any){
    if (!data) return;
    let code:string = ''; 
    const obj = {
                  isDataItem: 2,
                  code: ''
                };
    if (typeof data === 'string') {
      obj.code = data;
    } else {
      obj.code = data[0] ? data[0].code : '';
    }

    return [obj];
  }


  contentDataFormator(item:any){
    if (!item) return;
    if (Array.isArray(item)) {
      return JSON.stringify(this.notifyDataForamt(item));
    } else {
      return item;
    }
  }

  // 设置数据
  setWorkflowDataForAjax() {
    // 先保存已修改过得数据
    // this.transformData(-1);
    this.propsToData();
    const _activities = JSON.parse(JSON.stringify(this.activities));
    const _linesConfig = JSON.parse(JSON.stringify(this.lines));
    const _lines: Array<any> = [];
    // content转json string
    const _workflowData:any = JSON.parse(JSON.stringify(this.workflowData));
    // 将流程时间转成json格式
      const workflowEventKeys:Array<string> = ['activateEventHandler', 'endEventHandler', 'cancelEventHandler', 'startEventHandler'];
      workflowEventKeys.forEach((key:string) => {
        if (_workflowData[key]) {
          const _content:any = _workflowData[key].content;
          _workflowData[key].content = this.contentDataFormator(_content);
        }
      });

    _workflowData.name_i18n = JSON.stringify(_workflowData.name_i18n);
    _activities.forEach((item: any) => {
      // 因为流程编码可能与应用编码或其他编码重复，故加前缀，转成数据时去前缀
      if (item.workflowCode && item.workflowCode.indexOf('-') > -1) {
        [, item.workflowCode] = item.workflowCode.split('-');
      }

      // 当中文为空的时候，将国际化语言复制给中文
      if (!item.activityName) {
        item.activityName = item.name_i18n[this.$i18n.locale];
      }

      // 用户活动节点需要的消息通知需要做格式化
      //  summary:[{"isDataItem":0:自定义数据；1:数据项,"code":数据项字段}]
      // 20190705 title同上
      if (item.activityType === 'PARTICIPANT') {
        item.todoDataItem.summary = this.summaryDataForamt(item.todoDataItem.summary);
        item.todoDataItem.title = this.notifyDataForamt(item.todoDataItem.title);
      }

      // 流程事件 content转数组
      const needTransformActivityTypes:Array<string> = ['PARTICIPANT', 'SYSTEM_ACTIVITY', 'SUB_INSTANCE', 'CIRCULATE'];
      const acticityEventTypes:Array<string> = ['beforeActivate', 'afterActivate', 'cancelActivity', 'endActivity', 'jobRejected', 'jobSubmitted'];
      if (needTransformActivityTypes.indexOf(item.activityType) > -1) {
        acticityEventTypes.forEach((key:string) => {
          if (item[key]) {
            const _content:any = item[key].content;
            item[key].content = this.contentDataFormator(_content);
          }
        })
      }

      delete item.left;
      delete item.top;
      delete item.right;
      delete item.bottom;
      delete item.middle;
      delete item.center;
      delete item.ID;
      delete item.WorkflowElementType;
    });
    this.lines.forEach((line: any) => {
      const _points = line.points.map((pointObj: LINE.point) => `${pointObj.x}, ${pointObj.y}`);
      _lines.push({
        text: line.text,
        name_i18n: JSON.stringify(line.name_i18n),
        utilizeElse: line.utilizeElse || false,
        fixedPoint: true,
        formula: line.formula || '',
        popupType: line.popupType,
        preActivityCode: line.startActivity.activityCode,
        postActivityCode: line.endActivity.activityCode,
        points: _points
      });
    });

    const params = {};
    if (!_workflowData.workflowName) {
      const workflowNameObj = JSON.parse(_workflowData.name_i18n);
      _workflowData.workflowName = workflowNameObj[this.$i18n.locale];
    }
    Object.assign(params, _workflowData, {
      activities: _activities,
      rules: _lines,
      remarks: this.publishDesc
    });
    return params;
  }


  props2DataAndReset() {
    // 将当前节点属性转成数据
    this.dataToProps();
    // 重置当前节点
    this.setCurActivityID(-1);
  }

  // 保存 by John
  saveWorkflow() {
    if (!this.isSaveProp) return;
    const params = this.setWorkflowDataForAjax();
    return this.updateWorkflowDraft(params).then((res: any) => {
      if (res.errcode === 0) {
        this.lastTraceIndex = this.traceManager.LastTraceIndex;
        this.$message.success(res.errmsg);
        this.unSelect();
        this.props2DataAndReset();
        this.showPropertyPanel('WorkflowProperty');
        this.getWorkflowMenus();
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  // 流程检验 by John
  validate() {
    if (!this.isSaveProp) return;
    const params = this.setWorkflowDataForAjax();
    this.validateOrPublish = 'validate';
    this.isValidated = true;
    setTimeout(() => {
      this.validateWorkflow(params).then(this.thenHandler);
    }, 500);
  }

  // 流程发布 by john
  publish() {
    if (!this.isSaveProp) return;

    if (this.publishDesc === '') { // 发布说明为空不可发布
      this.$message.error('请填写发布说明');
      return;
    }

    const params = this.setWorkflowDataForAjax();
    this.validateOrPublish = 'publish';
    this.releaseWorkflow(params).then(this.thenHandler);
  }

  thenHandler(res:any) {
    this.isValidated = false;
    const successStr = this.validateOrPublish === 'validate' ? '流程检验通过!' : '发布成功!';
    const errorStr = this.validateOrPublish === 'validate' ? '流程检验异常，请稍后重试!' : '发布失败，请重试！';
    this.isShowPublishModal = false;
    this.publishDesc = '';
    if (res.errcode === 0) {
      if (res.data && res.data.length > 0) {
        const filtedMsg = this.filterMsg(res.data);
        if (filtedMsg) {
          this.errMsg = filtedMsg.err;
          this.warningMsg = filtedMsg.warn;
          this.isShowErrorValidate = true;
        }
      } else {
        this.lastTraceIndex = this.traceManager.LastTraceIndex;
        if (this.validateOrPublish === 'validate') {
          this.$message.success(successStr);
        } else {
          this.setWorkflowVersion(res.errmsg);
          this.$message.success(`版本（Version ${res.errmsg}）流程发布成功！`);
        }
      }
      if (this.validateOrPublish === 'publish') {
        this.getWorkflowMenus();
      }
    } else {
      this.$message.error(errorStr);
    }
    this.unSelect();
    this.props2DataAndReset();
    this.showPropertyPanel('WorkflowProperty');
  }

  /**
   * @desc 获取流程设计菜单
   * @todo 寻找更合理的方案
  */
  getWorkflowMenus() {
    const params = {
      schemaCode: this.$route.params.bizSchemaCode
    };
    this.getWorkflowList(params);
  }

  // 流程发布弹窗
  showPublishModal() {
    if (!this.isSaveProp) return;

    // 先校验
    const params = this.setWorkflowDataForAjax();
    this.validateOrPublish = 'publish';
    this.validateWorkflow(params).then((res:any) => {
      if (res.errcode === 0) {
        if (res.data && res.data.length > 0) {
          const filtedMsg = this.filterMsg(res.data);
          if (filtedMsg) {
            this.errMsg = filtedMsg.err;
            this.warningMsg = filtedMsg.warn;
            this.isShowErrorValidate = true;
          }
        } else {
          this.isShowPublishModal = true;
        }
      } else {
        this.$message.error('流程检验异常，请稍后重试!');
      }
    });
  }

  filterMsg(msg: any) {
    if (msg) {
      const _msg = JSON.parse(JSON.stringify(msg));
      const warnMsg = _msg.filter((item: any) => item.errorLevel === 'WARN');
      const errMsg = _msg.filter((item: any) => item.errorLevel === 'ERROR');
      return { warn: warnMsg, err: errMsg };
    }
  }

  // 打开流程设置页面
  openWorkflowSetting() {
    if (this.workflowCode && this.bizSchemaCode && this.appCode) {
      const { href } = this.$router.resolve({
        name: 'workflowSetting',
        params: {
          appCode: this.appCode,
          bizSchemaCode: this.bizSchemaCode,
          workflowCode: this.workflowCode
        }
      });
      window.open(href, '_blank');
    }
  }

  // 流程设置查看历史版本时按钮置灰事件
  buttonDisable(disabled:boolean) {
    this.isDisabled = disabled;
  }

  stillRelease() {
    this.isShowPublishModal = true;
  }

  /**
   * 获取业务方法列表
   */
  getMethodList() {
    const param: BizMethod.ListParam = {
      schemaCode: this.bizSchemaCode
    };
    BizMethodApi.listBizMethods(param).then((res: any) => {
      if (Array.isArray(res.data)) {
        this.setBizMethodList(res.data);
      }
    });
  }

  @Watch('selectedActivities')
  onSelectActivitiesChange(v:any) {
    if (v && v.length >= 2) {
      this.sizeDisabled = false;
      if (v.length >= 3) {
        this.dicDisabled = false;
      } else {
        this.dicDisabled = true;
      }
    } else {
      this.dicDisabled = true;
      this.sizeDisabled = true;
    }
  }

 @Watch('$i18n.locale')
  onLanguageChange() {
    this.propsToData();
  }
}
</script>

<style lang="less" scoped>
.workflow {
  .workflow-head {
    display: flex;
    width: 100%;
    height: 48px;
    overflow: hidden;
    background: #fafafa;
    .workflow-head-l {
      flex: none;
      padding: 0 24px;
      width: 220px;
      text-align: left;
      .workflow-name {
        max-width: 112px;
        white-space:nowrap;
        text-overflow:ellipsis;
        -o-text-overflow:ellipsis;
        overflow:hidden;
        font-size: 16px;
        line-height: 48px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        display: inline-block;
        font-weight: bold;
      }
      .workflow-version {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        margin-left: 8px;
        line-height: 48px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    .workflow-head-c {
      flex-grow: 1;
      text-align: center;
      ul {
        height: 100%;
        width: 100%;
        overflow: hidden;
        &:after {
          content: "";
          display: block;
          height: 0;
          clear: both;
        }
        .toolbar {
          display: inline-block;
          line-height: 48px;
          margin-left: 16px;
          font-size: 12px;
          cursor: pointer;
          user-select: none;
          color: rgba(0, 0, 0, 0.65);
          &:hover {
            color: @primary-color;
          }
          i {
            font-size: 14px;
            vertical-align: middle;
            margin-right: 5px;
            &:before {
              transform: rotate(180deg);
            }
          }
        }
        .disabled {
          color: #ccc;
          cursor: not-allowed;
          &:hover {
            color: #ccc;
          }
        }
      }
    }
    .workflow-head-r {
      flex: none;
      margin-right: 24px;
      .workflow-btn {
        background: #fff;
        margin-top: 8px;
        margin-left: 8px;
        cursor: pointer;
        border: 1px solid #d9d9d9;
        padding: 0 16px;
        height: 32px;
        border-radius: 4px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        transition: all .5s ease;
        &:hover {
          border-color: @primary-color;
          color: @primary-color;
        }
        i {
          margin-right: 5px;
          font-size: 14px;
        }
      }
      .disabled{
        color: rgba(0,0,0,0.25);
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        cursor: not-allowed;
      }
      .publish {
        background: @primary-color;
        color: #fff;
        &:hover{
          background: @primary-color;
          color: #fff;
        }
      }
    }
  }
  .workflow-content {
    display: flex;
    height: calc(100% - 49px);
    width: 100%;

    .property-name {
      width: 100%;
      height: 46px;
      line-height: 46px;
      text-align: center;
      border-bottom: 1px solid #e9e9e9;
    }
    .designer-wrap{
      padding: 30px 30px 50px 30px;
      flex-grow: 1;
      overflow: auto;
    }
  }

  /deep/.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 12px 0 12px 30px;
    font-weight: 600;
    color: rgba(0,0,0,0.85);
  }
  /deep/.ant-collapse > .ant-collapse-item > .ant-collapse-header .arrow {
    left: 8px;
  }
  /deep/.ant-select-selection__rendered {
    line-height: 32px;
  }
  .validate-loading-box {
    position: fixed;
    top: 75px;
    left: 50%;
    margin-left: -100px;
    text-align: center;
    width: 197px;
    height: 42px;
    line-height: 42px;
    box-shadow:0px 0px 4px 0px rgba(0,0,0,0.43);
    background: white;
    color: #4A4A4A;
    transform: scale(0);
    transition: all ease .3s;
    span {
      margin-right: 8px;
    }
    &.active {
      transform: scale(1);
    }
  }
}
.workflow-panel {
  position: relative;
  z-index: 10;
  height: 100%;
}

.ant-modal-body {
  padding: 16px 24px;
}

.title-tip {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.desc-box {
  height: 223px;
  position: relative;
  .desc-num {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    text-align: right;
  }
  textarea {
    width: 100%;
    height: 100%;
    font-size: 14px;
    border: none;
    resize: none;
    outline: none;
  }
}
</style>
