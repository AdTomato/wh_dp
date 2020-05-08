import {FormControlType} from '@cloudpivot/form/schema';

import {buildControlOptions} from '../../src/components/apps/form-design/typings/control-factory';
import { utils } from '@cloudpivot/common';
import axios from "axios";



export const TemplateBPMType:{ [key:string]:number } = {
    /**
     * 标签
     */
    'a-label' : 0,

    /**
     * 单文本
     */
    'a-text' : 1,
    /**
     * 长文本
     */
    'a-textarea' : 2,

    /**
     * 日期
     */
    'a-date' : 3,

    /**
     * 数值
     */
    'a-number' : 4,

    /**
     * 单选
     */
    'a-radio' : 5,

    /**
     * 复选
     */
    'a-checkbox' : 6,

    /**
     * 下拉
     */
    'a-dropdown' : 7,

    /**
     * 逻辑
     */
    'a-logic' : 8,

    /**
     * 附件
     */
    'a-attachment' : 9,

    /**
     * 图片
     */
    'a-image' : 10,

    /**
     * 位置
     */
    'a-location' : 11,

    /**
     * 地址
     */
    'a-address' : 14,

    /**
     * 签名
     */
    'a-signature' : 15,

    /**
     * 人员单选
     */
    'a-user-selector' : 50,

    /**
     * 人员多选
     */
    'a-user-multi-selector' : 51,

    /**
     * 部门单选
     */
    'a-departmentselector' : 60,

    /**
     * 部门多选
     */
    'a-departmentmultiselector' : 61,

    /**
     * 审批意见
     */
    'a-comment' : 70,

    /**
     * 关联表单
     */
    'a-association-form' : 80,

    /**
     * 反向关联
     */
    'a-reverserelevance' : 90,

    /**
     * 系统-流水号
     */
    'a-sequence-no' : 100,

    /**
     * 系统-创建人
     */
    'a-create-by' : 101,

    /**
     * 系统-创建人部门
     */
    'a-create-by-org' : 102,

    /**
     * 系统-修改人
     */
    'a-modify-b' : 103,

    /**
     * 系统-创建时间
     */
    'a-created-time' : 104,

    /**
     * 系统-修改时间
     */
    'a-modified-time' : 105,

    /**
     * 系统-拥有者
     */
    'a-owner' : 106,

    /**
     * 布局-分组标题
     */
    'a-group-title' : 200,

    /**
     * 子表
     */
    'a-sheet' : 201,

    /**
     * 描述说明
     */
    'a-description' : 202,

    /**
     * 表单标题
     */
    'a-title' : 203,

    /**
     * 子表统计
     */
    'a-total' : 300
};
/**
 * 脚本接口
 */
interface TemplateScripts{

    [key: string]:Function[]

}
/**
 * 模板配置接口
 */
export interface TemplateOptions {
    //API地址
    controller?: string;
    //toolbar配置项
    toolbar?: any[];
    //模板
    template?:TemplateControl[];
    //自定义事件
    customScript?: TemplateScripts;
    // 脚本
    scripts?: any[];
    // 样式
    styles?: any[];
}
/**
 * 模板输出接口
 */
export interface TemplateControl {
    //控件ID
    id?:any;
    //节点名称
    nodeName?:string;
    //控件name
    name?:string;
    //控件class
    class?:string;
    //控件style
    style?:string;
    //控件HTML类型
    type?: string;
    //控件BPM类型
    BPMType?: FormControlType;
    BPMOptions?: any;
    //控件默认值
    value?: string;
    //控件绑定表单数据项的key
    model?:string;
    //控件子组件
    children?: TemplateControl[];
}

/**
 * 模板事件处理
 */
export class TemplateEventHandle {
    //事件堆栈
    tsList :TemplateScripts = {};

    /**
     * 事件钩子
     * @param evnetType 钩子类型
     * @param fun       钩子的回调函数
     * @param cover     是否要覆盖已有的钩子函数
     */
    on (evnetType:string, fun: Function, cover:boolean) :void{
        if (cover) {
            this.tsList[evnetType] = [fun];
        }else{
            this.tsList[evnetType] ? this.tsList[evnetType].push(fun) : this.tsList[evnetType] =[fun];
        }

    }
}

