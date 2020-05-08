
/**
 * 表单生命周期钩子名称
 */
export enum LifecycleHookNames {

    OnLoad = 'onLoad',

    OnRendered = 'onRendered',

    OnValidate = 'onValidate',

    OnPreAction = 'onPreAction',

    OnCustomAction = 'onCustomAction',

    OnActionDone = 'onActionDone'
}


export interface LifecycleHooks {

    controller?: string

    [LifecycleHookNames.OnLoad]?: Function[]

    [LifecycleHookNames.OnRendered]?: Function[]

    [LifecycleHookNames.OnValidate]?: Function[]

    [LifecycleHookNames.OnPreAction]?: Function[]

    [LifecycleHookNames.OnCustomAction]?: Function[]

    [LifecycleHookNames.OnActionDone]?: Function[]

}

export function parseScript(script: string) {

    const map: any = {};

    const form: any = {
        on(type: string, fn: Function) {
            if (!map[type]) {
                map[type] = [];
            }
            map[type].push(fn);
        }
    };

    try {
        eval(script)(form);
    } catch (error) {
        console.log('表单生命周期代码解析错误');
        throw error;
    }

    map.controller = form.controller;

    return map;
}
