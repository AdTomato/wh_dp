import {
  renderer
} from '@cloudpivot/form';

/**
 * 按控件类型构建控件选项
 * @param controlType
 * @param sourceOpts 需要合并的选项
 */
export function buildControlOptions(controlType: renderer.FormControlType, sourceOpts?: renderer.FormControlOptions): renderer.FormControlOptions {
  let options: renderer.FormControlOptions | null = null;

  switch (controlType) {
    // 基础控件
    case renderer.FormControlType.Text:
      options = new renderer.TextOptions();
      break;
    case renderer.FormControlType.Textarea:
      options = new renderer.TextareaOptions();
      break;
    case renderer.FormControlType.Checkbox:
      options = new renderer.CheckboxOptions();
      break;
    case renderer.FormControlType.Radio:
      options = new renderer.CheckboxOptions();
      break;
    case renderer.FormControlType.Dropdown:
      options = new renderer.DropdownOptions();
      break;
    case renderer.FormControlType.Logic:
      options = new renderer.LogicOptions();
      break;
    case renderer.FormControlType.Date:
      options = new renderer.DateOptions();
      break;
    case renderer.FormControlType.Number:
      options = new renderer.NumberOptions();
      break;
    case renderer.FormControlType.Label:
      options = new renderer.StyleControlOptions();
      break;
    case renderer.FormControlType.Title:
      options = new renderer.StyleControlOptions();
      break;
    case renderer.FormControlType.DateRange:
      options = new renderer.DateOptions();
      break;
    case renderer.FormControlType.NumberRange:
      options = new renderer.NumberOptions();
      break;
      case renderer.FormControlType.Address:
      options = new renderer.AddressOptions();
      break;

    // 复合控件
    case renderer.FormControlType.Attachment:
      options = new renderer.AttachmentOptions();
      break;
    case renderer.FormControlType.ApprovalOpinion:
      options = new renderer.ApprovalOpinionOptions();
      break;
    case renderer.FormControlType.Image:
      options = new renderer.ImageUploadOptions();
      break;
    case renderer.FormControlType.Location:
      options = new renderer.LocationOptions();
      break;

    case renderer.FormControlType.RelevanceForm:
      options = new renderer.RelevanceFormOptions();
      break;

    case renderer.FormControlType.StaffSelector:
    case renderer.FormControlType.StaffMultiSelector:
      options = new renderer.StaffSelectorOptions();
      options.deptVisible = false;
      if (controlType === renderer.FormControlType.StaffMultiSelector) {
        options.multi = true;
      }
      break;

    case renderer.FormControlType.DepartmentSelector:
    case renderer.FormControlType.DepartmentMultiSelector:
      options = new renderer.StaffSelectorOptions();
      options.userVisible = false;
      if (controlType === renderer.FormControlType.DepartmentMultiSelector) {
        options.multi = true;
      }
      break;

    case renderer.FormControlType.Sheet:
      options = new renderer.SheetOptions();
      break;
    case renderer.FormControlType.SheetStatistic:
      options = new renderer.SheetStatisticOptions();
      break;


    // 系统控件
    case renderer.FormControlType.SequenceNo:
      options = new renderer.SequenceNoOptions();
      break;

    case renderer.FormControlType.CreateBy:
    case renderer.FormControlType.ModifyBy:
    case renderer.FormControlType.OwnerId:
    case renderer.FormControlType.CreateByParentId:
    case renderer.FormControlType.SystemOther:
      options = new renderer.StyleControlOptions();
      break;

    case renderer.FormControlType.CreatedTime:
    case renderer.FormControlType.ModifiedTime:
      options = new renderer.CreatedTimeOptions();
      break;


    // 布局控件
    case renderer.FormControlType.Description:
      options = new renderer.LayoutControlOptions();
      break;
    case renderer.FormControlType.Group:
      options = new renderer.LayoutControlOptions();
      break;
    case renderer.FormControlType.Title:
      options = new renderer.StyleControlOptions();
      break;
  }

  if (!options) {
    throw Error('未知的控件类型');
  }

  if (sourceOpts) {
    Object.keys(options).forEach((k) => {
      if ((sourceOpts as any)[k] !== undefined) {
        (options as any)[k] = (sourceOpts as any)[k];
      }
    });
  }

  return options;
}
