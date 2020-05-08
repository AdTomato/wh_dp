module.exports = [
  // {
  //   api: '/api/runtime/workflow/get_instance_baseinfo',
  //   response: (req, res) => {
  //     const data = {
  //       'data': {
  //         'participants': [
  //           {
  //             'activityCode': 'test',
  //             'activityName': '测试1',
  //             'participants': [
  //               {
  //                 id: '1', //用户id
  //                 name: '张三', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四', // 来源名称 "填写申请单"
  //                 workItemType: 'ASSIST', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '2', //用户id
  //                 name: '张三1', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四1', // 来源名称 "填写申请单"
  //                 workItemType: 'FORWARD', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '3', //用户id
  //                 name: '张三2', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四2', // 来源名称 "填写申请单"
  //                 workItemType: 'ADD_WORKITEM', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '3', //用户id
  //                 name: '张三3', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四3', // 来源名称 "填写申请单"
  //                 workItemType: 'CIRCULATE_ITEM', // 来源类型 "NORMAL"
  //               },
  //             ]
  //           },
  //           {
  //             'activityCode': 'test',
  //             'activityName': '测试2',
  //             'participants': [
  //               {
  //                 id: '1', //用户id
  //                 name: '张三', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四', // 来源名称 "填写申请单"
  //                 workItemType: 'ASSIST', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '2', //用户id
  //                 name: '张三1', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四1', // 来源名称 "填写申请单"
  //                 workItemType: 'FORWARD', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '3', //用户id
  //                 name: '张三2', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四2', // 来源名称 "填写申请单"
  //                 workItemType: 'ADD_WORKITEM', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '3', //用户id
  //                 name: '张三3', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四3', // 来源名称 "填写申请单"
  //                 workItemType: 'CIRCULATE_ITEM', // 来源类型 "NORMAL"
  //               },
  //             ]
  //           },
  //           {
  //             'activityCode': 'test',
  //             'activityName': '测试3',
  //             'participants': [
  //               {
  //                 id: '1', //用户id
  //                 name: '张三', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四', // 来源名称 "填写申请单"
  //                 workItemType: 'ASSIST', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '2', //用户id
  //                 name: '张三1', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四1', // 来源名称 "填写申请单"
  //                 workItemType: 'FORWARD', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '3', //用户id
  //                 name: '张三2', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四2', // 来源名称 "填写申请单"
  //                 workItemType: 'ADD_WORKITEM', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '3', //用户id
  //                 name: '张三3', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四3', // 来源名称 "填写申请单"
  //                 workItemType: 'CIRCULATE_ITEM', // 来源类型 "NORMAL"
  //               },
  //             ]
  //           },
  //           {
  //             'activityCode': 'test',
  //             'activityName': '测试4',
  //             'participants': [
  //               {
  //                 id: '1', //用户id
  //                 name: '张三', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四', // 来源名称 "填写申请单"
  //                 workItemType: 'ASSIST', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '2', //用户id
  //                 name: '张三1', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四1', // 来源名称 "填写申请单"
  //                 workItemType: 'FORWARD', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '3', //用户id
  //                 name: '张三2', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四2', // 来源名称 "填写申请单"
  //                 workItemType: 'ADD_WORKITEM', // 来源类型 "NORMAL"
  //               },
  //               {
  //                 id: '3', //用户id
  //                 name: '张三3', //用户名称 "李思维"
  //                 sourceId: '2', //来源id "Activity2"
  //                 sourceName: '李四3', // 来源名称 "填写申请单"
  //                 workItemType: 'CIRCULATE_ITEM', // 来源类型 "NORMAL"
  //               },
  //             ]
  //           }
  //         ],
  //         'finishTime': '2018/12/12',
  //         'headerAction': {
  //           'showAdjust': true,
  //           'showCancel': true,
  //           'showEditable': true,
  //           'showRemove': true,
  //           'showUserLog': true
  //         },
  //         'startTime': '2018/12/12',
  //         'status': 'DRAFT',
  //         'workflowName': ' 流程模板名称'
  //       },
  //       'errcode': 0,
  //       'errmsg': ''
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/list_instance_logs',
  //   response: (req, res) => {
  //     const data = {
  //       'data': [
  //         {
  //           'activityCode': 'Activity1',
  //           'activityName': '测试',
  //           'approval': 'DRAFT',
  //           'finishTime': '2019-11-08 12:56:54',
  //           'originator': {
  //             'assistParticipants': [{
  //               'id': '1',
  //               'imgUrl': '1',
  //               'name': '斑斑',
  //               'unitType': '1',
  //               'username': '斑斑'
  //             }],
  //             'adjustWorkItemParticipants': [{
  //               'id': '2',
  //               'imgUrl': '2',
  //               'name': '芊芊',
  //               'unitType': '2',
  //               'username': '芊芊'
  //             }],
  //             'forwardParticipant': {
  //               'id': '3',
  //               'imgUrl': '3',
  //               'name': '转转',
  //               'unitType': '3',
  //               'username': '转转'
  //             },
  //             'participant': {
  //               'id': '4',
  //               'imgUrl': '4',
  //               'name': '忍者',
  //               'unitType': '1',
  //               'username': '忍者'
  //             },
  //             'participantDept': 'string'
  //           },
  //           'receiveTime': '2019-01-08 12:56:54',
  //           'userTime': 'string'
  //         },
  //         {
  //           'activityCode': 'Activity2',
  //           'activityName': '测试',
  //           'approval': 'DRAFT',
  //           'finishTime': '2019-21-08 13:56:54',
  //           'originator': {
  //             'assistParticipants': [{
  //               'id': '1',
  //               'imgUrl': '1',
  //               'name': '斑斑',
  //               'unitType': '1',
  //               'username': '斑斑'
  //             }],
  //             'adjustWorkItemParticipants': [{
  //               'id': '2',
  //               'imgUrl': '2',
  //               'name': '芊芊',
  //               'unitType': '2',
  //               'username': '芊芊'
  //             }],
  //             'forwardParticipant': {
  //               'id': '3',
  //               'imgUrl': '3',
  //               'name': '转转',
  //               'unitType': '3',
  //               'username': '转转'
  //             },
  //             'participant': {
  //               'id': '4',
  //               'imgUrl': '4',
  //               'name': '忍者',
  //               'unitType': '1',
  //               'username': '忍者'
  //             },
  //             'participantDept': 'string'
  //           },
  //           'receiveTime': '2019-01-08 13:56:54',
  //           'userTime': 66548325
  //         },
  //         {
  //           'activityCode': 'Activity3',
  //           'activityName': '测试',
  //           'approval': 'DRAFT',
  //           'finishTime': '2019-31-08 13:56:54',
  //           'originator': {
  //             'assistParticipants': [{
  //               'id': '1',
  //               'imgUrl': '1',
  //               'name': '斑斑',
  //               'unitType': '1',
  //               'username': '斑斑'
  //             }],
  //             'adjustWorkItemParticipants': [{
  //               'id': '2',
  //               'imgUrl': '2',
  //               'name': '芊芊',
  //               'unitType': '2',
  //               'username': '芊芊'
  //             }],
  //             'forwardParticipant': {
  //               'id': '3',
  //               'imgUrl': '3',
  //               'name': '转转',
  //               'unitType': '3',
  //               'username': '转转'
  //             },
  //             'participant': {
  //               'id': '4',
  //               'imgUrl': '4',
  //               'name': '忍者',
  //               'unitType': '1',
  //               'username': '忍者'
  //             },
  //             'participantDept': 'string'
  //           },
  //           'receiveTime': '2019-01-08 13:56:54',
  //           'userTime': 66548325
  //         },
  //         {
  //           'activityCode': 'Activity4',
  //           'activityName': '测试',
  //           'approval': 'DRAFT',
  //           'finishTime': '2019-41-08 13:56:54',
  //           'originator': {
  //             'assistParticipants': [{
  //               'id': '1',
  //               'imgUrl': '1',
  //               'name': '斑斑',
  //               'unitType': '1',
  //               'username': '斑斑'
  //             }],
  //             'adjustWorkItemParticipants': [{
  //               'id': '2',
  //               'imgUrl': '2',
  //               'name': '芊芊',
  //               'unitType': '2',
  //               'username': '芊芊'
  //             }],
  //             'forwardParticipant': {
  //               'id': '3',
  //               'imgUrl': '3',
  //               'name': '转转',
  //               'unitType': '3',
  //               'username': '转转'
  //             },
  //             'participant': {
  //               'id': '4',
  //               'imgUrl': '4',
  //               'name': '忍者',
  //               'unitType': '1',
  //               'username': '忍者'
  //             },
  //             'participantDept': 'string'
  //           },
  //           'receiveTime': '2019-01-08 13:56:54',
  //           'userTime': 66548325
  //         },
  //         {
  //           'activityCode': 'Activity5',
  //           'activityName': '测试',
  //           'approval': 'DRAFT',
  //           'finishTime': '2019-51-08 13:56:54',
  //           'originator': {
  //             'assistParticipants': [{
  //               'id': '1',
  //               'imgUrl': '1',
  //               'name': '斑斑',
  //               'unitType': '1',
  //               'username': '斑斑'
  //             }],
  //             'adjustWorkItemParticipants': [{
  //               'id': '2',
  //               'imgUrl': '2',
  //               'name': '芊芊',
  //               'unitType': '2',
  //               'username': '芊芊'
  //             }],
  //             'forwardParticipant': {
  //               'id': '3',
  //               'imgUrl': '3',
  //               'name': '转转',
  //               'unitType': '3',
  //               'username': '转转'
  //             },
  //             'participant': {
  //               'id': '4',
  //               'imgUrl': '4',
  //               'name': '忍者',
  //               'unitType': '1',
  //               'username': '忍者'
  //             },
  //             'participantDept': 'string'
  //           },
  //           'receiveTime': '2019-01-08 13:56:54',
  //           'userTime': 66548325
  //         },
  //         {
  //           'activityCode': 'Activity6',
  //           'activityName': '测试6',
  //           'approval': '3',
  //           'finishTime': '2019-01-08 13:56:54',
  //           'originator': {
  //             'assistParticipants': [{
  //               'id': '1',
  //               'imgUrl': '1',
  //               'name': '斑斑',
  //               'unitType': '1',
  //               'username': '斑斑'
  //             }],
  //             'adjustWorkItemParticipants': [{
  //               'id': '2',
  //               'imgUrl': '2',
  //               'name': '芊芊',
  //               'unitType': '2',
  //               'username': '芊芊'
  //             }],
  //             'forwardParticipant': {
  //               'id': '3',
  //               'imgUrl': '3',
  //               'name': '转转',
  //               'unitType': '3',
  //               'username': '转转'
  //             },
  //             'participant': {
  //               'id': '4',
  //               'imgUrl': '4',
  //               'name': '忍者',
  //               'unitType': '1',
  //               'username': '忍者'
  //             },
  //             'participantDept': 'string'
  //           },
  //           'receiveTime': '2019-01-08 13:56:54',
  //           'userTime': 66548325,
  //           'subInstanceActivity': true ,
  //           'subWorkItemId':'子流程任务id' ,
  //           'subWorkflowInstanceId': '子流程流程实例id' ,
  //         }
  //       ],
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  {
    api: '/api/runtime/workflow/list_operation',
    response: (req, res) => {
      const data = {
        data: [
          {
            client: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
            detail: '今天真高兴',
            id: '1',
            ip: '192.168.0.00.23',
            operateNode: '采购部处理',
            operationType: '同意: 1, 驳回: 2, 转办: 3, 被取消: 4, 打开表单: 5, 暂存: 6, 撤回: 7, 提交: 8, 不同意: 9, 协办: 10, 加签: 11, 传阅: 12,结束流程: 13,作废: 14,下载附件: 15,打印: 16,编辑: 17,管理员激活节点: 18,管理员调整当前处理人: 19,管理员提前结束流程: 20,管理员取消当前节点所有任务: 21',
            operationTypeName: '同意',
            time: '2019-01-12 08:39:02',
            username: '张三'
          },
          {
            client: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
            detail: '今天真高兴',
            id: '2',
            ip: '192.168.0.00.23',
            operateNode: '采购部处理',
            operationType: '同意: 1, 驳回: 2, 转办: 3, 被取消: 4, 打开表单: 5, 暂存: 6, 撤回: 7, 提交: 8, 不同意: 9, 协办: 10, 加签: 11, 传阅: 12,结束流程: 13,作废: 14,下载附件: 15,打印: 16,编辑: 17,管理员激活节点: 18,管理员调整当前处理人: 19,管理员提前结束流程: 20,管理员取消当前节点所有任务: 21',
            operationTypeName: '同意',
            time: '2019-01-12 08:39:02',
            username: '张三'
          },
          {
            client: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
            detail: '今天真高兴',
            id: '3',
            ip: '192.168.0.00.23',
            operateNode: '采购部处理',
            operationType: '同意: 1, 驳回: 2, 转办: 3, 被取消: 4, 打开表单: 5, 暂存: 6, 撤回: 7, 提交: 8, 不同意: 9, 协办: 10, 加签: 11, 传阅: 12,结束流程: 13,作废: 14,下载附件: 15,打印: 16,编辑: 17,管理员激活节点: 18,管理员调整当前处理人: 19,管理员提前结束流程: 20,管理员取消当前节点所有任务: 21',
            operationTypeName: '同意',
            time: '2019-01-12 08:39:02',
            username: '张三'
          },
          {
            client: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
            detail: '今天真高兴',
            id: '4',
            ip: '192.168.0.00.23',
            operateNode: '采购部处理',
            operationType: '同意: 1, 驳回: 2, 转办: 3, 被取消: 4, 打开表单: 5, 暂存: 6, 撤回: 7, 提交: 8, 不同意: 9, 协办: 10, 加签: 11, 传阅: 12,结束流程: 13,作废: 14,下载附件: 15,打印: 16,编辑: 17,管理员激活节点: 18,管理员调整当前处理人: 19,管理员提前结束流程: 20,管理员取消当前节点所有任务: 21',
            operationTypeName: '同意',
            time: '2019-01-12 08:39:02',
            username: '张三'
          },
          {
            client: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
            detail: '今天真高兴',
            id: '5',
            ip: '192.168.0.00.23',
            operateNode: '采购部处理',
            operationType: '同意: 1, 驳回: 2, 转办: 3, 被取消: 4, 打开表单: 5, 暂存: 6, 撤回: 7, 提交: 8, 不同意: 9, 协办: 10, 加签: 11, 传阅: 12,结束流程: 13,作废: 14,下载附件: 15,打印: 16,编辑: 17,管理员激活节点: 18,管理员调整当前处理人: 19,管理员提前结束流程: 20,管理员取消当前节点所有任务: 21',
            operationTypeName: '同意',
            time: '2019-01-12 08:39:02',
            username: '张三'
          }
        ],
        errcode: 0,
        errmsg: 'string'
      };
      res.json(data);
    }
  },
  // {
  //   api: '/api/runtime/workflow/get_workflowtemplate_chart',
  //   response: (req, res) => {
  //     const data = {
  //       'data': {
  //         'activities': [{
  //           'activityCode': 'Activity1',
  //           'activityName': '开始',
  //           'beforeActivate': null,
  //           'afterActivate': null,
  //           'endActivity': null,
  //           'cancelActivity': null,
  //           'asyncEndJob': null,
  //           'jobSubmitted': null,
  //           'jobRejected': null,
  //           'height': 40,
  //           'width': 158,
  //           'x': 497,
  //           'y': 299,
  //           'activityType': 'START'
  //         }, {
  //           'activityCode': 'Activity2',
  //           'activityName': '填写申请单',
  //           'beforeActivate': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'afterActivate': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'endActivity': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'cancelActivity': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'asyncEndJob': null,
  //           'jobSubmitted': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'jobRejected': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'height': 40,
  //           'width': 158,
  //           'x': 302,
  //           'y': 46,
  //           'activityType': 'PARTICIPANT',
  //           'participant': '{Originator}',
  //           'participantType': 'SINGLE_PARTICIPANT',
  //           'submitButtonName': '同意',
  //           'rejectButtonName': '不同意',
  //           'finishExit': null,
  //           'sheetCode': '',
  //           'propertyPermissions': [],
  //           'permittedAction': {
  //             'forward': true,
  //             'retrieve': true,
  //             'adjustParticipant': false,
  //             'finishInstance': false,
  //             'rejectToStart': false,
  //             'reject': false,
  //             'rejectToFixded': false,
  //             'rejectToActivityCode': null,
  //             'assist': false,
  //             'circulate': false
  //           },
  //           'participationModel': 'PARALLEL',
  //           'noParticipant': 'TO_ADMIN',
  //           'originator': 'DEFAULT',
  //           'perviousParticipate': 'DEFAULT',
  //           'participated': 'DEFAULT',
  //           'followUpParticipate': 'DEFAULT',
  //           'noParticipantNextActivity': 'DEFAULT',
  //           'approveExit': '100%',
  //           'disapproveExit': '1',
  //           'targetActivityCode': null,
  //           'allowedTime': '',
  //           'timeoutWarn1': '',
  //           'timeoutWarn2': '',
  //           'timeoutStrategy': 'NOTIFY_HANDLER'
  //         }, {
  //           'activityCode': 'Activity3',
  //           'activityName': '审批',
  //           'beforeActivate': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'afterActivate': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'endActivity': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'cancelActivity': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'asyncEndJob': null,
  //           'jobSubmitted': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'jobRejected': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': null,
  //             'bizActions': null
  //           },
  //           'height': 40,
  //           'width': 158,
  //           'x': 136,
  //           'y': 225,
  //           'activityType': 'PARTICIPANT',
  //           'participant': '',
  //           'participantType': 'SINGLE_PARTICIPANT',
  //           'submitButtonName': '同意',
  //           'rejectButtonName': '不同意',
  //           'finishExit': null,
  //           'sheetCode': '',
  //           'propertyPermissions': [],
  //           'permittedAction': {
  //             'forward': true,
  //             'retrieve': true,
  //             'adjustParticipant': false,
  //             'finishInstance': false,
  //             'rejectToStart': false,
  //             'reject': false,
  //             'rejectToFixded': false,
  //             'rejectToActivityCode': null,
  //             'assist': false,
  //             'circulate': false
  //           },
  //           'participationModel': 'PARALLEL',
  //           'noParticipant': 'TO_ADMIN',
  //           'originator': 'DEFAULT',
  //           'perviousParticipate': 'DEFAULT',
  //           'participated': 'DEFAULT',
  //           'followUpParticipate': 'DEFAULT',
  //           'noParticipantNextActivity': 'DEFAULT',
  //           'approveExit': '100%',
  //           'disapproveExit': '1',
  //           'targetActivityCode': null,
  //           'allowedTime': '',
  //           'timeoutWarn1': '',
  //           'timeoutWarn2': '',
  //           'timeoutStrategy': 'NOTIFY_HANDLER'
  //         }, {
  //           'activityCode': 'Activity4',
  //           'activityName': '结束',
  //           'beforeActivate': null,
  //           'afterActivate': null,
  //           'endActivity': null,
  //           'cancelActivity': null,
  //           'asyncEndJob': null,
  //           'jobSubmitted': null,
  //           'jobRejected': null,
  //           'height': 40,
  //           'width': 158,
  //           'x': 0,
  //           'y': 81,
  //           'activityType': 'END'
  //         }, {
  //           'activityCode': 'Activity5',
  //           'activityName': '系统活动',
  //           'beforeActivate': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': [],
  //             'bizActions': []
  //           },
  //           'afterActivate': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': [],
  //             'bizActions': []
  //           },
  //           'endActivity': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': [],
  //             'bizActions': []
  //           },
  //           'cancelActivity': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': [],
  //             'bizActions': []
  //           },
  //           'asyncEndJob': null,
  //           'jobSubmitted': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': [],
  //             'bizActions': []
  //           },
  //           'jobRejected': {
  //             'receiver': null,
  //             'content': null,
  //             'cancelParllelActivity': false,
  //             'dataDisposals': [],
  //             'bizActions': []
  //           },
  //           'height': 40,
  //           'width': 158,
  //           'x': 537,
  //           'y': 17,
  //           'activityType': 'SYSTEM_ACTIVITY',
  //           'bizActions': ['fff', 'gg'],
  //           'finishCondition': null
  //         }],
  //         'rules': [{
  //           'text': '',
  //           'utilizeElse': false,
  //           'fixedPoint': true,
  //           'formula': '',
  //           'preActivityCode': 'Activity2',
  //           'postActivityCode': 'Activity5',
  //           'points': ['460, 65', '498, 65', '498, 36', '537, 36'],
  //           'popupType': 'FUNCTION'
  //         }, {
  //           'text': '拖拽文字',
  //           'utilizeElse': true,
  //           'fixedPoint': true,
  //           'formula': '',
  //           'preActivityCode': 'Activity1',
  //           'postActivityCode': 'Activity3',
  //           'points': ['572, 339', '572, 359', '209, 359', '209, 265'],
  //           'popupType': 'FUNCTION'
  //         }, {
  //           'text': '',
  //           'utilizeElse': false,
  //           'fixedPoint': true,
  //           'formula': '',
  //           'preActivityCode': 'Activity2',
  //           'postActivityCode': 'Activity4',
  //           'points': ['302, 67', '230, 67', '230, 100', '158, 100'],
  //           'popupType': 'FUNCTION'
  //         }, {
  //           'text': '',
  //           'utilizeElse': false,
  //           'fixedPoint': true,
  //           'formula': '',
  //           'preActivityCode': 'Activity3',
  //           'postActivityCode': 'Activity2',
  //           'points': ['294, 250', '395, 250', '395, 86'],
  //           'popupType': 'FUNCTION'
  //         }],
  //         'activityStatus': [
  //           {
  //             'activityCode': 'Activity1',
  //             'status': 'finish',
  //           },
  //           {
  //             'activityCode': 'Activity2',
  //             'status': 'wrong',
  //           },
  //           {
  //             'activityCode': 'Activity3',
  //             'status': 'processing',
  //           }
  //         ],
  //         'workflowCode': 'oooo',
  //
  //       },
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/abort_instance',
  //   response: (req, res) => {
  //     const data = {
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/delete_instance',
  //   response: (req, res) => {
  //     const data = {
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/finish_instance',
  //   response: (req, res) => {
  //     const data = {
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/cancel_activity',
  //   response: (req, res) => {
  //     const data = {
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/adjust_participantors',
  //   response: (req, res) => {
  //     const data = {
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/activate_activity',
  //   response: (req, res) => {
  //     const data = {
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/list_workflow_instance_activity',
  //   response: (req, res) => {
  //     const data = {
  //       'data': [{
  //         'activityCode': '节点编码1',
  //         'activityName': '节点名称1',
  //         'status': 0,
  //         'participantors': [{
  //           'id': '1',
  //           'type':3,
  //           'name': '李四'
  //         }, {
  //           'id': '2',
  //           'type':3,
  //           'name': '王五'
  //         }]
  //       }, {
  //         'activityCode': '节点编码2',
  //         'activityName': '节点名称2',
  //         'status': 1,
  //         'participantors': [{
  //           'id': '3',
  //           'type':3,
  //           'name': '赵六'
  //         }, {
  //           'id': '4',
  //           'type':3,
  //           'name': '菲菲'
  //         }]
  //       }
  //       ],
  //       'errcode': 0,
  //       'errmsg': 'string'
  //     };
  //     res.json(data)
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/list_workitem_approvals',
  //   response: (req, res) => {
  //     const data = {
  //       data: [
  //         {
  //           activityCode: '111',
  //           activityName: '我是审批',
  //           activityStatus: 'PASS',
  //           nodes: [
  //             {
  //               approvalTime: '2019-01-15 09:09:37',
  //               approvaler: {
  //                 id: '1',
  //                 imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                 name: '张三',
  //               },
  //               bizComment: {
  //                 type: '0',
  //                 title: '测试意见',
  //                 userInfos: [
  //                   {
  //                     id: '2',
  //                     imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                     name: '斑斑',
  //                   }
  //                 ],
  //                 text: '看过现场了，场地环境很差，周边人数稀少，不适合做营销活动。'
  //               },
  //               dept: '宣传部',
  //               from: {
  //                 fromType: '6',
  //                 userInfo: {
  //                   id: '2',
  //                   imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                   name: '李四',
  //                 }
  //               },
  //               resources: [
  //                 {
  //                   fileExtension: 'string',
  //                   fileSize: 0,
  //                   id: 'string',
  //                   mimeType: 'string',
  //                   name: 'string',
  //                   refId: 'string',
  //                   schemaCode: 'string',
  //                   storageMethod: 'string'
  //                 }
  //               ],
  //               status: '3',
  //               workActionType: '3',
  //               workItemId: 'string',
  //               workflowInstanceId: 'string'
  //             },
  //             {
  //               approvalTime: '2019-01-15 09:09:37',
  //               approvaler: {
  //                 id: '2',
  //                 imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                 name: '李四',
  //               },
  //               bizComment: {
  //                 type: '1',
  //                 userInfos: [
  //                   {
  //                     id: '2',
  //                     imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                     name: '斑斑',
  //                   },
  //                   {
  //                     id: '2',
  //                     imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                     name: '尼玛',
  //                   }
  //                 ],
  //                 text: '看过现场了，场地环境很差，周边人数稀少，不适合做营销活动。'
  //               },
  //               dept: '宣传部2',
  //               from: {
  //                 fromType: '5',
  //                 userInfo: {
  //                   id: '2',
  //                   imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                   name: '李四',
  //                 }
  //               },
  //               resources: [
  //                 {
  //                   fileExtension: 'string',
  //                   fileSize: 0,
  //                   id: 'string',
  //                   mimeType: 'string',
  //                   name: 'string',
  //                   refId: 'string',
  //                   schemaCode: 'string',
  //                   storageMethod: 'string'
  //                 }
  //               ],
  //               status: '3',
  //               workActionType: '3',
  //               workItemId: 'string',
  //               workflowInstanceId: 'string'
  //             },
  //             {
  //               approvalTime: '2019-01-15 09:09:37',
  //               approvaler: {
  //                 id: '2',
  //                 imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                 name: '李进行',
  //               },
  //               bizComment: {
  //                 type: '1',
  //                 title: '测试意见',
  //                 text: '看过现场了，场地环境很差，周边人数稀少，不适合做营销活动。'
  //               },
  //               dept: '宣传部2',
  //               from: {
  //                 fromType: '5',
  //                 userInfo: {
  //                   id: '2',
  //                   imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                   name: '李四',
  //                 }
  //               },
  //               resources: [
  //                 {
  //                   fileExtension: 'string',
  //                   fileSize: 0,
  //                   id: 'string',
  //                   mimeType: 'string',
  //                   name: 'string',
  //                   refId: 'string',
  //                   schemaCode: 'string',
  //                   storageMethod: 'string'
  //                 }
  //               ],
  //               workItemStatus: '2',
  //               workActionType: '3',
  //               workItemId: 'string',
  //               workflowInstanceId: 'string'
  //             },
  //             {
  //               approvalTime: '2019-01-15 09:09:37',
  //               approvaler: {
  //                 id: '2',
  //                 imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                 name: '李启动',
  //               },
  //               bizComment: {
  //                 type: '1',
  //                 title: '测试意见',
  //                 text: '看过现场了，场地环境很差，周边人数稀少，不适合做营销活动。'
  //               },
  //               dept: '宣传部2',
  //               from: {
  //                 fromType: '5',
  //                 userInfo: {
  //                   id: '2',
  //                   imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                   name: '李四',
  //                 }
  //               },
  //               resources: [
  //                 {
  //                   fileExtension: 'string',
  //                   fileSize: 0,
  //                   id: 'string',
  //                   mimeType: 'string',
  //                   name: 'string',
  //                   refId: 'string',
  //                   schemaCode: 'string',
  //                   storageMethod: 'string'
  //                 }
  //               ],
  //               workItemStatus: '1',
  //               workActionType: '3',
  //               workItemId: 'string',
  //               workflowInstanceId: 'string'
  //             }
  //           ],
  //           subInstanceActivity: false
  //         },
  //         {
  //           activityCode: '222',
  //           activityName: '子流程',
  //           activityStatus: 'INPROGRESS',
  //           nodes: [
  //             {
  //               approvalTime: '2019-01-15 09:09:37',
  //               approvaler: {
  //                 id: '1',
  //                 imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                 name: '张三',
  //               },
  //               bizComment: {
  //                 type: '4',
  //                 title: '测试意见',
  //                 text: '看过现场了，场地环境很差，周边人数稀少，不适合做营销活动。'
  //               },
  //               dept: '宣传部',
  //               from: {
  //                 fromType: '7',
  //                 userInfo: {
  //                   id: '2',
  //                   imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                   name: '李四',
  //                 }
  //               },
  //               resources: [
  //                 {
  //                   fileExtension: 'string',
  //                   fileSize: 0,
  //                   id: 'string',
  //                   mimeType: 'string',
  //                   name: 'string',
  //                   refId: 'string',
  //                   schemaCode: 'string',
  //                   storageMethod: 'string'
  //                 }
  //               ],
  //               workItemStatus: '2',
  //               workActionType: '3',
  //               workItemId: 'string',
  //               workflowInstanceId: 'string'
  //             }
  //           ],
  //           subInstanceActivity: true
  //         },
  //         {
  //           activityCode: '222',
  //           activityName: '不通过的',
  //           activityStatus: 'UNPASS',
  //           nodes: [
  //             {
  //               approvalTime: '2019-01-15 09:09:37',
  //               approvaler: {
  //                 id: '1',
  //                 imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                 name: '张三',
  //               },
  //               bizComment: {
  //                 type: '4',
  //                 title: '测试意见',
  //                 text: '看过现场了，场地环境很差，周边人数稀少，不适合做营销活动。'
  //               },
  //               dept: '宣传部',
  //               from: {
  //                 fromType: '7',
  //                 userInfo: {
  //                   id: '2',
  //                   imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548224686742&di=e93f1905d4f9c5900c12df326e46c329&imgtype=0&src=http%3A%2F%2Fdesk.fd.zol-img.com.cn%2Ft_s960x600c5%2Fg5%2FM00%2F02%2F00%2FChMkJlbKw-GIM5EgAAlLhFpuYfsAALG-ACm4qUACUuc468.jpg',
  //                   name: '李四',
  //                 }
  //               },
  //               resources: [
  //                 {
  //                   fileExtension: 'string',
  //                   fileSize: 0,
  //                   id: 'string',
  //                   mimeType: 'string',
  //                   name: 'string',
  //                   refId: 'string',
  //                   schemaCode: 'string',
  //                   storageMethod: 'string'
  //                 }
  //               ],
  //               workItemStatus: '2',
  //               workActionType: '3',
  //               workItemId: 'string',
  //               workflowInstanceId: 'string'
  //             }
  //           ],
  //           subInstanceActivity: false
  //         },
  //         {
  //           activityName: '结束',
  //           activityStatus: 'END'
  //         }
  //       ],
  //       errcode: 0,
  //       errmsg: 'string'
  //     };
  //     res.json(data);
  //   }
  // },

  // {
  //   api: '/api/runtime/workflow/list_instance_logs',
  //   response: (req, res) => {
  //     const data = {
  //       data: [
  //         {
  //           activityCode: 'Activity1',
  //           activityName: '测试',
  //           approvalActionStatus: '1',
  //           finishTime: '2019-11-08 12:56:54',
  //           originator: {
  //             assistParticipants: [{
  //               id: '1',
  //               imgUrl: '1',
  //               name: '斑斑',
  //               unitType: '1',
  //               username: '斑斑'
  //             }],
  //             adjustWorkItemParticipant: [{
  //               id: '2',
  //               imgUrl: '2',
  //               name: '芊芊',
  //               unitType: '2',
  //               username: '芊芊'
  //             }],
  //             forwardParticipant: {
  //               id: '3',
  //               imgUrl: '3',
  //               name: '转转',
  //               unitType: '3',
  //               username: '转转'
  //             },
  //             participant: {
  //               id: '4',
  //               imgUrl: '4',
  //               name: '忍者',
  //               unitType: '1',
  //               username: '忍者'
  //             },
  //             participantDept: 'string'
  //           },
  //           receiveTime: '2019-01-08 12:56:54',
  //           userTime: 66548325
  //         },
  //         {
  //           activityCode: 'Activity2',
  //           activityName: '测试',
  //           approvalActionStatus: '1',
  //           finishTime: '2019-21-08 13:56:54',
  //           originator: {
  //             assistParticipants: [{
  //               id: '1',
  //               imgUrl: '1',
  //               name: '斑斑',
  //               unitType: '1',
  //               username: '斑斑'
  //             }],
  //             adjustWorkItemParticipant: [{
  //               id: '2',
  //               imgUrl: '2',
  //               name: '芊芊',
  //               unitType: '2',
  //               username: '芊芊'
  //             }],
  //             forwardParticipant: {
  //               id: '3',
  //               imgUrl: '3',
  //               name: '转转',
  //               unitType: '3',
  //               username: '转转'
  //             },
  //             participant: {
  //               id: '4',
  //               imgUrl: '4',
  //               name: '忍者',
  //               unitType: '1',
  //               username: '忍者'
  //             },
  //             participantDept: 'string'
  //           },
  //           receiveTime: '2019-01-08 13:56:54',
  //           userTime: 66548325
  //         },
  //         {
  //           activityCode: 'Activity3',
  //           activityName: '测试',
  //           approvalActionStatus: '1',
  //           finishTime: '2019-31-08 13:56:54',
  //           originator: {
  //             assistParticipants: [{
  //               id: '1',
  //               imgUrl: '1',
  //               name: '斑斑',
  //               unitType: '1',
  //               username: '斑斑'
  //             }],
  //             adjustWorkItemParticipant: [{
  //               id: '2',
  //               imgUrl: '2',
  //               name: '芊芊',
  //               unitType: '2',
  //               username: '芊芊'
  //             }],
  //             forwardParticipant: {
  //               id: '3',
  //               imgUrl: '3',
  //               name: '转转',
  //               unitType: '3',
  //               username: '转转'
  //             },
  //             participant: {
  //               id: '4',
  //               imgUrl: '4',
  //               name: '忍者',
  //               unitType: '1',
  //               username: '忍者'
  //             },
  //             participantDept: 'string'
  //           },
  //           receiveTime: '2019-01-08 13:56:54',
  //           userTime: 66548325
  //         },
  //         {
  //           activityCode: 'Activity4',
  //           activityName: '测试',
  //           approvalActionStatus: '1',
  //           finishTime: '2019-41-08 13:56:54',
  //           originator: {
  //             assistParticipants: [{
  //               id: '1',
  //               imgUrl: '1',
  //               name: '斑斑',
  //               unitType: '1',
  //               username: '斑斑'
  //             }],
  //             adjustWorkItemParticipant: [{
  //               id: '2',
  //               imgUrl: '2',
  //               name: '芊芊',
  //               unitType: '2',
  //               username: '芊芊'
  //             }],
  //             forwardParticipant: {
  //               id: '3',
  //               imgUrl: '3',
  //               name: '转转',
  //               unitType: '3',
  //               username: '转转'
  //             },
  //             participant: {
  //               id: '4',
  //               imgUrl: '4',
  //               name: '忍者',
  //               unitType: '1',
  //               username: '忍者'
  //             },
  //             participantDept: 'string'
  //           },
  //           receiveTime: '',
  //           userTime: 66548325
  //         },
  //         {
  //           activityCode: 'Activity1',
  //           activityName: '测试',
  //           approvalActionStatus: '1',
  //           finishTime: '2019-51-08 13:56:54',
  //           originator: {
  //             assistParticipants: [{
  //               id: '1',
  //               imgUrl: '1',
  //               name: '斑斑',
  //               unitType: '1',
  //               username: '斑斑'
  //             }],
  //             adjustWorkItemParticipant: [{
  //               id: '2',
  //               imgUrl: '2',
  //               name: '芊芊',
  //               unitType: '2',
  //               username: '芊芊'
  //             }],
  //             forwardParticipant: {
  //               id: '3',
  //               imgUrl: '3',
  //               name: '转转',
  //               unitType: '3',
  //               username: '转转'
  //             },
  //             participant: {
  //               id: '4',
  //               imgUrl: '4',
  //               name: '忍者',
  //               unitType: '1',
  //               username: '忍者'
  //             },
  //             participantDept: 'string'
  //           },
  //           receiveTime: '2019-01-08 13:56:54',
  //           userTime: 66548325
  //         },
  //         {
  //           activityCode: 'Activity7',
  //           activityName: '测试',
  //           approvalActionStatus: '1',
  //           finishTime: '2019-01-08 13:56:54',
  //           originator: {
  //             assistParticipants: [{
  //               id: '1',
  //               imgUrl: '1',
  //               name: '斑斑',
  //               unitType: '1',
  //               username: '斑斑'
  //             }],
  //             adjustWorkItemParticipant: [{
  //               id: '2',
  //               imgUrl: '2',
  //               name: '芊芊',
  //               unitType: '2',
  //               username: '芊芊'
  //             }],
  //             forwardParticipant: {
  //               id: '3',
  //               imgUrl: '3',
  //               name: '转转',
  //               unitType: '3',
  //               username: '转转'
  //             },
  //             participant: {
  //               id: '4',
  //               imgUrl: '4',
  //               name: '忍者',
  //               unitType: '1',
  //               username: '忍者'
  //             },
  //             participantDept: 'string'
  //           },
  //           receiveTime: '',
  //           userTime: 66548325,
  //           subInstanceActivity: true,
  //           subWorkItemId: 'string',
  //           subWorkflowInstanceId: 'string',
  //           workItemStatus: '1'
  //         }
  //       ],
  //       errcode: 0,
  //       errmsg: 'string'
  //     };
  //     res.json(data);
  //   }
  // }
];
