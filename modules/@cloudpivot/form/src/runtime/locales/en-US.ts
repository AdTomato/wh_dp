import { FormAction } from "../form-action";

export default {

  action: {
    [FormAction.AdjustParticipant]: 'Add-approver',
    [FormAction.Agree]: 'Agree',
    [FormAction.DisAgree]: 'Disagree',
    [FormAction.Assist]: 'Assist',
    [FormAction.Cancel]: 'Cancel',
    [FormAction.Circulate]: 'Circulate',
    [FormAction.Delete]: 'Delete',
    [FormAction.Edit]: 'Edit',
    [FormAction.FinishInstance]: 'Completed',
    [FormAction.Forward]: 'Transfer',
    [FormAction.Print]: 'Print',
    [FormAction.Reject]: 'Reject',
    [FormAction.Retrieve]: 'Recall',
    [FormAction.Save]: 'Save',
    [FormAction.Submit]: 'Submit',
    [FormAction.Urge]: 'Urge',
    more : 'More',
    save2 : 'Save',
    cancel2 : 'Cancel'
  },

  actionTip: {
    [FormAction.AdjustParticipant]: 'Add-approver succeeded!',
    [FormAction.Agree]: 'Operation succeeded!',
    [FormAction.DisAgree]: 'Operation succeeded!',
    [FormAction.Assist]: 'Assist succeeded!',
    [FormAction.Cancel]: 'Operation succeeded!',
    [FormAction.Circulate]: 'Circulate succeeded!',
    [FormAction.Delete]: 'Delete succeeded!',
    [FormAction.FinishInstance]: 'FinishInstance succeeded!',
    [FormAction.Forward]: 'Transfer succeeded!',
    [FormAction.Reject]: 'Reject succeeded!',
    [FormAction.Retrieve]: 'Recall succeeded!',
    [FormAction.Save]: 'Save succeeded!',
    [FormAction.Submit]: 'Submit succeeded!',
    [FormAction.Urge]: 'Send succeeded!',
  },

  tip : {
    [FormAction.Cancel]: 'The workflow will be stuck after cancel,are you sure to cancel?',
    [FormAction.Delete]: "The item be restored after deletion. Are you sure you want to delete it?",
    [FormAction.FinishInstance]: 'End the Workflow ahead of schedule?',
    [FormAction.Retrieve]: 'Are you sure to withdraw the mission?',
    saveSuccess : 'Save success',
    deleteSuccess : 'Delete success',
    retrieveSuccess : 'Retrieve success',
    rejectSuccess : 'Reject success',
  },

  modal: {
    selectUser: 'Choose {text}',
    pleaseSelectUser: 'Choose {text}',
    explain: '{text} details',
    pleaseInputExplain: 'Please input {text} info',
    pleaseInput: 'Please input',
    pleaseChoose: 'Please Choose',
    reject: 'Reject to',
    reSubmitTip: 'Recommit back to the current node',
    selectOrg: 'Choose department',
    pleaseInputOpinion: 'Please input opinion',
    pleaseAddSign: 'Please add sign',
    noRejectNode:'No reject node',
  },

  biz: {
    systemValue: 'System Filling',
    index: 'NO.',
    add: 'add',
    delete: 'delete',
    action: 'action',
    importData: 'Import data',
    importTips1: 'For make sure the data is legal,please ',
    importTips2: 'Download the sample file',
    importLocalFaile: 'Upload the local file',
    selectLocalFaile: 'Choose local file',
    importTips3: 'Only support .xlsx file,and limited to 500 lines data',
    cancel: 'Cancel',
    clear: 'Clear',
    startImport: 'start import',
    ok: 'OK',
    reImport: 'Import again',
    importing: 'Importing',
    importTips4: 'Please do not close the windows otherwise it will be interrupted',
    import: 'import',
    export: 'export',
    fullScreen: 'full',
    smallScreen: 'small',
    importFormRelevanceForm: 'Import from Relation Model',
    addMethod: 'Adding Method'
  },
  urge: {
    check: 'Check',
    urgeRecord: 'Urgent Records',
    urgeContent: 'Urgent Content',
    loadAll: 'All records loaded',
    plzInput: 'Please Input',
    urgeSuccess: 'urge succeed!',
    urgeFailed: 'urge failed,please try again!',
    cantUrgeSelf: 'You are the current approver,can\'t urge yourself.',
    netError: 'NetWork Error'
  }

  

};