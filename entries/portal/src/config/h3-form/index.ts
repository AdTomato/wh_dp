
import {
  renderer
} from '@cloudpivot/form';

import * as applicationList from '@cloudpivot/list';

import { DefaultRelevanceFormService } from './relevance-form-service';
import { DefaultReverseRelevanceService } from './reverse-relevance-service';
import { DefaultFileService } from './file-service';
import { DefaultUserService } from './user-service';
import { DefaultLocationService } from './location-service';


let inited = false;

if(!inited === true){
  
  inited = true;

  renderer.RelevanceFormControl.loadListSelector = () => {
    return applicationList.components.pc.ListSelector;
  }
  
  renderer.RelevanceFormControl.service = new DefaultRelevanceFormService();
  
  renderer.ReverseRelevanceControl.service = new DefaultReverseRelevanceService();
  
  renderer.UploadControl.service = new DefaultFileService();
  
  renderer.StaffSelectorControl.service = new DefaultUserService();
  
  renderer.FormLocationControl.service = new DefaultLocationService();
  
}

