import { LINE } from '@/typings/line';
import * as WorkflowNamespace from '@/typings/workflow';
import Line from '@/common/workflow/Line';
import TraceManager from '@/common/workflow/workflowTrace';
import WorkflowManager from '@/common/workflow/workflowManager';
import WorkflowApi from '@/apis/workflow';
import AppItem from '@/apis/apps';

import { list } from '@/apis/form/form.api'

/* Controller */
import { autoDrawLine, redrawOnActivityChange, redrawLines } from '@/common/workflow/controllers/line';
// import Vue from 'vue';

// 兼容老数据, 老数据没有语言版本
const compatibleOldData = (params: any) => {
  const localeList: Array<string> = ['en']; // 语言列表
  const { data, type } = params;
  let key = '';

  switch (type) {
    case 'workflow':
      key = 'workflowName';
      break;
    case 'activity':
      key = 'activityName';
      break;
    case 'line':
      key = 'text';
      break;
    default:
      break;

  }

  localeList.forEach((local: string) => {
    if (!data.name_i18n) {
      data.name_i18n = {};
      data.name_i18n[local] = data[key] || '';
    } else if (data.name_i18n[local] === '') {
      data.name_i18n[local] = data[key] || '';
    }
  });
  return data;
}

// 事件
const contentDataFormator = (content:string) => {
  if (content) { // content 老数据是字符串  新数据是json string [{isDataItem: 0, code: 'dsds'}]
    let arr:Array<string> = [];  
      try { // json字符串 
        const _arr:any = JSON.parse(content);
        if (_arr.length > 0) {
          _arr.forEach((item:any) => {
            arr.push(item.code);
          })
        }
      } catch { // 普通字符串
        arr.push(content);
      }
      return arr;
    } 
    return null;
  }

const state = {
  tem_activity: {},
  movedActivities: {},
  activities: [],
  lines: [],
  workflow: {},
  traceManager: {},
  // 临时绘线缓存——在实时绘线时用于展示的临时数据
  tempLine: undefined,

  /* 保存流程数据 */
  workflowData: {
    workflowName: null,
    workflowVersion: null
  },
  itemData: {}, // 节点拖拽时保存节点对象
  originOffsets: {},
  workflowElementType: '',
  currentActivity: {}, // 选中的当前活动
  activityCopyArray: undefined, // ctrl+c复制的活动节点
  proxyActivity: [], // 拖拽活动节点代理
  selectedActivities: [], // 选中的活动节点的集合
  firsttActivityId: undefined, // 当前选中的活动节点集合里的第一个元素ID
  beforeMovedActivities: [],
  curComponent: '',
  curActivityID: -1,
  curActivityProps: { // 保存当前节点/连接线的属性
    ID: 0,
    type: '',
    acticityEvent: {},
    activitySenior: {},
    commonSettings: {},
    dataItem: {},
    operation: {},
    participant: {},
    workflowDataMaps: [],
    todoDataItem: {},
  },
  formulaTree: [], // 参与者弹窗/条件弹窗的树形数据
  /* 流程设置-参数设置-用户范围表格数据数组 */
  scopeList: [],
  historyList: [], // 历史版本-流程模板历史列表数据
  subWorkflowTplsTree: [], // 子流程模板树形结构
  WorkflowDataItem: [], // 当前流程的数据项列表
  WorkflowDataItem_origin: [], // 为过滤的数据项
  WorkflowDataItem_all: [], // 未做任何过滤的数据项
  childWorkflowSchemaCode: '', // 子流程的schemacode
  taskList: [], // 任务表单
  isSaveProp: true,
  isShowContextmenu: false,  // 控制右键菜单的显示隐藏
  bizMethodList: [], // 业务方法列表

  workflowMenus: [], // 流程菜单
};

/* ///////////////////////////////////////////////////////////////// */

