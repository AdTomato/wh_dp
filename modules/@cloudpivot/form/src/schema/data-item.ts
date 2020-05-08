

import { DataItemType } from './data-item-type';
import { FormControlType } from './form-control-type';

// import * as SystemCodes from './system-data-item-codes';


export interface DataItemLike extends SheetDataItemLike {

    code: string

    propertyType: DataItemType

}

// export interface DataItem extends SheetDataItemLike {
//     code: string

//     propertyType: DataItemType
// }

export interface SheetDataItemLike {

    subSchema?: {

        properties: DataItemLike[]

    }
}


export function mapToControlType(itemType: DataItemType) {

    let type = FormControlType.Label;
  
    switch (itemType) {
      case DataItemType.Attachment:
        type = FormControlType.Attachment;
        break;
      case DataItemType.ApprovalOpinion:
        type = FormControlType.ApprovalOpinion;
        break;
      case DataItemType.ShortText:
        type = FormControlType.Text;
        break;
      case DataItemType.LongText:
        type = FormControlType.Textarea;
        break;
      case DataItemType.Logic:
        type = FormControlType.Logic;
        break;
      case DataItemType.Date:
        type = FormControlType.Date;
        break;
      case DataItemType.Number:
        type = FormControlType.Number;
        break;
      case DataItemType.RelevanceForm:
        type = FormControlType.RelevanceForm;
        break;
      case DataItemType.Sheet:
        type = FormControlType.Sheet;
        break;
      case DataItemType.StaffSelector:
        type = FormControlType.StaffSelector;
        break;
      case DataItemType.Address:
        type = FormControlType.Address;
        break;
    }
  
    return type;
  }