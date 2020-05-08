import * as WorkflowNamespace from '../typings/workflow';

export default class WorkflowBase {
  get StartActivity(): WorkflowNamespace.Activity {
    return {
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      center: 0,
      middle: 0,
      activityCode: '',
      isSelected: false,
      toolTipText: '',
      activityName: '开始',
      activityType: 'START',
      icon: '&#xe897;',
      allowedTime: null,
      timeoutWarn1: null,
      timeoutWarn2: null,
      timeoutStrategy: 'NOTIFY_HANDLER',
    }
  }

  get EndActivity(): WorkflowNamespace.Activity {
    return {
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      center: 0,
      middle: 0,
      activityCode: '',
      isSelected: false,
      toolTipText: '',
      activityName: '结束',
      activityType: 'END',
      icon: '&#xe9a7;',
      allowedTime: null,
      timeoutWarn1: null,
      timeoutWarn2: null,
      timeoutStrategy: 'NOTIFY_HANDLER',
    }
  }

  get UserActivity(): WorkflowNamespace.Activity {
    return {
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      center: 0,
      middle: 0,
      activityCode: '',
      isSelected: false,
      toolTipText: '',
      activityName: '用户活动',
      activityType: 'PARTICIPANT',
      icon: '&#xe935;',
      participant: null,
      submitButtonName: null,
      rejectButtonName: null,
      finishExit: null,
      sheetCode: '',
      assistant: '',
      circulate: '',
      permittedAction: {
        adjustParticipant: false,
        assist: false,
        circulate: false,
        finishInstance: false,
        forward: true,
        reject: false,
        rejectToActivityCode: '',
        rejectToFixded: false,
        rejectToStart: false,
        retrieve: true,
      },
      participantType: 'SINGLE_PARTICIPANT',
      participationModel: 'PARALLEL',
      approveExit: '100%',
      disapproveExit: '1',
      noParticipant: 'TO_ADMIN',
      beforeActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      afterActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      endActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      cancelActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      jobSubmitted: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      jobRejected: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      asyncEndJob: null,
      originator: 'DEFAULT',
      perviousParticipate: '',
      participated: '',
      followUpParticipate: '',
      noParticipantNextActivity: 'DEFAULT',
      allowedTime: '',
      timeoutWarn1: '',
      timeoutWarn2: '',
      timeoutStrategy: 'NOTIFY_HANDLER',
      propertyPermissions: []

    }
  }

  get SysActivity(): WorkflowNamespace.Activity {
    return {
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      center: 0,
      middle: 0,
      activityCode: '',
      isSelected: false,
      toolTipText: '',
      activityName: '系统活动',
      activityType: 'SYSTEM_ACTIVITY',
      icon: '&#xe947;',
      bizActions: [
        'fff',
        'gg'
      ],
      finishCondition: null,
      beforeActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      afterActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      endActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      cancelActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      jobSubmitted: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      jobRejected: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
    }
  }

  get SubWorkflow(): WorkflowNamespace.Activity {
    return {
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      center: 0,
      middle: 0,
      activityCode: '',
      isSelected: false,
      toolTipText: '',
      activityName: '子流程',
      activityType: 'SUB_INSTANCE',
      icon: '&#xe9d5;',
      participant: '',
      participantType: 'SINGLE_PARTICIPANT',
      workflowCode: '',
      sync: true,
      finishStartActivity: false,
      workflowDataMaps: [],
      beforeActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      afterActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      endActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      cancelActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      jobSubmitted: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      jobRejected: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
    }
  }

  get Connection(): WorkflowNamespace.Activity {
    return {
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      center: 0,
      middle: 0,
      activityCode: '',
      isSelected: false,
      toolTipText: '',
      activityName: '连接点',
      activityType: 'CONNECTION',
      icon: '&#xe914;',
      allowedTime: null,
      timeoutWarn1: null,
      timeoutWarn2: null,
      timeoutStrategy: 'NOTIFY_HANDLER',
      beforeActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      afterActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      endActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      cancelActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      asyncEndJob: null,
      jobSubmitted: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      jobRejected: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
    }
  }

  get Circulate(): WorkflowNamespace.Activity {
    return {
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      center: 0,
      middle: 0,
      activityCode: '',
      isSelected: false,
      toolTipText: '',
      activityName: '传阅',
      activityType: 'CIRCULATE',
      icon: '&#xe910;',
      allowedTime: '',
      timeoutWarn1: '',
      timeoutWarn2: '',
      timeoutStrategy: 'NOTIFY_HANDLER',
      beforeActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      afterActivate: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      endActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      cancelActivity: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      asyncEndJob: null,
      jobSubmitted: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      jobRejected: {
        receiver: null,
        content: null,
        cancelParllelActivity: false,
        dataDisposals: [],
        bizActions: []
      },
      participantType: 'MULTI_PARTICIPANT'
    }
  }
}
