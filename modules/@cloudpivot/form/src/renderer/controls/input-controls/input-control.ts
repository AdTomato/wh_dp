
import * as typings from '../../typings';

import { BaseControl } from '../base-control';

export abstract class InputControl<T extends typings.InputControlOptions> extends BaseControl<T> {

    // get placeholder() {
    //     return (this.controlOpts as any).placeholder || '';
    // }

}