/**
 * 模板处理
 */
export class TemplateHandle {
    options: TemplateOptions = {};
    callback:Function;
    eventHandle = new TemplateEventHandle();
    templateValidate = new TemplateValidate(document.body, this.eventHandle);

    rootTemplateValidate: any = {
        controller: '',
        toolbar: [],
        templateHeader: [],
        templateFooter: [],
        styles: [],
        scripts: [],
        errorMsg: []
    };
    constructor (callback: Function) {
        this.callback = callback;
       this.init();
    }
    init () {
        //判断是否需要啊加载
        if(!!this.templateValidate.rootTemplate){
            axios.get(this.templateValidate.rootTemplate,{}).then((res:any)=>{
                this.rootTemplateHandle(res.data);
                this.templateMerge();
            }).catch((err: any) => {
                console.log(err);
            });
        }else{
            this.templateMerge();
        }
    }

    /**
     * 全局模板处理
     */
    rootTemplateHandle (res: any) {
        let rootTemplateNode = document.createElement('div');
        rootTemplateNode.innerHTML = res;
        this.rootTemplateValidate = new TemplateValidate(rootTemplateNode, this.eventHandle, '全局');
    }
    /**
     *  模板合并
     */
    templateMerge() :void{
        let template = this.templateValidate;
        let rootTemplate = this.rootTemplateValidate;
        if(template.errorMsg.length || rootTemplate.errorMsg && rootTemplate.errorMsg.length){
            console.log(template.errorMsg,rootTemplate.errorMsg);
            alert([...rootTemplate.errorMsg,...template.errorMsg].join('\r\n'));
        }
        else{
            //检验JS是否有效后清除一次;
            this.eventHandle.tsList = {};
            rootTemplate.customScript && rootTemplate.customScript(this.eventHandle);
            template.customScript(this.eventHandle);
            this.options.controller = template.controller ? template.controller : (rootTemplate.controller ? rootTemplate.controller : null);
            this.options.toolbar = [...template.toolbar, ...rootTemplate.toolbar];
            this.options.template = [...rootTemplate.templateHeader,...template.template,...rootTemplate.templateFooter] as any;
            this.options.customScript = this.eventHandle.tsList as any;
            this.options.scripts = [ ...rootTemplate.scripts, ...template.scripts];
            this.options.styles = [ ...rootTemplate.styles, ...template.styles];
            this.htmlHandle();
            this.callback(new Template(this.options).templateOptions);
        }
    }
    /**
     * HTML处理
     */
    htmlHandle () {
        let oStyle:any = document.querySelector('style,link');
        this.rootTemplateValidate.styles.forEach( (style:any) => {
            if(oStyle){
                oStyle.parentElement.insertBefore(style, oStyle);
            }else{
                if(document.head){
                    document.head.appendChild(style);
                }
            }
        });
        let oScript:any = document.querySelector('script');
        this.rootTemplateValidate.scripts.forEach( (script:any) => {
            if(oScript){
                oScript.parentElement.insertBefore(script, oScript);
            }else{
                if(script){
                    document.body.appendChild(script);
                }
            }
        });
        document.body.querySelectorAll('style,link').forEach( (style) => {
            if(document.head){
                document.head.appendChild(style);
            }
        });
        document.body.childNodes.forEach((node:any) => {
            if(node.nodeType == 8 || (node.tagName && (node.tagName !== 'SCRIPT'  || node.id == 'customScript'))){
                document.body.removeChild(node);
            }
        });
    }

}


/**
 * 模板数据有效性校验类
 */
export  class TemplateValidate{
    templateName:string;
    $ele: Element;
    rootTemplate:string = '';
    controller:string = '';
    toolbar: object[] = [];
    templateHeader:TemplateControl[] = [];
    template:TemplateControl[] = [];
    templateFooter:TemplateControl[] = [];
    templateEventHandle:TemplateEventHandle;
    customScript:Function = ()=>{};
    errorMsgType:any;
    styles:any = [];
    scripts:any = [];
    errorMsg:string[] = [];


