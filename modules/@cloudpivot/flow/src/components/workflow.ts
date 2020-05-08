import {
  Component, Vue
} from 'vue-property-decorator';
import { workflowActionStatus, workItemStatus } from '../typings/workflow-enum';
import { workflow }  from '@cloudpivot/api';

@Component
export default class WorkflowActionStatusMixin extends Vue {
  /**
   * 获取流程行为状态
   * @param approvalActionStatus
   */
  getWorkflowActionStatus(approvalActionStatus: number) {
    if (!approvalActionStatus && approvalActionStatus !== 0) {
      approvalActionStatus = 99;
    }
    if (workflowActionStatus[approvalActionStatus.toString()]) {
      return this.$t(`cloudpivot.flow.mobile.WorkflowActionStatus.${workflowActionStatus[approvalActionStatus.toString()]}`);
    }
    return '';
  }

  /**
   * 获取流程行为状态颜色样式
   * @param approvalActionStatus
   */
  getWorkflowActionStatusColorClass(approvalActionStatus: number) {
    let colorClass = 'gray';
    switch (approvalActionStatus) {
      case 1:
      case 2:
        colorClass = 'gray';
        break;
      case 3:
        colorClass = 'green';
        break;
      case 5:
      case 6:
      case 7:
        colorClass = 'blue';
        break;
      case 4:
      case 8:
      case 9:
        colorClass = 'red';
        break;
      case 10:
        break;
      case 11:
        break;
      default:
        colorClass = 'gray';
        break;
    }
    return colorClass;
  }

  /**
   * 获取流程任务状态
   * @param subWorkItemStatus
   */
  getWorkItemStatus(subWorkItemStatus: number) {
    if (workItemStatus[subWorkItemStatus.toString()]) {
      return `${this.$t(`cloudpivot.flow.mobile.WorkItemStatus.${workItemStatus[subWorkItemStatus.toString()]}`)}`;
    }
    return '';
  }

  /**
   * 日志时间格式化
   * @param text
   * @param record
   * @param index
   */
  workItemLogTimeFormat(text: any, record: workflow.WorkflowTrackLog) :string {
    if (!text || text === '') {
      if (record.subInstanceActivity) {
        return this.getWorkItemStatus(record.workItemStatus);
      }
      return '处理中';
    }
    return text;
  }
}
