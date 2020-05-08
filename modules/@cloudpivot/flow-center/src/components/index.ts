export default {
  pc: {
    MyUnFinishedWorkItem: () => import('./pc/my-unfinished-workItem.vue'),
    MyUnReadWorkItem: () => import('./pc/my-unread-workitem.vue'),
    MyFinishedWorkItem: () => import('./pc/my-finished-workitem.vue'),
    MyReadWorkItem: () => import('./pc/my-read-workitem.vue'),
    MyWorkflow: () => import('./pc/my-workflow.vue'),
    QueryInstance: () => import('./pc/query-instance.vue'),
    TaskSearch: () => import('./pc/task-search.vue'),
    WorkflowCenterMenu: () => import('./pc/menu/workflow-center-menu.vue'),
    StartWorkflow: () => import('./pc/start-workflow.vue'),
  },
  mobile: {
    InitialInstance: () => import('./mobile/initial-instance.vue'),
    MyInstanceItem: () => import('./mobile/my-instance/item.vue'),
    MyUnFinishedWorkItem: () => import('./mobile/my-unfinished-workItem.vue'),
    MyUnReadWorkItem: () => import('./mobile/my-unread-workitem.vue'),
    MyFinishedWorkItem: () => import('./mobile/my-finished-workitem.vue'),
    MyReadWorkItem: () => import('./mobile/my-read-workitem.vue'),
    AppTask: () => import('./mobile/app-task.vue')
  }
}