    constructor(ele:Element,templateEventHandle:TemplateEventHandle,templateName:string = '自定义'){
        this.$ele = ele;
        this.templateName = templateName;
        this.templateEventHandle = templateEventHandle;
        this.errorMsgType = {
            2:this.templateName + '模板 加载全局模板 "load-template" 参数不存在或者格式不正确',
            3:this.templateName + '模板 Toolbar配置 Action 参数不存在或者格式不正确',
            4:this.templateName + '模板 配置API地址 "api-url" 参数不存在或者格式不正确',
            5:this.templateName + '模板 自定义脚本格式不正确'
        };
        this.init();
    }

    private init () {
        let resSet = [
            this.rootTemplateHandle(),
            this.controllerHandle(),
            this.toolbarHandle(),
            this.templateHandle(),
            this.customScriptHandle()
        ].filter((num:number) => num > 0);

        if(resSet.length > 0){
            resSet.forEach( (num)=> {
                this.errorMsg.push(this.errorMsgType[num]);
            })
        }
        this.styles = this.$ele.querySelectorAll('style,link');
        this.scripts = this.$ele.querySelectorAll('script:not(#customScript):not(.templateScript)');
    }

    /**
     * root模板加载验证
     */
    private rootTemplateHandle () :number{
        let res:number = 0;
        let lootTemplate:string = '';
        let $rootTemplate = this.$ele.querySelector('#rootTemplate');
        if ($rootTemplate) {
          lootTemplate = $rootTemplate.getAttribute('load-template') as string;
          if (!utils.RegexpValidate('URL', lootTemplate, true)) {
            res = 2;
          }
        }
        this.rootTemplate = lootTemplate;
        return res;
    }

    /**
     * controller验证
     */
    private controllerHandle () :number{
        let res:number = 0;
        let $controller = this.$ele.querySelector('#controller');
        if ($controller) {
            let apiUrl:any = $controller.getAttribute('api-url');
            if (utils.RegexpValidate('URL', apiUrl,true)) {
                this.controller =  apiUrl;
            }
            else{
                res = 4;
            }
        }
        return res;
    }

    /**
     * toolbar验证
     */
    private toolbarHandle () :number {
        let res:number = 0;
        let data: object[] = [];
        let $toolbar = this.$ele.querySelector('#toolbar');
        if($toolbar){
            let actions = $toolbar.querySelectorAll('action');
            actions.forEach((action:Element):void => {
                let text = action.getAttribute('text');
                let code =action.getAttribute('code');
                if(!!text && !!code){
                    data.push({ text, code });
                }else{
                    res = 3;

                }
            })
        }
        this.toolbar = data;
        return res;
    }

    /**
     * template验证
     */
    private templateHandle () :number {
        let res = 0;
        let $template = this.$ele.querySelector('#template');
        let $templateHeader = this.$ele.querySelector('#templateHeader');
        let $templateFooter = this.$ele.querySelector('#templateFooter');
        if ($templateHeader) {
            this.templateHeader = (<TemplateControl[]>this.elementConvertJson($templateHeader).children);
        }
        if ($template) {
            this.template = (<TemplateControl[]>this.elementConvertJson($template).children);
        }
        if ($templateFooter) {
            this.templateFooter = (<TemplateControl[]>this.elementConvertJson($templateFooter).children);
        }
        return res;
    }

    /**
     * 自定义脚本验证
     */
    private customScriptHandle () :number {
        let res = 0;
        let $customScript = this.$ele.querySelector('#customScript');
        if($customScript && $customScript.innerHTML){
            try {
                this.customScript = eval($customScript.innerHTML);
                this.customScript(this.templateEventHandle);
            }catch (e) {
                res = 5;
            }
        }
        return res;
    }

