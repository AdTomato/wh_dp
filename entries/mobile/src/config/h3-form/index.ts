

import {
  renderer
} from '@cloudpivot/form';

import * as flow from '@cloudpivot/flow';

import * as list from '@cloudpivot/list';

import { DefaultRelevanceFormService } from './relevance-form-service';
import { DefaultReverseRelevanceService } from './reverse-relevance-service';
import { DefaultFileService } from './file-service';
import { DingTalkLocationService } from './dingtalk-location-service';
import { DefaultUserService } from './user-service';

// import 'animate.css';

renderer.RelevanceFormControl.service = new DefaultRelevanceFormService();

renderer.ReverseRelevanceControl.service = new DefaultReverseRelevanceService();

renderer.UploadControl.service = new DefaultFileService();

renderer.FormLocationControl.service = new DingTalkLocationService();

renderer.StaffSelectorControl.service = new DefaultUserService();


renderer.RelevanceFormControl.loadFormStatus = () => {
  return flow.components.shared.WorkflowStatus;
}

renderer.RelevanceFormControl.loadQueryForm = () => {
  return list.components.mobile.SearchContent;
}

renderer.RelevanceFormControl.loadFormItem = () => {
  return list.components.mobile.newFormItem;
}
