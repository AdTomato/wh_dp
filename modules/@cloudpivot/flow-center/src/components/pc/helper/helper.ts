

import DateHandle  from '@cloudpivot/common/src/utils/date';

import * as WorkflowCenter from '../typings/workflow-center';

export const timeTranslate = DateHandle.timeTranslate;

/*
  * 动态计算表格最大高度以设置表头固定
  * @params config: vm 当前组件实例
  * @params config: type 当前是哪个组件
*/
export const setTableMaxHeight = (config:WorkflowCenter.TableHeaderFix) => {
  const vm = config.vm;
  const dom = vm.$refs.workItem as HTMLElement;
  let scrollY:number = 0;
  let _h:number = 0; // 需要减去的高度 默认值为头部title的高度
  const type = config.type;
  if (!type) return 0;
  switch (type) {
    case 'onlyTable': // 只有表格
      _h += 114;
      break;
    case 'hasBtns': // 表格上方操作按钮
      _h += 164;
      break;
    case 'hasFilters': // 带有过滤条件
      _h += 162;
      break;
    case 'hasTabsAndFilters':
      _h += 208;
      break;
    default: break;
  }

  // 是否展示搜索结果
  let diff:number = 0;
  if(vm.searchNumber >= 0) {
    diff += 37;
  } else {
    diff = 0;
  }
  vm.$nextTick(() => {
    if (vm.isShowPagination) {
      scrollY = dom.clientHeight - (_h + 50 ) - diff;
    } else {
      scrollY = dom.clientHeight - _h - diff;
    }
    vm.scrollY = scrollY;
  });
};

/**
 * 处理结果转换
*/

export const ApprovalTranslator = (state:number) => {
  if (!state) return;
  switch (state) {
    case WorkflowCenter.ApprovalState.AGREE:
      return '同意';
    case WorkflowCenter.ApprovalState.REJECT:
      return '驳回';
    case WorkflowCenter.ApprovalState.FORWARD:
      return '转办';
    case WorkflowCenter.ApprovalState.CANCELLED:
      return '被取消';
    case WorkflowCenter.ApprovalState.UNDO:
      return '未处理';
  }
};


/**
 * 流程状态转换
*/
export const workflowStateTranslator = (state:string) => {
  if (!state) return;
  switch (state) {
    case WorkflowCenter.WorkflowInstanceState.DRAFT:
      return '草稿';
    case WorkflowCenter.WorkflowInstanceState.PROCESSING:
      return '进行中';
    case WorkflowCenter.WorkflowInstanceState.COMPLETED:
      return '已完成';
    case WorkflowCenter.WorkflowInstanceState.CANCELED:
      return '已作废';
  }
};

/**
 * 去除后台传值的秒
*/
export const removeSeconds = (time:string) => {
  if (!time) return '';
  if (typeof time === 'string') {
    return time.substring(0, time.lastIndexOf(':'));
  } else if (typeof time === 'number') {
    const timeStr:string = new Date(time).toISOString().replace('T',' ');
    return timeStr.substring(0, timeStr.lastIndexOf(':'));
  } else {
    return ''
  }
};

/**
 * 部门最多显示三级 部门1/部门2/部门3/部门4 =>部门1/部门2/.../部门4
 * 一级 部门1
*/

export const departmentNameTranslator = (departmentName:string) => {
  if (!departmentName) return;

  if (departmentName.indexOf('/') === -1) return departmentName;

  const departmentArr:Array<string> = departmentName.split('/');
  if (departmentArr.length > 3) {
    return `${departmentArr[0]}/.../${departmentArr[departmentArr.length - 2]}/${departmentArr[departmentArr.length - 1]}`;
  }

  return departmentName;
};