    /**
     * 处理HTML元素转JSON数据包
     * @param element
     * @param templateControl
     */
    private elementConvertJson (element:any,templateControl:TemplateControl = {}) :TemplateControl{
        if(element.nodeType == 1){
            let tagName:string = element.tagName.toLocaleLowerCase();
            let BPMOptions:any = {};
            let BPMType = TemplateBPMType[tagName];
            if(TemplateBPMType[tagName]){
                BPMOptions = this.resolveElementAttribute(element,BPMType);
            }
            templateControl = {
                id:element.id,
                nodeName: tagName,
                //控件name
                name: element.getAttribute('name'),
                //控件class
                class: element.className,
                //控件style
                style: element.getAttribute('style'),
                //控件BPM类型
                BPMType: BPMType,
                BPMOptions:BPMOptions,
                //控件默认值
                value: element.value,
                //控件绑定表单数值
                model:element.getAttribute('build-data')
            }
            if(element.childNodes && element.childNodes.length > 0){
                if(tagName === 'a-sheet'){
                 this.sheetHandle(element, templateControl);
                }
                else{
                    const children:TemplateControl[] = templateControl.children = [];
                    element.childNodes.forEach((node:Node)=> {
                        let templateControlOther = this.elementConvertJson(node);
                      Object.keys(templateControlOther).length > 0 &&  children.push(templateControlOther);
                    });
                }
            }
        }
        else{
            // 过滤空字符串和回车换行符
            if(!!!element.data.replace(/(^\s*)|(\s*$)/g, '')){
                return templateControl;
            }
            templateControl = {
                id:element.id,
                nodeName: '#text',
                value: element.nodeType == 8 ? '<!--'+element.data+'-->': element.data,
            }
        }
        return templateControl;
    }

  /**
   * 对于字表的特殊处理
   * @param element
   * @param templateControl
   */
  private sheetHandle(element: any, templateControl: any) {
      let columns: any[] = (templateControl.BPMOptions as any).columns = [];
      let statistics: any[] = (templateControl.BPMOptions as any).statistics = [];
      const $columns = element.querySelector('a-columns');
      const $totals = element.querySelectorAll('a-totals a-total');
      if ($columns && $columns.children.length) {
          Array.prototype.slice.call($columns.children).forEach((elem: any) => {
              columns.push(this.resolveElementAttribute(elem, TemplateBPMType[elem.tagName.toLocaleLowerCase()], templateControl.BPMOptions.key));
          });
      }
      if ($totals && $totals.length) {
          $totals.forEach((elem: any) => {
              statistics.push(this.resolveElementAttribute(elem, TemplateBPMType[elem.tagName.toLocaleLowerCase()], templateControl.BPMOptions.key));
          });
      }
  }

    /**
     * 解析元素属性
     * @param element
     * @param BPMType
     * @param parentKey
     */
    private resolveElementAttribute (element:Element, BPMType: number,parentKey:any = null) :any{
        let options:any = {};
        if(element.attributes.length){
            let attributes = element.attributes;
            for(let arr in attributes){
                if(!attributes[arr].specified) continue;
                this.createElementObject(attributes[arr].name,attributes[arr].value,options);
            }
        }
      options.type = BPMType;
        if(parentKey){
          options.parentkey = parentKey;
        }
      try {
        options.options = Object.assign(buildControlOptions(BPMType),options.options)
      }
      catch (e) {
      }
        return options;
    }

    /**
     * 创建元素的数据对象
     * @param attrName
     * @param val
     * @param options
     */
    private createElementObject (attrName: string ,val: any, options: any) {
        try {
            val = JSON.parse(JSON.stringify(val).replace(/^["]|\\|("$)/g,''));
        }catch (e) {
        }
        val = val == 'null' || val == 'undefined'? null : val;
        if(attrName.indexOf('data-') > -1){
            options.options = options.options ? options.options : {};
            options.options[this.convertCase(attrName.replace('data-',''))] = val;
        }else{
            options[this.convertCase(attrName)] = val;
        }
    }

    /**
     * 配置项-W转换驼峰命名法
     * @param key
     */
    private convertCase(key: string) {
        return key.replace(/(-[A-Z])/gi, ($1) => $1.replace('-','').toLocaleUpperCase());
    };
}

/**
 * 模板类
 */
export class Template {
    templateOptions: TemplateOptions;

    constructor (options: TemplateOptions) {
        this.templateOptions = options;
    }
    /**
     * Controller配置项
     */
    getController () : string {
        return this.templateOptions.controller || '';
    }
    /**
     * toolbar配置项
     */
    getToolbar () :any[] {
        return this.templateOptions.toolbar || [];
    }

    /**
     * 获取用户自定方法
     */
    getCustomScript() :any{
        return this.templateOptions.customScript;
    }

    /**
     * 获取模板
     * return 模板Array对象
     */
    getTemplate () :TemplateControl[]{
        return this.templateOptions.template || [];
    }
//
}

