

import {
  renderer
} from '@cloudpivot/form';



import { DefaultFileService } from './file-service';
import { DefaultUserService } from './user-service';
import { DefaultLocationService } from './location-service';
import { DefaultReverseRelevanceService } from './reverse-relevance-service';
import { DefaultRelevanceFormService } from './relevance-form-service';



let inited = false;

if (!inited === true) {

  inited = true;

  renderer.RelevanceFormControl.loadListSelector = () => {
    return require('@/components/apps/list-preview/list-selector.vue').default;
  }

  renderer.UploadControl.service = new DefaultFileService();

  renderer.StaffSelectorControl.service = new DefaultUserService();

  renderer.FormLocationControl.service = new DefaultLocationService();
  
  renderer.ReverseRelevanceControl.service = new DefaultReverseRelevanceService();
  
  renderer.RelevanceFormControl.service = new DefaultRelevanceFormService();
  

}