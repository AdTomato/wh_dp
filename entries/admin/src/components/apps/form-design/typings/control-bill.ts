
import { FormControlType } from '../typings';

import * as Factory from './control-factory';

import * as SystemCodes from '../../../shared/system-data-item-codes';


export default {

  group: [
    {
      name: '基础控件',
      controls: [
        {
          type: FormControlType.Text,
          name: '单行文本',
          icon: 'h-icon-all-single-line-text'
        }, {
          type: FormControlType.Textarea,
          name: '长文本',
          icon: 'h-icon-all-text-multiline'
        }, {
          type: FormControlType.Date,
          name: '日期',
          icon: 'h-icon-all-calendar-o'
        }, {
          type: FormControlType.Number,
          name: '数值',
          icon: 'h-icon-all-number'
        }, {
          type: FormControlType.Radio,
          name: '单选框',
          icon: 'h-icon-all-single-selection-o'
        }, {
          type: FormControlType.Checkbox,
          name: '复选框',
          icon: 'h-icon-all-check-square-o'
        }, {
          type: FormControlType.Dropdown,
          name: '下拉框',
          icon: 'h-icon-all-drop-down-o'
        }, {
          type: FormControlType.Logic,
          name: '逻辑',
          icon: 'h-icon-all-logic-switch-o'
        }, {
          type: FormControlType.Attachment,
          name: '附件',
          icon: 'h-icon-all-paperclip-o'
        }, {
          type: FormControlType.Image,
          name: '图片',
          icon: 'h-icon-all-picture-o'
        }, 
        {
          type: FormControlType.Signature,
          name: '手写签名',
          icon: 'h-icon-all-edit-o'
        }, 
        {
          type: FormControlType.Location,
          name: '地址',
          icon: 'h-icon-all-position-o'
        }, {
        //   type: FormControlType.ApprovalOpinion,
        //   name: '审批意见',
        //   icon: 'h-icon-all-form-o'
        // }, {
          type: FormControlType.StaffSelector,
          name: '人员单选',
          icon: 'h-icon-all-add-user-o'
        }, {
          type: FormControlType.StaffMultiSelector,
          name: '人员多选',
          icon: 'h-icon-all-add-user-group-o'
        }, {
          type: FormControlType.DepartmentSelector,
          name: '部门单选',
          icon: 'h-icon-all-department-single-se'
        }, {
          type: FormControlType.DepartmentMultiSelector,
          name: '部门多选',
          icon: 'h-icon-all-department-multiple-'
        }
      ]
    },

    {
      name: '布局控件',
      controls: [{
        type: FormControlType.Group,
        name: '分组标题',
        icon: 'h-icon-all-text-t'
      }, {
        type: FormControlType.Description,
        name: '描述说明',
        icon: 'h-icon-all-question-circle-o'
      }, {
        type: FormControlType.Sheet,
        name: '子表',
        icon: 'h-icon-all-table-o'
      }]
    },

    {
      name: '系统控件',
      controls: [{
        code : SystemCodes.sequence_no,
        type: FormControlType.SequenceNo,
        name: '单据号',
        // icon: 'h-icon-all-text-t'
        icon: 'h-icon-all-barcode-o'
      }
      // ,{
      //   code : SystemCodes.sequence_status,
      //   type: FormControlType.SequenceStatus,
      //   name: '单据状态',
      //   // icon: 'h-icon-all-text-t'
      //   icon: 'h-icon-all-barcode-o'
      // }
      , {
        code : SystemCodes.creater,
        type: FormControlType.CreateBy,
        name: '创建人',
        icon: 'h-icon-all-user-o'
      }, {
        code : SystemCodes.created_dept_id,
        type: FormControlType.CreateByParentId,
        name: '创建人部门',
        icon: 'h-icon-all-creator'
      }, {
        code : SystemCodes.owner,
        type: FormControlType.OwnerId,
        name: '拥有者',
        icon: 'h-icon-all-user-list-o'
      }, {
        code : SystemCodes.created_time,
        type: FormControlType.CreatedTime,
        name: '创建时间',
        icon: 'h-icon-all-clock-circle-o'
      }, {
        code : SystemCodes.modified_time,
        type: FormControlType.ModifiedTime,
        name: '修改时间',
        icon: 'h-icon-all-clock-edit-o'
      }, {
        code : SystemCodes.modifier,
        type: FormControlType.ModifyBy,
        name: '修改人',
        icon: 'h-icon-all-user-modifier-o'
      }]
    },

    {
      name: '高级控件',
      controls: [{
        type: FormControlType.RelevanceForm,
        name: '关联表单',
        icon: 'h-icon-all-form-related-o'
      }, {
        type: FormControlType.ReverseRelevance,
        name: '关联查询',
        icon: 'h-icon-all-form-related-manycho'
      }]
    }
  ]
}