const mutations = {
  setWorkflowNameI18n(state: any, params: any) {
    const { name, locale } = params;
    state.workflowData.name_i18n[locale] = name;
  },

  setWorkflowVersion(state: any, version: any) {
    if (!version) {
      return;
    }
    state.workflowData.workflowVersion = parseInt(version, 10);
  },

  initWorkflow(state: any, workflowCode: string) {
    state.workflow = new WorkflowManager(workflowCode);
  },

  resetWorkflow(state: any) {
    state.workflow.resetWorkflow();
    state.activities = state.workflow.activities;
    state.lines = state.workflow.lines;
    redrawLines(state.lines);
  },

  initTraceManager(state: any) {
    state.traceManager = new TraceManager();
  },

  setBizMethodList(state: any, arr: any) {
    if (arr) {
      state.bizMethodList = arr.filter((l: any) => !l.defaultMethod);
    }
  },

  // 更新workflowManager里面的节点编码，防止重复编码的出现
  setActivityCodeToWM(state: any) {
    if (!state.isSaveProp) return;
    const aCodes: Array<string> = [];
    state.activities.forEach((activity: WorkflowNamespace.Activity) => {
      aCodes.push(activity.activityCode);
    })
    state.workflow.activityCodeArr = aCodes;
  },

  addActivity(state: any, acticitieModel: WorkflowNamespace.Activity) {
    const _acticity = state.workflow.addActivity(acticitieModel);
    // 校验用户活动节点是否有默认任务表单, 如果无，则添加默认任务表单
    // 20191028 by John
    if (_acticity.activityType === 'PARTICIPANT' || _acticity.activityType === 'CIRCULATE') {
      const _sheetCode = _acticity.sheetCode ? _acticity.sheetCode : (state.taskList.length > 0 ? state.taskList[0].code : '');
      _acticity.sheetCode = _sheetCode;
    }
    const locale:string = window.localStorage.getItem('locale') as string;
    if (!_acticity.name_i18n[locale]) {
      _acticity.name_i18n[locale] = _acticity.activityName;
    }
    state.activities.push(_acticity);
    state.tem_activity = _acticity;
  },

  setActivityToState(state: any, activities: Array<WorkflowNamespace.Activity>) {
    state.activities = activities;
  },

  updateActivityProps(state: any, updatedActivity: WorkflowNamespace.Activity) {
    state.activities.forEach((activity: WorkflowNamespace.Activity, index: number) => {
      if (activity.activityCode === updatedActivity.activityCode) {
        // fix:
        // state.activities[index] = updatedActivity;
        state.activities.splice(index, 1, updatedActivity);
      }
    });
  },

  updateLineProps(state: any, updatedLine: Line) {
    state.lines.forEach((line: Line) => {
      if (line.ID === updatedLine.ID) {
        line = updatedLine;
      }
    });
  },

  select(state: any, acticitieModel?: WorkflowNamespace.Activity) {
    // 活动节点选中
    if (acticitieModel) {
      if (!acticitieModel.isSelected) {
        state.selectedActivities.push(acticitieModel);
        state.activities.forEach((e: any, i: string) => {
          if (e.activityCode === acticitieModel.activityCode) {
            e.isSelected = true;
            state.currentActivity = e;
          }
        });
      }
      state.beforeMovedActivities = JSON.parse(JSON.stringify(state.selectedActivities));
    } else {
      state.selectedActivities = [];
      state.activities.forEach((e: any, i: string) => {
        state.selectedActivities.push(e);
        e.isSelected = true;
      });
    }
    if (state.selectedActivities.length > 0) {
      state.firsttActivityId = state.selectedActivities[0].ID;
    } else {
      state.firsttActivityId = undefined;
    }
  },

  unSelect(state: any, acticitieModel?: WorkflowNamespace.Activity) {
    // 活动节点取消选中
    if (acticitieModel) {
      state.activities.forEach((e: any, i: string) => {
        if (e.activityCode === acticitieModel.activityCode) {
          let index;
          state.selectedActivities.forEach((s: any, j: string) => {
            if (e.ID === s.ID) {
              index = j;
            }
          });
          state.selectedActivities.splice(index, 1);
          e.isSelected = false;
        }
      });
    } else {
      state.activities.forEach((e: any, i: string) => {
        state.selectedActivities = [];
        e.isSelected = false;
      });
    }
    if (state.selectedActivities.length > 0) {
      state.firsttActivityId = state.selectedActivities[0].ID;
    } else {
      state.firsttActivityId = undefined;
    }
  },

  switchToFirst(state: any, acticitieModel: WorkflowNamespace.Activity) {
    if (!acticitieModel) {
      return;
    }
    state.currentActivity = acticitieModel;
    if (state.selectedActivities[0].ID !== acticitieModel.ID) {
      state.firsttActivityId = acticitieModel.ID;
      let index;
      let model = {};
      state.selectedActivities.forEach((e: any, i: string) => {
        if (acticitieModel.ID === e.ID) {
          index = i;
          model = e;
        }
      });
      state.selectedActivities.splice(index, 1);
      state.selectedActivities.splice(0, 0, model);
    }
  },

  activityMove(state: any, params: any) {
    // 移动活动节点位置
    const acticitieModel = params.itemData;
    const position = params.activityPosition;
    state.activities.some((e: any, i: string) => {
      if (e.activityCode === acticitieModel.activityCode) {
        e.left = position.x;
        e.top = position.y;
        e.x = position.x;
        e.y = position.y;
        e.right = position.x + acticitieModel.width;
        e.bottom = position.y + acticitieModel.height;
        e.center = position.x + (acticitieModel.width / 2);
        e.middle = position.y + (acticitieModel.height / 2);
        state.movedActivities = e;
        return true;
      }
    });
    if (state.movedActivities) {
      redrawOnActivityChange([state.movedActivities], state.lines);
    }
  },

  addLine(state: any, line: Line) {
    if (!line.name_i18n) {
      line = compatibleOldData({ data: line, type: 'line' });
    } else {
      line.name_i18n = JSON.parse((line.name_i18n as string));
    }
    state.lines.push(line);
    line.renew(state.lines);
  },

  removeLine(state: any, line: Line) {
    state.lines = state.lines.filter((m: Line) => m.ID !== line.ID);
    redrawLines(state.lines);
    /* 添加痕迹管理 */
    // state.traceManager.AddTrace(TraceType.Line.Remove, line, state.activities, state.lines);
  },

  setLines(state: any, payload: Array<Line>) {
    state.lines = payload;
    state.workflow.activities = state.activities;
  },

  setTempLine(state: any, line: Line) {
    state.tempLine = line;
  },

  setSize(state: any, params: any) {
    // 改变活动节点尺寸
    const acticitieModel = params.instance;
    const size = params.activitySize;
    state.activities.some((e: any, i: string) => {
      if (e.activityCode === acticitieModel.activityCode) {
        e.width = size.width;
        e.height = size.height;
        e.right = e.x + size.width;
        e.bottom = e.y + size.height;
        e.center = e.x + (size.width / 2);
        e.middle = e.y + (size.height / 2);
        state.movedActivities = e;
        return true;
      }
      return false;
    });
    if (state.movedActivities) {
      redrawOnActivityChange([state.movedActivities], state.lines);
    }
  },

  // 保存流程数据
  setWorkflowData(state: any, data: any) {
    if (!data.name_i18n) {
      data = compatibleOldData({ data: data, type: 'workflow' });
    } else {
      data.name_i18n = JSON.parse(data.name_i18n);
    }
    const _workflowData: any = {};
    _workflowData.id = data.id;
    _workflowData.schemaCode = data.schemaCode;
    _workflowData.workflowName = data.workflowName;
    _workflowData.name_i18n = data.name_i18n;
    _workflowData.workflowCode = data.workflowCode;
    _workflowData.icon = data.icon;
    _workflowData.pcOriginate = data.pcOriginate;
    _workflowData.mobileOriginate = data.mobileOriginate;
    _workflowData.sortKey = data.sortKey;
    _workflowData.workflowVersion = data.workflowVersion;
    _workflowData.templateType = data.templateType;

    // 流程事件 已定义
    _workflowData.startEventHandler = data.startEventHandler;
    _workflowData.cancelEventHandler = data.cancelEventHandler;
    _workflowData.activateEventHandler = data.activateEventHandler;
    _workflowData.endEventHandler = data.endEventHandler;

    state.workflowData = _workflowData;
  },

  setDataTransfer(state: any, params: any) {
    // 设置移动节点时传入参数
    if (params && params.itemData) {
      state.itemData = params.itemData;
      state.originOffsets = params.originOffsets;
      state.workflowElementType = params.workflowElementType;
    }
  },

  contextMenuCopy(state: any, params: WorkflowNamespace.Activity) {
    // 右键菜单复制或ctrl+c复制
    state.activityCopyArray = params;
  },

  resetCopyArray(state: any) {
    // 重置复制节点模板
    state.activityCopyArray = undefined;
  },

  setProxyActivity(state: any, params: any) {
    // 设置活动节点代理对象
    if (params) {
      state.proxyActivity.push(params);
    } else {
      // 传入参数为空时，重置拖拽代理
      state.proxyActivity = [];
    }
  },

  setProxyPosition(state: any, params: any) {
    // 设置活动节点代理对象位置
    let moveOffsetX = 0;
    let moveOffsetY = 0;
    if (state.proxyActivity.length === 1 && params) {
      state.proxyActivity.forEach((a: any) => {
        if (params.item.ID === a.ID) {
          if (params.position.x) {
            a.dom.style.left = params.position.x;
            moveOffsetX = parseInt(params.position.x, 10) - params.item.left;
          }
          if (params.position.y) {
            a.dom.style.top = params.position.y;
            moveOffsetY = parseInt(params.position.y, 10) - params.item.top;
          }
        }
      });
    }
    else if (state.proxyActivity.length > 1 && params) {
      moveOffsetX = parseInt(params.position.x, 10) - params.item.left;
      moveOffsetY = parseInt(params.position.y, 10) - params.item.top;
      let _minleft = Number.POSITIVE_INFINITY;
      let _mintop = Number.POSITIVE_INFINITY;
      state.proxyActivity.forEach((item: any) => {
        if (parseInt(item.left, 10) < _minleft) {
          _minleft = parseInt(item.left, 10);
        }
        if (parseInt(item.top, 10) < _mintop) {
          _mintop = parseInt(item.top, 10);
        }
      });
      const _realOffsetX = Math.max(_minleft + moveOffsetX, 0) - _minleft;
      const _realOffsetY = Math.max(_mintop + moveOffsetY, 0) - _mintop;
      state.proxyActivity.forEach((item: any) => {
        item.dom.style.left = `${_realOffsetX + item.left}px`;
        item.dom.style.top = `${_realOffsetY + item.top}px`;
      })
    }
  },

  // 展示属性组件 component为组件的name
  showPropertyPanel(state: any, component: string) {
    if (!state.isSaveProp) return;
    if (component !== '') {
      state.curComponent = component;
    } else {
      throw 'error component';
    }
  },

  dataToProps(state: any, type?: string) {
    /* 将连接线的数据转换为属性面板可读取数据 */
    if (type && type === 'line') {
      const _curLine: Line = state.lines.find((l: Line) => l.ID === state.curActivityID);
      if (!_curLine) return;
      const _obj = {
        commonSettings: {
          // modalType: 'expression'\'formula'
          text: _curLine.text || '',
          name_i18n: _curLine.name_i18n,
          code: _curLine.code,
          formula: _curLine.formula || '',
          utilizeElse: !!_curLine.utilizeElse,
          popupType: _curLine.popupType,
        }
      };
      // console.log('eee', _obj);
      Object.assign(state.curActivityProps, _obj);
      // 中断后续的操作
      return;
    }
    /* 将节点的数据转换为属性面板可读取的对象格式 */
    const _curActivity = state.activities.find((activity: WorkflowNamespace.Activity) => {
      return activity.ID === state.curActivityID;
    });
    if (!_curActivity) return;
    const _sheetCode = _curActivity.sheetCode ? _curActivity.sheetCode : (state.taskList.length > 0 ? state.taskList[0].code : '');
    let workflowCode: any;
    if (_curActivity.workflowCode) {
      if (_curActivity.workflowCode.indexOf('-') > -1) {
        workflowCode = _curActivity.workflowCode;
      } else {
        workflowCode = `workflow-${_curActivity.workflowCode}`; // 子流程模板， 因为流程编码可能与应用编码或其他编码重复，故加前缀
      }
    } else {
      workflowCode = '';
    }
    const _object = {
      commonSettings: {
        activityCode: _curActivity.activityCode,
        activityName: _curActivity.activityName,
        name_i18n: _curActivity.name_i18n,
        sheetCode: _sheetCode,
        bizActions: _curActivity.bizActions,
        finishCondition: _curActivity.finishCondition,
        sync: _curActivity.sync,
        workflowCode: workflowCode,
        finishStartActivity: _curActivity.finishStartActivity, // 发起环节
        workflowChooseAction: _curActivity.workflowChooseAction, // 发起环节 
        triggerMappingObj: _curActivity.triggerMappingObj,
      },
      participant: {
        popupType: _curActivity.popupType,
        participant: _curActivity.participant,
        participantType: _curActivity.participantType,
        participationModel: _curActivity.participationModel,
        approveExit: _curActivity.approveExit,
        disapproveExit: _curActivity.disapproveExit,
        targetActivityCode: _curActivity.targetActivityCode,
        noParticipant: _curActivity.noParticipant,
        originator: _curActivity.originator,
        perviousParticipate: _curActivity.perviousParticipate,
        participated: _curActivity.participated,
        followUpParticipate: _curActivity.followUpParticipate,
        noParticipantNextActivity: _curActivity.noParticipantNextActivity
      },
      dataItem: _curActivity.propertyPermissions,
      operation: _curActivity.permittedAction,
      activitySenior: {
        allowedTime: _curActivity.allowedTime,
        timeoutWarning1: _curActivity.timeoutWarning1,
        timeoutWarning2: _curActivity.timeoutWarning2,
        timeoutStrategy: _curActivity.timeoutStrategy
      },
      acticityEvent: {
        beforeActivate: _curActivity.beforeActivate,
        afterActivate: _curActivity.afterActivate,
        endActivity: _curActivity.endActivity,
        cancelActivity: _curActivity.cancelActivity,
        jobSubmitted: _curActivity.jobSubmitted,
        jobRejected: _curActivity.jobRejected
      },
      workflowDataMaps: _curActivity.workflowDataMaps || [],
      todoDataItem: _curActivity.todoDataItem
    };
    Object.assign(state.curActivityProps, _object);
  },

  propsToData(state: any) {
    if (state.curActivityID === -1) return false;
    /* 检查是否为节点 */
    const _index = state.activities.findIndex((activity: WorkflowNamespace.Activity) => {
      return activity.ID === state.curActivityID;
    });

    if (state.curActivityID !== -1 && _index !== -1) {
      // 赋值 给activity
      const operation = state.curActivityProps.operation;
      const dataItem = state.curActivityProps.dataItem;
      const workflowDataMaps = state.curActivityProps.workflowDataMaps;
      const todoDataItem = state.curActivityProps.todoDataItem;
      Object.assign(state.activities[_index], {
        ...state.curActivityProps.commonSettings,
        ...state.curActivityProps.participant,
        ...state.curActivityProps.activitySenior,
        ...state.curActivityProps.acticityEvent,
        permittedAction: operation,
        propertyPermissions: dataItem,
        workflowDataMaps: workflowDataMaps,
        todoDataItem: todoDataItem
      })

      // 修改节点上相关线段的开始或者结束节点
      state.lines.forEach((line: Line) => {
        if (!line.startActivity || !line.endActivity) return;

        if (line.startActivity.ID === state.curActivityID) {
          line.startActivity = state.activities[_index];
        } else if (line.endActivity.ID === state.curActivityID) {
          line.endActivity = state.activities[_index];
        }
      })
    };
    /* 检查是否为连接线 */
    const _lineIndex = state.lines.findIndex((line: Line) => {
      return line.ID === state.curActivityID;
    });
    if (state.curActivityID !== -1 && _lineIndex !== -1) {
      const _line: Line = state.lines[_lineIndex];
      _line.setTextPosition();
      // 赋值
      Object.assign(state.lines[_lineIndex], {
        ...state.curActivityProps.commonSettings,
        formula: state.curActivityProps.commonSettings.utilizeElse ? '' : state.curActivityProps.commonSettings.formula
      })
    }
  },

setCurActivityID(state: any, activityID: number) {
    if (!activityID) return;
    state.curActivityID = activityID;
  },
  /* 流程设置-参数设置-设置用户范围数组 */
  setScopeList(state: any, data: any) {
    if (data) {
      state.scopeList = data;
    }
  },
  /* 流程设置-历史版本-获取流程模板历史列表 */
  setHistoryList(state: any, data: any) {
    if (data) {
      state.historyList = data;
      state.historyList.forEach((a: any, i: string) => {
        a.order = i + 1;
      });
    }
  },
  /* 参与者弹窗-获取函数列表 */
  setFormulaTree(state: any, payload: Array<Apps.Workflow.FormularTreeItem>) {
    state.formulaTree = payload;
  },
  /**
   * @description 修改同意否决出口规则，
   * @param type number类型 1代表同意 2代表否决
   * todo 参数应该是一个
   */
  updateExitRules(state: any, type: number, rule: any) {
    if (!type || state.curActivityProps) return;
    if (type === 1) {
      state.curActivityProps.participant.approveExit = rule;
    } else {
      state.curActivityProps.participant.disapproveExit = rule;
    }
  },
  /* 属性赋值:属性区域值改变赋值到store */
  setPropValue(state: any, prop: WorkflowNamespace.PropValue) {
    if (prop) {
      const key = prop.key.split('.');
      const value = prop.value;
      let obj = state.curActivityProps[key[0]];
      if (key.length === 1) {
        state.curActivityProps[key[0]] = value;
        return;
      };
      key.forEach((a: string, i: number) => {
        if (i === key.length - 1) {
          obj[a] = value;
        } else if (i > 0) {
          obj = obj[a];
        }
      });
    }
  },

  // 设置树数据
  setSubWorkflowTplsTree(state: any, data: any) {
    if (!data || !Array.isArray(data)) return;
    state.subWorkflowTplsTree = data;
  },

  // 设置数据项列表
  setWorkflowDataItem(state: any, data: any) {
    if (!data) return;
    const { filtered, origin, all } = data;
    state.WorkflowDataItem = filtered;
    state.WorkflowDataItem_origin = origin;
    state.WorkflowDataItem_all = all;
  },

  // 设置子流程模板的schemaCode以获取子流程的数据项列表
  setChildWorkflow(state: any, schemaCode: string) {
    if (!schemaCode) return;
    state.childWorkflowSchemaCode = schemaCode;
  },

  // 设置任务表单
  setTaskList(state: any, arr: any) {
    if (arr) {
      state.taskList = arr;

      // 给一个节点赋值一个默认初始表单
      const _defaultSheetCode = arr[0].code;
      state.activities.forEach((activity: WorkflowNamespace.Activity, index: number) => {
        if (!activity.sheetCode) {
          state.activities[index].sheetCode = _defaultSheetCode;
        }
      })
    };
  },

  // 设置是否能保存属性值
  setIsSaveProp(state: any, isSave: boolean) {
    state.isSaveProp = isSave;
  },

  // 设置控制右键菜单的显示隐藏
  setIsShowContextmenu(state: any, isShowContextmenu: boolean) {
    state.isShowContextmenu = isShowContextmenu;
  },

  // 设置流程事件的data
  setWorkflowEventHandler(state: any, prop: WorkflowNamespace.PropValue) {
    if (!prop) return;
    state.workflowData[prop.key] = prop.value;
  },

  /** 
   * @desc 设置子流程模板操作记录
   * @params codes 形式为：appcode-folderCode-bizModelCode
  */
  setWorkflowChooseAction(state: any, actionCodes: string) {
    if (!actionCodes) return;
    state.curActivityProps.commonSettings.workflowChooseAction = actionCodes;
  },

  /**
   * @desc 设置流程设计菜单
   */
  setWorkflowMenus(state: any, menu: any) {
    state.workflowMenus = menu;
  },

  /**
   * 重置节点属性
   */
  resetCurActivityProps(state: any) {
    state.curActivityID = -1;
    state.curActivityProps = {
      ID: 0,
      type: '',
      acticityEvent: {},
      activitySenior: {},
      commonSettings: {},
      dataItem: {},
      operation: {},
      participant: {},
      workflowDataMaps: [],
      todoDataItem: {}
    }
  }

};

