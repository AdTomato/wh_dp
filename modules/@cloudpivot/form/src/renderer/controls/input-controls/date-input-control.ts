
import * as typings from '../../typings';

import { InputControl } from './input-control';
import { DateControl } from 'h3-forms';

export abstract class DateInputControl extends InputControl<typings.DateOptions> {

  get showTime() {
    return this.controlOpts.format.toUpperCase() !== 'YYYY-MM-DD';
  }

  get showMonth() {
    return this.controlOpts.format.toUpperCase() === 'YYYY-MM';
  }

  get format() {
    let format = this.controlOpts.format;
    if(!format){
      return 'YYYY-MM-DD';
    }
    const idx = format.indexOf(' ');
    if (idx === -1) {
      return format.toUpperCase();
    }
    format = format.substr(0, idx).toUpperCase() + format.substr(idx);
    return format;
  }

  get dateCtrl(){
    return this.ctrl as DateControl;
  }

  // get text(){
  //   if(this.ctrl.value){
  //     return dateFormatter(this.ctrl.value, this.format);
  //   }
  // }

}