
import {
    RendererFormControl,
    FormControlType,
    AddressOptions
} from "../typings";

import { BaseControl } from "./base-control";

import { FromAddressValueService } from '../services';


export abstract class AddressControl extends BaseControl<AddressOptions> {
    pca: any = {}

    val: any = {}

    get address(){
        // debugger
        return this.val.address || '';
    }

    setControl() {
        this.handleValueChange(this.ctrl.value);
    }

    handleValueChange(value: any) {
        if (value) {
            this.val = value;
        } else {
            this.val = {};
        }
        this.setPcaDate();
    }

    // created() {
    //     debugger
    //     this
    // }


    valueChange(val: any) {
        // debugger
        let value: any = {};

        const { address } = this.val;

        if (address) {
            value.address = address;
        }

        value = Object.assign(value, val);

        this.ctrl.value = value;

        this.setPcaDate();
    }

    setPcaDate() {
        if (this.ctrl.value) {
            this.pca = JSON.parse(JSON.stringify(this.ctrl.value));
            delete this.pca.address;
        } else {
            this.pca = {};
        }
    }

    get showEmpty() {
        return this.controlOpts.showEmpty === 'true';
    }

    get addressString() {
        // debugger
        if (!this.ctrl.value) return '';
        const { provinceName, cityName, districtName, address } = this.ctrl.value;
        const addressList: Array<any> = [];
        addressList.push(provinceName, cityName, districtName, address);
        const str = addressList.reduce((strItem: string, current: string) => {
            let currentStr: string = '';
            let beforeStr: String = '';
            if (current) {
                currentStr = current;
            }
            if (strItem) {
                beforeStr = strItem;
            }
            return `${beforeStr} ${currentStr}`
        });
        return str
    }

}