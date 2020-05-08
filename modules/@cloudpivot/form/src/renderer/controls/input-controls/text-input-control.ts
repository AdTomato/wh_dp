
import * as typings from '../../typings';

import { InputControl } from './input-control';

import { TextAreaType } from '../../../../schema';

export abstract class TextInputControl extends InputControl<typings.TextOptions> {

    val = ''

    get isTextarea() {
        return this.control.type === typings.FormControlType.Textarea;
    }

    get rows() {
        if (this.control.parentKey) {
            return { minRows: 1, maxRows: 5 };
        }
        return { minRows: 5, maxRows: 5 };
    }

    get maxLength() {
        if (this.controlOpts.maxLength) {
            return Number(this.controlOpts.maxLength);
        }
        return this.isTextarea ? 2000 : 200;
    }

    get length() {
        return this.countLengthOf(this.ctrl.value);
    }

    get isLangText() {
        // debugger;
        if (!this.control.options.textAreaType) {
            return true;
        }
		return this.control.options.textAreaType === TextAreaType.LongText;
	}

    setControl(){
        this.handleValueChange(this.ctrl.value);
    }

    handleValueChange(value: any): void {
        this.val = value ? value : '';
    }

}