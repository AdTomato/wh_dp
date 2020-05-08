import * as WorkflowNamespace from '../typings/workflow';
import { LINE } from '../typings/line';
import WorkflowBase from './WorkflowBase';
import Line from './Line';

export default class WorkflowManager extends WorkflowBase {
  constructor(workflowCode: string) {
    super();
    if (workflowCode) {
      this.workflowCode = workflowCode;
    }
  }

  NewShapeID: number = 0;
  ActivityID: number = 0;
  workflowCode: string = '';
  activityCodeArr: Array<string> = [];
  StorePath: string = 'Apps/Workflow'; // vuex workflow模块层级

  // methods
  ActivityClone(obj: WorkflowNamespace.Activity): WorkflowNamespace.Activity {
    return JSON.parse(JSON.stringify(obj));
  }

  // 生成NewShapeID
  getNewShapeID(): number {
    if (!this.NewShapeID) {
      this.NewShapeID = 1;
    } else {
      this.NewShapeID += 1;
    }
    return this.NewShapeID;
  }

  getActivityCode(): string {
    const activityCodePrefix: string = 'Activity';
    this.ActivityID += 1;
    const _acticityCode: string = activityCodePrefix + this.ActivityID;
    if (this.activityCodeArr.indexOf(_acticityCode) !== -1) {
      return this.getActivityCode();
    } else {
      return _acticityCode;
    }
  }

  // 添加活动 只生成一个节点返回出去
  addActivity(activityModel: WorkflowNamespace.ActivityParams) {
    let _activity: any = {};
    const activityType: string = activityModel.activityType;
    switch (activityType) {
      case 'START':
        _activity = this.StartActivity;
        // _activity = this.ActivityClone(this.StartActivity);
        break;
      case 'END':
        _activity = this.EndActivity;
        // _activity = this.ActivityClone(this.EndActivity);
        break;
      case 'PARTICIPANT':
        _activity = this.UserActivity;
        // _activity = this.ActivityClone(this.UserActivity);
        break;
      case 'SYSTEM_ACTIVITY':
        _activity = this.SysActivity;
        // _activity = this.ActivityClone(this.SysActivity);
        break;
      case 'SUB_INSTANCE':
        _activity = this.SubWorkflow;
        // _activity = this.ActivityClone(this.SubWorkflow);
        break;
      case 'CONNECTION':
        _activity = this.Connection;
        // _activity = this.ActivityClone(this.Connection);
        break;
      case 'CIRCULATE':
        _activity = this.Circulate;
        // _activity = this.ActivityClone(this.Circulate);
        break;
      default:
        break;
    }
    // 更改尺寸以及位置坐标
    const ID = this.getNewShapeID();
    const _acticityCode: string = this.getActivityCode();
    Object.assign(_activity, {
      ID,
      WorkflowElementType: 'Activity',
      left: activityModel.x,
      top: activityModel.y,
      x: activityModel.x,
      y: activityModel.y,
      width: activityModel.width,
      height: activityModel.height,
      right: activityModel.x + activityModel.width,
      bottom: activityModel.y + activityModel.height,
      center: activityModel.x + (activityModel.width / 2),
      middle: activityModel.y + (activityModel.height / 2),
      activityCode: activityModel.activityCode || _acticityCode,
      isSelected: false,
      ...activityModel,
      participationModel: activityModel.participationModel || 'PARALLEL'
    });
    this.activityCodeArr.push(_activity.activityCode);
    return _activity;
  }

  transformPoints(points: Array<string>) {
    const _pointArr: Array<LINE.point> = [];
    points.forEach((point: any) => {
      _pointArr.push({ x: parseInt(point.split(',')[0]), y: parseInt(point.split(',')[1]) });
    });
    return _pointArr;
  }

  // 添加线条，若存在则更新
  addLine(activities: any, rule: any) {
    // const _activities = JSON.parse(JSON.stringify(activities));
    const _activities = activities;
    let _startActivity = _activities.find((activity: WorkflowNamespace.Activity) =>
      activity.activityCode === rule.preActivityCode);
    let _endActivity = _activities.find((activity: WorkflowNamespace.Activity) =>
      activity.activityCode === rule.postActivityCode);
    if (!_startActivity || !_endActivity) {
      return;
    }

    _startActivity = JSON.parse(JSON.stringify(_startActivity)) as any;
    _endActivity = JSON.parse(JSON.stringify(_endActivity)) as any;

    const _points = this.transformPoints(rule.points);
    const _newLine = new Line({
      ID: this.getNewShapeID(),
      points: _points,
      startActivity: _startActivity,
      endActivity: _endActivity,
      startPoint: _points[0],
      endPoint: _points[_points.length - 1],
      code: rule.code,
      text: rule.text,
      popupType: rule.popupType,
      utilizeElse: rule.utilizeElse,
      formula: rule.formula,
    });
    return _newLine;
  }
}
