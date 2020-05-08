
import { ContainerLike } from 'h3-forms';

import { RendererFormControl, FormControlType } from '../../schema';


export class FormProxyHandler implements ProxyHandler<ContainerLike>{

    get(target: ContainerLike, p: PropertyKey, receiver: any): any {
        if (typeof p !== 'symbol') {
            let child = target.findChild(p);
            let prop = (target as any)[p];
            // if (child) {
            //     if (child instanceof FormArray || child instanceof FormGroup) {
            //         child = new Proxy(child, new FormProxyHandler());
            //     }
            // }
            if (child && prop) {
                return [child, prop];
            } else if (child) {
                return child;
            } else if (prop) {
                return prop;
            }
        }
        return undefined;
    }

}


export class FormControlApiHandler implements ProxyHandler<RendererFormControl>{

    get(target: RendererFormControl, p: PropertyKey, receiver: any): any {

        if (typeof p === 'symbol') {
            return;
        }

        if (typeof p === 'string') {
            switch (p) {
                case 'type':
                case 'options':
                case 'key':
                case 'parentKey':
                    return target[p];
                
                // case 'format':
                //     return target.options[p];

                case 'items':
                    return target.options.options ? target.options.options.split(';') : [];

                case 'ctrl':
                    return target.controller;

                case 'edit':
                    return target.controller.readonly === false;
            }

            if (target.controller) {
                return (target.controller as any)[p];
            }
        }
    }

    set(target: RendererFormControl, p: PropertyKey, value: any, receiver: any) {
        
        // if (p === 'format') {
        //     if (target.type === FormControlType.Date || target.type === FormControlType.Number) {
        //         target.options.format = value;
        //         return true;
        //     }
        // }else 
        if (p === 'items') {
            
            if(value === null || value === undefined){
                return false;
            }

            if (target.type === FormControlType.Radio || target.type === FormControlType.Checkbox || target.type === FormControlType.Dropdown) {
                const opts = Array.isArray(value) ? value.join(';') : value + '';
                target.options.options = opts;
                return true;
            }
        }else if (p === 'edit') {
            if(typeof value !== "boolean" || !target.controller){
                return false;
            }
            // target.edit = value;
            target.controller.readonly = value === false;
            return true;
        }else if(target.controller){
            const ctrl = target.controller as any;

            // if(ctrl[p] === undefined){
            //     return false;
            // }

            ctrl[p] = value;
            return true;
        }
        
        return false;
    }

}