/* ///////////////////////////////////////////////////////////////// */
const actions = {
  addActivity({ commit }: any, acticitieModel: WorkflowNamespace.Activity) {
    // 根据类型添加不同节点
    commit('addActivity', acticitieModel);

    commit('setActivityCodeToWM');
  },
  /**
   * @description 当节点移动时，重新绘制相关连接线
   * @param activity 当前被拖动的节点
   * TODO: 这里还可以加一个判断，判断节点是否真的发生了位置、宽高的变化，然后才实际地触发连线的重绘
   */
  onActivityMoved({ state, commit }: any, activity: WorkflowNamespace.Activity) {
    const changedActivities = [activity];
    redrawOnActivityChange(changedActivities, state.lines);
    state.lines.forEach((line: Line) => {
      line.Unselect();
    });
  },
  /**
   * @description 当节点上点击了某个连接点时，自动连接点对应方向上的节点
   * @param param
   */
  onActivityConnect({ state, commit }: any, param: LINE.config) {
    const {
      startActivity, startPoint, startDirection, endActivity, endPoint
    } = param;
    const line = new Line({
      ID: state.workflow.getNewShapeID(),
      text: '',
      startPoint,
      startActivity,
      startDirection,
      endActivity,
      endPoint,
    });
    const flag: boolean | undefined = autoDrawLine(line, state.activities, state.lines);
    if (flag) {
      commit('addLine', line);
      return line;
    }
  },

  async getWorkflowDraft({ commit, state }: any, param: Apps.Workflow.WorkflowCode) {
    const res = await WorkflowApi.getWorkflowDraft(param);

    // 初始化活动节点以及连接线
    if (res.errcode === 0) {
      // 将流程时间转成json格式
      const workflowEventKeys:Array<string> = ['activateEventHandler', 'endEventHandler', 'cancelEventHandler', 'startEventHandler'];
      workflowEventKeys.forEach((key:string) => {
        if (res.data[key]) {
          const _content:any = res.data[key].content
          res.data[key].content = contentDataFormator(_content);
        }
      });


      // 保存流程数据
      commit('setWorkflowData', res.data);

      commit('resetCurActivityProps');

      // 创建节点
      const tem_activities: Array<WorkflowNamespace.Activity> = [];
      await res.data.activities.forEach((activity: any) => {
        if (!activity.name_i18n) {
          activity = compatibleOldData({ data: activity, type: 'activity' });
        } else {
          activity.name_i18n = JSON.parse(activity.name_i18n);
        }

        if (activity.activityType === 'START') {
          activity.name_i18n = {
            en: 'Start'
          }
        }

        if (activity.activityType === 'END') {
          activity.name_i18n = {
            en: 'End'
          }
        }

        // 将用户节点的消息通知中数据标题转为json
        if (activity.activityType === 'PARTICIPANT') {
          if (!activity.todoDataItem) {
            activity.todoDataItem = {
              dataItemType: 0,
              summary: [],
              title: []
            }
          }
          const keys: Array<string> = ['title']; 
          keys.forEach((key:string) => {
            if (activity.todoDataItem[key]) {
              const json = activity.todoDataItem[key];
              const array: Array<any> = [];
              json.forEach((item: any) => {
                array.push(item.code)
              })
              activity.todoDataItem[key] = array;
            } else {
              activity.todoDataItem[key] = [];
            }
          });
        }

        const _newActivity = state.workflow.addActivity(activity);

        // 校验用户活动节点是否有默认任务表单, 如果无，则添加默认任务表单
        // 20191028 by John
        if (_newActivity.activityType === 'PARTICIPANT' || _newActivity.activityType === 'CIRCULATE') {
          const _sheetCode = _newActivity.sheetCode ? _newActivity.sheetCode : (state.taskList.length > 0 ? state.taskList[0].code : '');
          _newActivity.sheetCode = _sheetCode;
        }
        
        // 流程事件 content转数组
        const needTransformActivityTypes:Array<string> = ['PARTICIPANT', 'SYSTEM_ACTIVITY', 'SUB_INSTANCE', 'CIRCULATE'];
        const acticityEventTypes:Array<string> = ['afterActivate', 'beforeActivate', 'cancelActivity', 'endActivity', 'jobRejected', 'jobSubmitted'];
        if (needTransformActivityTypes.indexOf(_newActivity.activityType) > -1) {
          acticityEventTypes.forEach((key:string) => {
            if (_newActivity[key]) {
              const _content:any = _newActivity[key].content;
              _newActivity[key].content = contentDataFormator(_content);
            }
          })
        } 

        tem_activities.push(_newActivity);
      });

      // 创建连接线
      const tem_lines: Array<Line> = [];
      await res.data.rules.forEach((rule: any) => {
        let _newLine = state.workflow.addLine(tem_activities, rule);
        if (!_newLine.name_i18n) {
          _newLine = compatibleOldData({ data: _newLine, type: 'line' });
        } else {
          _newLine.name_i18n = JSON.parse(_newLine.name_i18n);
        }
        if (_newLine) {
          _newLine.autoFix();
          tem_lines.push(_newLine);
        }
      });
      commit('setActivityToState', tem_activities);
      commit('setLines', tem_lines);
      redrawLines(state.lines);
    }

    commit('showPropertyPanel', 'WorkflowProperty');
  },
  // 获取某个版本且为发布状态的流程模板
  async getHistoryWorkflow({ commit, state }: any, param: Apps.WorkflowSetting.GetHistoryWorkflowParams) {
    const res = await WorkflowApi.getHistoryWorkflow(param);
    // 初始化活动节点以及连接线
    if (res.errcode === 0) {
      // 保存流程数据
      commit('setWorkflowData', res.data);

      // 创建节点
      const tem_activities: Array<WorkflowNamespace.Activity> = [];
      await res.data.activities.forEach((activity: any) => {
        const _newActivity = state.workflow.addActivity(activity);
        tem_activities.push(_newActivity);
      });

      // 创建连接线
      const tem_lines: Array<Line> = [];
      await res.data.rules.forEach((rule: any) => {
        const _newLine = state.workflow.addLine(tem_activities, rule);
        if (_newLine) {
          tem_lines.push(_newLine);
        }
      });

      commit('setActivityToState', tem_activities);
      commit('setLines', tem_lines);
      redrawLines(state.lines);
      commit('showPropertyPanel', 'WorkflowProperty');
    }
  },

  async updateWorkflowDraft({ commit }: any, params: any) {
    const res = await WorkflowApi.updateWorkflowDraft(params);
    return res;
  },

  async validateWorkflow({ commit }: any, params: any) {
    const res = await WorkflowApi.validateWorkflow(params);
    return res;
  },

  async releaseWorkflow({ commit }: any, params: any) {
    const res = await WorkflowApi.releaseWorkflow(params);
    return res;
  },

  /* 流程设置：创建流程权限 */
  async createPermission({ commit }: any, params: Apps.WorkflowSetting.CreatePermissionParams) {
    const res = await WorkflowApi.createPermission(params);
    return res;
  },
  /* 流程设置：获取流程权限列表 */
  async getPermissionList({ commit }: any, params: Apps.WorkflowSetting.GetPermissionListParams) {
    const res = await WorkflowApi.getPermissionList(params);
    commit('setScopeList', res.data);
  },
  /* 流程设置：删除流程权限 */
  async deletePermission({ commit }: any, params: Apps.WorkflowSetting.DeletePermissionParams) {
    const res = await WorkflowApi.deletePermission(params);
    return res;
  },
  /* 流程设置：获取流程模板历史列表 */
  async getHistoryList({ commit }: any, params: Apps.WorkflowSetting.GetPermissionListParams) {
    const res = await WorkflowApi.getHistoryList(params);
    commit('setHistoryList', res.data);
  },

  removeActivity({ state, commit }: any, params: number) {
    // 移除活动
    if (params) {
      state.activities.forEach((e: any, i: string) => {
        if (e.ID === params) {
          commit('unSelect', e);
          state.activities.splice(i, 1);

          commit('setActivityCodeToWM');
        }
      });
    }
  },

  /**
   * @description 数据转换
   * @param activityID 当前对象的ID
   */
  transformData({ state, commit }: any, payload: any) {
    if (!state.isSaveProp) return;
    let targetID: number = 0;
    let type: string = '';
    if (typeof payload === 'number') {
      targetID = payload
    } else if (payload instanceof Object) {
      targetID = payload.activityID;
      type = payload.type;
    }
    if (targetID) {
      // 先赋值
      commit('propsToData');
      // 更新id
      commit('setCurActivityID', targetID);
      // 将数据转成属性
      commit('dataToProps', type);

      // 更新workflowManager的编码数组
      commit('setActivityCodeToWM');
    }
  },

  async getFormulaTree({ commit }: any, params: Apps.Workflow.FormulaParams) {
    const res: Common.Data = await WorkflowApi.getFormulaList(params);
    if (res.errcode === 0 && Array.isArray(res.data)) {
      const _spec = params.type === 'participant' ? 'participant' : 'function';
      const _tree = res.data.map((item: Apps.Workflow.FormularItem, idx: number) => {
        const _node: Apps.Workflow.FormularTreeItem = {
          id: item.id,
          code: item.code,
          key: item.id || item.code || `${idx}`,
          title: item.displayName,
          isLeaf: false,
        };
        if (item.childrenFunctions) {
          _node.children = item.childrenFunctions.map((child: Apps.Workflow.FormularItem, j: number) => {
            const expression: string = item.code === _spec ? `${child.fullName}` : `{${child.code}}`;
            const _child: Apps.Workflow.FormularTreeItem = {
              id: child.id,
              code: child.code,
              key: child.id || child.code || `${_node.key}-${idx}-${j}`,
              title: item.code === _spec ? `${child.displayName}` : `${child.displayName}${expression}`,
              isLeaf: true,
              expression,
              parentCode: item.code
            };
            return _child;
          });
        }
        // NOTE: 前端过滤掉参与者函数中的Manager函数 2019-07-17
        if (_node.code === 'participant' && Array.isArray(_node.children)) {
          _node.children = _node.children.filter((child: Apps.Workflow.FormularTreeItem) => child.code !== 'Manager');
        }
        return _node;
      });
      commit('setFormulaTree', _tree);
    }
  },

  validateFormula({ commit }: any, param: Apps.Workflow.ValidateFormulaParams) {
    return WorkflowApi.validateFormula(param);
  },

  async getAppMenu({ commit }: any, params: Apps.AppItem.ItemTree) {
    const res = await AppItem.getAppItem(params);
    return res;
  },


  /**
  * @description 获取数据项列表
  * @param { schemaCode:schemaCode, hasReturn: false }
  * @param 如果需要拿到返回值 hasReturn 传true
  */
  async getWorkflowDataItem({ commit }: any, params: any) {
    const res = await AppItem.getDataItemList({ schemaCode: params.schemaCode });
    if (res.errcode === 0) {
      const _d: any = res.data.filter((item: any) => (!item.defaultProperty));
      const _o: any = res.data.filter((item: any) => {
        return (item.propertyType !== 6 &&
          item.propertyType !== 7 &&
          item.propertyType !== 8 &&
          item.propertyType !== 9 &&
          item.propertyType !== 10 && // 地址空间
          item.code !== 'name' &&  //摘要
          item.code !== 'id' &&   //id
          item.code !== 'ownerDeptQueryCode' &&
          item.code !== 'workflowInstanceId')
      });
      if (!params.hasReturn) {
        commit('setWorkflowDataItem', { filtered: _d, origin: _o, all: res.data });
      } else {
        return _d;
      }
    }
  },

  async getWorkflowDataItemNotFiltered({ commit }: any, params: any) {
    const res = await AppItem.getDataItemList({ schemaCode: params.schemaCode });
    if (res.errcode === 0) {
      return res.data;
    }
  },

  /**
  * @description 获取任务表单
  * @param { schemaCode:schemaCode, hasReturn: false }
  * @param 如果需要拿到返回值 hasReturn 传true
  */

  async getTaskList({ commit }: any, schemaCode: string) {
    list(schemaCode)
      .then((res: any) => {
        const listOther = res.data.filter((arr: any) => { return arr.published === true; });
        if (!listOther || listOther.length > 0) {
          commit('setTaskList', listOther)
        }
      })
      .catch((res: any) => {
        console.log(res);
      });

  },

  /**
  * @description 将异步加载的数据填入树中
  * @param key 类型为 1、1-1、1-1-1、1-1-1-1，根据key来决定赋值操作
  */
  setTreeDataAsync({ commit, state }: any, params: any) {
    const key = params.key;
    const tree = params.tree;
    if (!key) return;
    const indexs: Array<any> = key.split('-'); // ['1','2','3']
    const temTree = state.subWorkflowTplsTree.slice();
    indexs.forEach((index: any, i: number) => {
      indexs[i] = parseInt(index, 10) - 1;
    });
    switch (indexs.length) {
      case 1:
        temTree[indexs[0]].children = tree;
        break;
      case 2:
        temTree[indexs[0]].children[indexs[1]].children = tree;
        break;
      case 3:
        temTree[indexs[0]].children[indexs[1]].children[indexs[2]].children = tree;
        break;
      default: break;
    }
    commit('setSubWorkflowTplsTree', temTree);
  },

  // 获取列表
  async getWorkflowList({ commit }: any, params: Apps.Workflow.WorkflowSchemaCode) {
    const res = await WorkflowApi.getWorkflowList(params);
    if (res.errcode === 0 && res.data) {
      const menus: any = res.data.filter((w: any) => w.workflowName);
      menus.forEach((menu: any) => {
        if (!menu.name_i18n) {
          menu = compatibleOldData({ data: menu, type: 'workflow' });
        } else {
          menu.name_i18n = JSON.parse(menu.name_i18n);
        }
      });
      commit('setWorkflowMenus', menus)
    } else {
      commit('setWorkflowMenus', []);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
