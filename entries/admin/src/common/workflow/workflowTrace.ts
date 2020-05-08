import * as WorkflowElementType from '@/typings/workflowElementType';
import * as WorkflowNamespace from '@/typings/workflow';
import { LINE } from '@/typings/line';
import Trace from './Trace';
// import Line from './Line';

export default class TraceManager {
  // 痕迹栈
  TraceStack: Array<any> = [];
  // 上一个痕迹序号
  LastTraceIndex: number = -1;

  // 获取活动\线条痕迹相关属性
  static GetWorkflowElementProperties(_WorkflowElement: any) {
    if (_WorkflowElement.WorkflowElementType === WorkflowElementType.WorkflowElementType.Activity) {
      const _Activity = _WorkflowElement;
      return {
        ID: _Activity.ID,
        width: _Activity.width,
        height: _Activity.height,
        left: _Activity.left,
        top: _Activity.top,
        x: _Activity.x,
        y: _Activity.y
      };
    } else if (_WorkflowElement.WorkflowElementType == WorkflowElementType.WorkflowElementType.Line) {
      const _Line = _WorkflowElement;

      return {
        startActivity: _Line.startActivity,
        startPoint: _Line.startPoint,
        endActivity: _Line.endActivity,
        endPoint: _Line.endPoint,
        ID: _Line.ID,
        startActivityID: _Line.startActivity.ID,
        endActivityID: _Line.endActivity.ID,
        startDirection: _Line.startDirection,
        endDirection: _Line.endDirection,
        crossPoints: _Line.crossPoints,
        points: [..._Line.points],
        offsetToStartActivity: _Line.offsetToStartActivity,
        offsetToEndActivity: _Line.offsetToEndActivity
      };
    }
  }

  static GetMultiObjAndStates(_Targets: any) {
    const _activities = _Targets.filter((t: WorkflowNamespace.Activity) => t.WorkflowElementType === WorkflowElementType.WorkflowElementType.Activity);
    const _Objects: any = [];
    const _States: any = [];

    _activities.forEach((activity: WorkflowNamespace.Activity) => {
      _States.push(this.GetWorkflowElementProperties(activity));
      _Objects.push(activity);
    });
    // lines 也要传进来 todo
    // lines.forEach((line:any) => {
    //   if(line.startActivity in _activities || line.endActivity in _activities) {
    //     States.push(this.GetWorkflowElementProperties(line));
    //     Objects.push(line);
    //   }
    // })

    return {
      Objects: _Objects,
      States: _States
    };
  }

  // 复制线的点集
  static CopyLinePoints(_Points: Array<LINE.point>) {
    const _NewPoints: Array<LINE.point> = [];
    _Points.forEach((point: LINE.point) => {
      _NewPoints.push({
        x: point.x,
        y: point.y
      });
    });
    return _NewPoints;
  }
   
  /**
   * @desc 添加新痕迹
   * @params _TraceType :痕迹类型
   * @params _Target    :目标对象
   * @params _Source    :初始状态,必选,若无则传null 
   * @params vm         :Vue实例，用于跟store交互
   */
  AddTrace(_TraceType: number, _Target: any, _Source: any, vm:any) {
    // 删除当前序号后的痕迹
    if (this.LastTraceIndex >= -1 && this.LastTraceIndex < this.TraceStack.length - 1) {
      this.TraceStack.splice(this.LastTraceIndex + 1, this.TraceStack.length - (this.LastTraceIndex + 1));
    }
    // 新痕迹
    const _Trace = new Trace(_TraceType, _Target, _Source, vm);
    this.TraceStack.push(_Trace);
    this.LastTraceIndex++; // 说明有了操作
  }

  /**
   * 撤销操作
   */
  Undo() {
    if (this.LastTraceIndex > -1) {
      const _LastTrace = this.TraceStack[this.LastTraceIndex];
      if (_LastTrace && _LastTrace.Undo) {
        this.LastTraceIndex--;
        _LastTrace.Undo();
      }
    }
  }
  
  /**
   * 返回操作
  */ 
  Redo() {
    if (this.LastTraceIndex < this.TraceStack.length - 1) {
      const _NextTrace = this.TraceStack[this.LastTraceIndex + 1];
      if (_NextTrace && _NextTrace.Redo) {
        this.LastTraceIndex++;
        _NextTrace.Redo();
      }
    }
  }

  /**
   * 清空痕迹栈
   */
  Clear(){
    this.TraceStack = [];
    this.LastTraceIndex = -1;
  }
}
