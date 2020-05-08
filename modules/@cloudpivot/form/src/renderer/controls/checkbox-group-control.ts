
import { Subscription } from 'rxjs';

import * as typings from '../typings';

import { SelectControl } from './select-control';

import { Watch } from 'vue-property-decorator';


export interface CheckboxOption {

    label: string

    value: string

    disabled?: boolean

    onChange?: Function

}


export abstract class CheckboxGroupControl extends SelectControl<typings.CheckboxOptions> {

    checkboxOptions: CheckboxOption[] = [];

    get isRadio() {
        return this.control.type === typings.FormControlType.Radio;
    }

    get isVertical() {
        return this.controlOpts.direction === 'vertical';
    }

    @Watch('items')
    onItemsChange() {
        this.options = this.initOptions(this.isRadio);
        this.checkboxOptions = this.options.map(x => ({
            label: x,
            value: x,
            disabled: false
        }));
        this.resetCheckboxOptionDisabled();
    }

    setControl() {

        this.handleValueChange(this.ctrl.value);

        this.onItemsChange();

    }

    handleValueChange(value: any): void {
        this.val = super.convertValue(!this.isRadio, value);
    }

    resetCheckboxOptionDisabled() {
        if (this.isRadio) {
            return;
        }

        const values = this.val;

        const len = Array.isArray(values) ? this.countLengthOf(values.join(';')) : 0;

        this.options
            .map((k, i) => {
                if (!this.checkboxOptions[i]) {
                    this.checkboxOptions[i] = {
                        label: k,
                        value: k,
                        disabled: false
                    };
                }
                if (values.indexOf(k) > -1) {
                    return;
                }
                let l = this.countLengthOf(k) + 1;
                this.checkboxOptions[i].disabled = len + l > 200;
            })
    }

    // destroyed() {
    //     super.destroyed();
    // }

}