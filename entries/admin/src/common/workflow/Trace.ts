import * as TraceType from '@/typings/traceType';
import AtomicTrace from './AtomicTrace';
import Line from '@/common/workflow/Line';
import TraceManager from './workflowTrace';
// 痕迹中只记录HTML相关属性,不记录活动\线条\流程的功能属性
// 每一条痕迹可能包含多个原子操作
// _ActionType:
// _Target   :目标对象
// _Source: 记录_Target原来的状态,可选
export default class Trace {
  constructor(_TraceType: number, _Target: any, _Source: any, vm: any) {
    const _lines = vm.lines;
    const _activities = vm.activities;
    switch (_TraceType) {
      case TraceType.Activity.Remove:
        {
          this.Activity = _Target;
          const _ActivityID = this.Activity.ID;
          this.RelateLines = vm.lines.filter((line: Line) => ((line.startActivity) && (line.startActivity.ID == _ActivityID)) || (line.endActivity && (line.endActivity.ID == _ActivityID)));
          this.AtomicTraces = [];
          this.AtomicTraces.push(new AtomicTrace(TraceType.Activity.Remove, this.Activity, _Source, vm));
          // 先新连接线数组， 再记录完线条痕迹
          _lines.forEach((m: any, j: string) => {
            if (m.startActivity.activityCode === this.Activity.activityCode || m.endActivity.activityCode === this.Activity.activityCode) {
              vm.$store.commit(`${this.StorePath}/removeLine`, m);
            }
          });
          for (let i = 0; i < this.RelateLines.length; i++) {
            this.AtomicTraces.push(new AtomicTrace(TraceType.Line.Remove, this.RelateLines[i], TraceManager.GetWorkflowElementProperties(this.RelateLines[i]), vm));
            // 删除线痕迹
          }
          this.Redo = () => {
            this.AtomicTraces.forEach((atomicTrace: any) => {
              atomicTrace.Redo();
            });
          };

          this.Undo = () => {
            this.AtomicTraces.forEach((atomicTrace: any) => {
              atomicTrace.Undo();
            });
          };
        }
        break;
      case TraceType.Activity.Add:
        {
          const AtomicTraceInstance = new AtomicTrace(_TraceType, _Target, _Source, vm);
          this.Redo = () => {
            AtomicTraceInstance.Redo();
          };
          this.Undo = () => {
            AtomicTraceInstance.Undo();
          };
        }
        break;
      case TraceType.Activity.Move:
        {
          this.AtomicTraces = [];
          this.Targets = _Target;
          this.SourceStates = _Source;
          for (let a = 0; a < this.Targets.length; a += 1) {
            this.AtomicTraces.push(new AtomicTrace(_TraceType, this.Targets[a], this.SourceStates[a], vm));
          }
          this.Redo = () => {
            this.AtomicTraces.forEach((atmictrace: any) => {
              atmictrace.Redo();
            });
          };
          this.Undo = () => {
            this.AtomicTraces.forEach((atmictrace: any) => {
              atmictrace.Undo();
            });
          };
        }
        break;
      case TraceType.Multi.VerticalDistance:
        {
          this.AtomicTraces = [];
          this.Targets = _Target;
          this.SourceStates = _Source;
          for (let a = 0; a < this.Targets.length; a += 1) {
            this.AtomicTraces.push(new AtomicTrace(_TraceType, this.Targets[a], this.SourceStates[a], vm));
          }
          this.Redo = () => {
            this.AtomicTraces.forEach((atmictrace: any) => {
              atmictrace.Redo();
            });
          };
          this.Undo = () => {
            this.AtomicTraces.forEach((atmictrace: any) => {
              atmictrace.Undo();
            });
          };
        }
        break;

        case TraceType.Multi.HorizontalDistance:
        {
          this.AtomicTraces = [];
          this.Targets = _Target;
          this.SourceStates = _Source;
          for (let a = 0; a < this.Targets.length; a += 1) {
            this.AtomicTraces.push(new AtomicTrace(_TraceType, this.Targets[a], this.SourceStates[a], vm));
          }
          this.Redo = () => {
            this.AtomicTraces.forEach((atmictrace: any) => {
              atmictrace.Redo();
            });
          };
          this.Undo = () => {
            this.AtomicTraces.forEach((atmictrace: any) => {
              atmictrace.Undo();
            });
          };
        }
        break;

      case TraceType.Activity.Resize:
        {
          this.Targets = _Target;
          this.SourceStates = _Source;
          const AtomicTraceInstance = new AtomicTrace(_TraceType, this.Targets, this.SourceStates, vm);

          this.Redo = () => {
            AtomicTraceInstance.Redo();
          };
          this.Undo = () => {
            AtomicTraceInstance.Undo();
          };
        }
        break;
      case TraceType.Multi.SameWidth:
      case TraceType.Multi.SameHeight:
      case TraceType.Multi.SameSize:
        {
          this.Targets = _Target;
          this.SourceStates = _Source;
          this.AtomicTraces = [];
          for (let i = 0; i < this.Targets.length; i += 1) {
            this.AtomicTraces.push(new AtomicTrace(TraceType.Activity.Resize, this.Targets[i], this.SourceStates[i], vm));
          }

          this.Redo = () => {
            this.AtomicTraces.forEach((atomicTrace:any) => {
              atomicTrace.Redo();
            });
          };

          this.Undo = () => {
            this.AtomicTraces.forEach((atomicTrace:any) => {
              atomicTrace.Undo();
            });
          };
        }
        break;
      case TraceType.Line.Remove:
        {
          this.Line = _Target;
          const AtomicTraceInstance = new AtomicTrace(_TraceType, _Target, _Source, vm);
          this.Redo = () => {
            AtomicTraceInstance.Redo();
          };
          this.Undo = () => {
            AtomicTraceInstance.Undo();
          };
        }
        break;
      case TraceType.Line.Add:
        {
          this.Line = _Target;
          const AtomicTraceInstance = new AtomicTrace(_TraceType, _Target, _Source, vm);
          this.Redo = () => {
            AtomicTraceInstance.Redo();
          };
          this.Undo = () => {
            AtomicTraceInstance.Undo();
          };
        }
        break;

      case TraceType.Line.PointChange:
        {
          const AtomicTraceInstance = new AtomicTrace(_TraceType, _Target, _Source, vm);
          this.Redo = () => {
            AtomicTraceInstance.Redo();
          };
          this.Undo = () => {
            AtomicTraceInstance.Undo();
          };
        }
        break;
      default:
        break;
    }
  }

  Activity: any = {};
  RelateLines: Array<any> = [];
  Line: any = '';
  Redo = () => { };
  Undo = () => { };

  SourceStates: any = []; // 批量操作的初始状态
  TargetStates: any = [];// 批量操作的目标状态
  Targets: any = []; // 批量操作 目标（活动|线条）
  TargetAndStatesa: any = [] // 状态和目标集合
  AtomicTraces: Array<any> = [];
  StorePath: string = 'Apps/Workflow'; // vuex workflow模块层级
}
