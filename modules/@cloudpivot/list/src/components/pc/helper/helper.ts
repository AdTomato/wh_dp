

import * as WorkflowCenter from '@cloudpivot/list/src/typings/workflow-center';

import common from '@cloudpivot/common';

const DateHandle = common.utils.DateHandle;

export const timeTranslate = (time:number) => {
  const _t:any = DateHandle.msecToTimeSpan(time);

  let str:string = '';

  if (time === 0) return '1分钟';

  const _day:string = `${_t.day === 0 ? '' : `${_t.day}天`}`;

  let _hour:string = `${_t.hour}时`;
  if (_t.day === 0 && _t.hour === 0) {
    _hour = '';
  }

  const _minute = `${_t.minute === 0 ? 1 : _t.minute}分钟`;

  str = `${_day}${_hour}${_minute}`;

  return str;
};

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

  vm.$nextTick(() => {
    if (vm.isShowPagination) {
      scrollY = dom.clientHeight - (_h + 50);
    } else {
      scrollY = dom.clientHeight - _h;
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

 /*
  * 数值数据项展示格式处理
  */
 export function numberToDisplay(value:any, column:any) {
  let result:any = value;
  switch (column.displayFormat) {
    case 0:
      break;
    case 1:
      result = parseInt(result, 10).toLocaleString();
      break;
    case 2:
      result = addZero(Number(result.toFixed(2).slice(0,-1)).toLocaleString(), 1);
      break;
    case 3:
      result = addZero(Number(result.toFixed(3).slice(0,-1)).toLocaleString(), 2);
      break;
    case 4:
      result = `${parseInt(`${result}`, 10)}%`;
      break;
    case 5:
      result = `${(result).toFixed(2).slice(0,-1)}%`;
      break;
    case 6:
      result = `${(result).toFixed(3).slice(0,-1)}%`;
      break;
    case 7:
      result = `￥${addZero(Number(result.toFixed(3).slice(0,-1)).toLocaleString(), 2)}`;
      break;
    case 8:
      result = `$${addZero(Number(result.toFixed(3).slice(0,-1)).toLocaleString(), 2)}`;
      break;
    case 9:
      result = `€${addZero(Number(result.toFixed(3).slice(0,-1)).toLocaleString(), 2)}`;
      break;
    case 10:
      result = `HK$${addZero(Number(result.toFixed(3).slice(0,-1)).toLocaleString(), 2)}`;
      break;
    case 11:
      result = addZero(numberFormatter(result.toFixed(4).slice(0,-1)), 3);
      break;
    case 12:
      result = addZero(numberFormatter(result.toFixed(5).slice(0,-1)), 4);
      break;
    case 13:
      result = `${(result).toFixed(4).slice(0,-1)}%`;
      break;
    case 14:
      result = `${(result).toFixed(5).slice(0,-1)}%`;
      break;
    case 15:
      result = `￥${addZero(numberFormatter(result.toFixed(4).slice(0,-1)), 3)}`;
      break;
    case 16:
      result = `￥${addZero(numberFormatter(result.toFixed(5).slice(0,-1)), 4)}`;
      break;
    case 17:
      result = `$${addZero(numberFormatter(result.toFixed(4).slice(0,-1)), 3)}`;
      break;
    case 18:
      result = `$${addZero(numberFormatter(result.toFixed(5).slice(0,-1)), 4)}`;
      break;
    case 19:
      result = `€${addZero(numberFormatter(result.toFixed(4).slice(0,-1)), 3)}`;
      break;
    case 20:
      result = `€${addZero(numberFormatter(result.toFixed(5).slice(0,-1)), 4)}`;
      break;
    case 21:
      result = `HK$${addZero(numberFormatter(result.toFixed(4).slice(0,-1)), 3)}`;
      break;
    case 22:
      result = `HK$${addZero(numberFormatter(result.toFixed(5).slice(0,-1)), 4)}`;
      break;
    default:
      break;
  }
  return result;
}

/* 
* 数值格式化（转为1,234,567.89格式）
*/
export function numberFormatter(str: string) {
  const sList = str.split('.');
  if (sList.length === 1) {
    str = sList[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    str = `${sList[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${sList[1]}`
  }
  return str;
}

/*
* 小数点后补0函数
*/
export function addZero(str:string, num:number) {
  if (str.indexOf('.') === -1) {
    let zero:string = '';
    for (var i = 0; i < num; i++) {
      zero += '0';
    }
    return `${str}.${zero}`;
  } else {
    const numLength = str.split('.')[1].length;
    if (numLength < num) {
      let zero:string = '';
      for (var i = 0; i < num - numLength; i++) {
        zero += '0';
      }
      return `${str}${zero}`;
    }
    return str;
  }
}

