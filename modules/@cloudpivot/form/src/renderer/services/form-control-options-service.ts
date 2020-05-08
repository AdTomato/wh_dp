
import * as typings from '../typings';

/**
 * 表单控件选项服务
 */
export abstract class FormControlOptionsService {

    /**
     * 构建选项对象
     * @param controlType 控件类型
     * @param sourceOpts 源属性对象，会覆盖初始属性值
     */
    static buildFor(controlType: typings.FormControlType, sourceOpts?: typings.FormControlOptions) {
        let options: typings.FormControlOptions | null = null;

        switch (controlType) {

            // 基础控件
            case typings.FormControlType.Text:
                options = new typings.TextOptions();
                options.maxLength = 200;
                break;
            case typings.FormControlType.Textarea:
                options = new typings.TextareaOptions();
                options.maxLength = 2000;
                break;
            case typings.FormControlType.Checkbox:
                options = new typings.CheckboxOptions();
                break;
            case typings.FormControlType.Radio:
                options = new typings.CheckboxOptions();
                break;
            case typings.FormControlType.Dropdown:
                options = new typings.DropdownOptions();
                break;
            case typings.FormControlType.Logic:
                options = new typings.LogicOptions();
                break;
            case typings.FormControlType.Date:
                options = new typings.DateOptions();
                break;
            case typings.FormControlType.Number:
                options = new typings.NumberOptions();
                break;
            case typings.FormControlType.Label:
                options = new typings.StyleControlOptions();
                break;
            case typings.FormControlType.Title:
                options = new typings.StyleControlOptions();
                break;
            case typings.FormControlType.DateRange:
                options = new typings.DateOptions();
                break;
            case typings.FormControlType.NumberRange:
                options = new typings.NumberOptions();
                break;
            case typings.FormControlType.Address: 
                options = new typings.AddressOptions();
                break;
            case typings.FormControlType.Signature: 
                options = new typings.SignatureUploadOptions();
                break;

            // 复合控件
            case typings.FormControlType.Attachment:
                options = new typings.AttachmentOptions();
                break;
            case typings.FormControlType.ApprovalOpinion:
                options = new typings.ApprovalOpinionOptions();
                break;
            case typings.FormControlType.Image:
                options = new typings.ImageUploadOptions();
                break;
            case typings.FormControlType.Location:
                options = new typings.LocationOptions();
                break;

            case typings.FormControlType.RelevanceForm:
                options = new typings.RelevanceFormOptions();
                break;
            case typings.FormControlType.ReverseRelevance:
                options = new typings.ReverseRelevanceOptions();
                break;

            case typings.FormControlType.StaffSelector:
            case typings.FormControlType.StaffMultiSelector:
                options = new typings.StaffSelectorOptions();
                options.deptVisible = typings.StaffSelectorSelectType.User;
                if (controlType === typings.FormControlType.StaffMultiSelector) {
                    options.multi = true;
                }
                break;

            case typings.FormControlType.DepartmentSelector:
            case typings.FormControlType.DepartmentMultiSelector:
                options = new typings.StaffSelectorOptions();
                options.deptVisible = typings.StaffSelectorSelectType.Org;
                if (controlType === typings.FormControlType.DepartmentMultiSelector) {
                    options.multi = true;
                }
                break;

            case typings.FormControlType.Sheet:
                options = new typings.SheetOptions();
                break;
            case typings.FormControlType.SheetStatistic:
                options = new typings.SheetStatisticOptions();
                break;

            // 系统控件
            case typings.FormControlType.SequenceNo:
                options = new typings.SequenceNoOptions();
                break;

            case typings.FormControlType.CreateBy:
            case typings.FormControlType.ModifyBy:
            case typings.FormControlType.OwnerId:
            case typings.FormControlType.CreateByParentId:
            case typings.FormControlType.SystemOther:
                options = new typings.StyleControlOptions();
                break;

            case typings.FormControlType.CreatedTime:
            case typings.FormControlType.ModifiedTime:
                options = new typings.CreatedTimeOptions();
                break;


            // 布局控件
            case typings.FormControlType.Description:
                options = new typings.LayoutControlOptions();
                break;
            case typings.FormControlType.Group:
                options = new typings.GroupTitleOptions();
                break;
            case typings.FormControlType.Title:
                options = new typings.StyleControlOptions();
                break;

            case typings.FormControlType.Html:
                options = {};
                break;

        }

        if (options && sourceOpts) {
            // debugger
            // Object.keys(options).forEach(k => {
            //     const val = (sourceOpts as any)[k];
            //     if (val !== undefined) {
            //         (options as any)[k] = val;
            //     }
            // });
            options = Object.assign(options, sourceOpts);
        }

        return options;

    }

    /**
     * 修剪与默认值相等的属性
     * @param controlType 
     * @param sourceOpts 
     */
    static trimFor(controlType: typings.FormControlType, sourceOpts: typings.FormControlOptions) {

        const initOpts = FormControlOptionsService.buildFor(controlType);
        const opts = Object.assign({}, sourceOpts);

        if (initOpts) {
            Object.keys(initOpts).forEach(k => {
                if (initOpts[k] === opts[k]) {
                    delete opts[k];
                }
            });
        }

        return opts;
    }
    


}