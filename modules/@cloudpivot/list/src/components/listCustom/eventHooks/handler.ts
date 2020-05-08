

// 导入类型; 每个版本的 scriptString 和 scriptObject 要求都不同, 具体的校验交给版本子类
import {
  constructorOptions,
  subClassLoaderOptions,
  HookOption,
  Actions,
} from './typings'


/**
 * 类定义
 */
export default class ListEventHooksHandler {
  /**
   * 基础变量
   */
  private static documentUrl           = 'https://demo.internal.cloudpivot.cn/docs/#/frontend/list/custom';
  private static versionSupportingList = [
    { version:'1.0', as:'1.0' },
    { version:'1.1', as:'1.1' },
  ];
  readonly vm:object;                         // vue 实例
  readonly scription:any;                     // 自定义脚本对象
  protected errorPrefix:string = "ListEventHooksHandler Error";

  // hooks的默认设置, 传入的数据将会与默认设置合并
  readonly hooksOption:HookOption[] = [
    { name:'onPreLoad',      params:[] },
    { name:'onLoad',         params:[] },
    { name:'onRendered',     params:[] },
    { name:'onPreAction',    params:[], isActionEvent:true },
    { name:'onCustomAction', params:[], isActionEvent:true },
    { name:'onActionDone',   params:[], isActionEvent:true },
  ];


  /* =====================================  初始化  ==================================== */


  /**
   * 构造器 * 入口
   * @param options required! 构造参数
   */
  constructor(options:constructorOptions) {
    let { vm, scription } = options;
    let { hooksOption=[] } = options;

    this.vm = vm;
    this.scription = scription;

    // 将钩子设置合并, 传入的设置比默认设置权限更高
    // NOTE:不过目前以预设事件为主, 所以仅遍历 this.hooksOption; 如果要支持自定义事件, 还需遍历自定义 hooksOption 做比较
    this.hooksOption = this.hooksOption.map(h1=>{
      return { ...h1, ...(hooksOption.find(h2=>(h2 as any).name===h1.name) as any) };
    });

    // extensions 主体绑定(深度/递归)
    this.deepExtensionsEventBinding(
      scription,
      typeof(scription) && typeof(scription.extensions)? scription.extensions: {}
    );


  }

  /**
   * 初始化 extensions 函数主体绑定, 使其内部函数都指向 scription
   * @param scription 脚本对象
   */
  protected deepExtensionsEventBinding(top:any,sup:any) {
    let item, key;
    for(key in sup) {
      item = sup[key];
      if ( typeof(item) === 'function' ) {
        sup[key] = item.bind(top);
      }
      else if ( String(item)==='[object Object]' ) {
        this.deepExtensionsEventBinding(top,item);
      }
    }
  }


  /* =====================================  公开函数  ==================================== */


  /**
   * 执行事件
   * @param event   required!  事件名: onLoad/onRendered/...等
   * @param action  optional!  动作名: 仅在 HookOption.isActionEvent===true 时有效
   * @return Promise
   */
  exec(event, action?:Actions, result?:any) {
    let vm          = this.vm;
    let scription   = this.scription;
    let eventFunc   = scription.hooks[event];
    let eventOption = this.hooksOption.find(h=>h.name===event) as any;


    // 数据校验: 钩子是否存在
    if (
      typeof(eventFunc)!=='function' ||
      typeof(eventOption)!=='object'
    ) {
      throw `ListEventHooksHandler Error: hook "${event}" not found!`;
    }

    // 事件校验: 按钮事件需要传递按钮对象(type:Actions)
    if ( eventOption.isActionEvent && !action ) {
      throw `ListEventHooksHandler Error: actionEvents require an action parameter!`;
    }

    let eventFuncString = String(eventFunc);

    // 返回执行的封装, 抽离是为了更好地继承和重写
    return this.execPackaging( {eventOption,action,vm,event,result,eventFuncString,scription} )
  }

  /**
   * 销毁, 预留
   */
  destroy() {
  }


  /* =====================================  函数  ==================================== */


  protected execPackaging({eventOption,action,vm,event,result,eventFuncString,scription}) {
    return new Promise((resolve,reject)=>{
      let args = eventOption.isActionEvent? [action]: [];
      try {
        args = args.concat((eventOption.params).map(paramItem=>(
          paramItem==='$vm'? vm: this.parseParams(paramItem))
        ));
        // actionDone 会额外注入 result 参数
        if ( event==='onActionDone' ) { args.push(result) }

        // 执行
        resolve(
          eval(
            `(function(vm, opts, handler, axios, config) {
              return (${eventFuncString}).apply(opts, args)
            })`
          )(vm, scription, this, vm.axios, (window as any).config)
        );
      }
      // 异常处理, 加文字标识, 以便定位问题
      catch(err) {
        reject(`ListEventHooksHandler Execution <${event}> Error => ( ${err.toString()} )`);
      }
    })
  }


  /* =====================================  静态函数  ==================================== */


  private static loadedVersionCache    = {};
  /**
   * 解析脚本对象(可用以基本(通用)脚本字符串可用性检测, 在数据提交前防止提交错误数据)
   * @param scriptString 脚本字符串
   * @return 脚本对象
   */
  public static parseScriptString(scriptString:string) {
    if ( !this.isScripStringValid(scriptString) ) {
      throw `ListEventHooksHandler Error: scription string invalid!`;
    }

    // 针对初版做特殊的报错, 以便让前端做静默处理
    if ( /^\(?function\s*\(/.test(scriptString.trim()) ) {
      throw 'first version scription uncompatible!';
    }

    // 脚本对象; 如果解析错误或者数据不合法, 报 unavailable;
    let scription;
    try {
      // 已存数据在ie上的兼容问题
      var reg = /doSomething\s*\(([^\)]*)\)\s*\{/;
      if ( reg.test(scriptString) ) {
        scriptString = scriptString.replace(reg, 'doSomething: function('+RegExp.$1+') {');
      }
      scription = eval(`(${scriptString})`);
    } catch(err) {
      console.error( `Scription ERROR: \n${err}` );
      throw `ListEventHooksHandler Error: scription string unavailable!`;
    }

    // (通用)脚本对象可用性检测
    this.isScriptObjectAvailabile(scription);
    let version = scription.options.version;
    if ( version!=='1.0' ) {
      let versionClass = this.loadSupportingVersionClass(version);
      // console.log( '_____111' )
      // console.log( versionClass.isScriptObjectAvailabile );
      versionClass.isScriptObjectAvailabile && versionClass.isScriptObjectAvailabile(scription);
    }

    return scription;
  }
  /**
   * 获取支持的版本类(为了方便获取特定版本类的静态数据, 比如版本logs, 特定校验方法等)
   * @param version
   */
  public static loadSupportingVersionClass(clientVersion) {
    let handlerVersion = (this.versionSupportingList.find(v=>v.version===clientVersion) || {as:'undefined'}).as;

    // 如果版本不存在(客户传错), 报 not exist;
    if ( !handlerVersion ) {
      throw `ListEventHooksHandler Error: version-${handlerVersion} not exist!`;
    }

    // 如果模块找不到(程序解析错), 报 not found;
    let SubClass;
    try {
      SubClass = this.loadedVersionCache[handlerVersion] ||
        (this.loadedVersionCache[handlerVersion] = require(`./versions/${handlerVersion}`).default) // 动态加载
    } catch(err) {
      throw `ListEventHooksHandler Error: version-${clientVersion} not found!`;
    }

    return SubClass;
  }
  /**
   * 获取所支持版本的实例
   * @param version
   */
  public static loadSupportingVersionHandler(options:subClassLoaderOptions) {
    // 脚本字符串; 如果字符串不可用, 报 invalid;
    let { scriptString } = options;
    let scription      = this.parseScriptString(scriptString);
    let clientVersion  = scription.options.version;
    let versionClass   = this.loadSupportingVersionClass(clientVersion);
    let versionHandler = new versionClass({...options, scription});

    // 子类自定义的校验.
    // TODO:DELAY: 某些错误可以通过 interface 定义来校验
    if (
      versionHandler.isScripStringValid &&
      !versionHandler.isScripStringValid(scriptString)
      ) throw `ListEventHooksHandler Error: scription string invalid!!`;



    if (
      versionHandler.isScriptObjectAvailabile &&
      !versionHandler.isScriptObjectAvailabile(scription)
      ) throw `ListEventHooksHandler Error: scription string invalid!!!`;


    // 返回实例
    return versionHandler;
  }


  /* =====================================  脚本字符串和脚本对象校验  ==================================== */


  // TODO: 通用脚本文本校验
  public static isScripStringValid(str:string):boolean {
    return !!str.trim().length;
  }
  // TODO: 通用脚本对象校验
  public static isScriptObjectAvailabile(obj:any):boolean {
    if ( !obj ) throw 'ListEventHooksHandler Error: scription definition should be an object!'
    if ( !obj.options ) throw 'ListEventHooksHandler Error: scription definition missing options!'
    if ( !obj.options.version ) throw 'ListEventHooksHandler Error: scription definition missing options.version!'
    if ( typeof(obj.options.version)!=='string' ) throw 'ListEventHooksHandler Error: scription definition options.version should be string!'
    if ( !this.versionSupportingList.find(s=>s.version===obj.options.version) ) throw `ListEventHooksHandler Error: scription definition version:${obj.options.version} not found!`;

    return true;
  }


  /* =====================================  其他工具函数  ==================================== */

  // 返回统一格式的报错
  protected error(str) {
    throw `ListEventHooksHandler Error:${str}`;
  }


  /**
   * 根据参数字段, 获取vm的数据;
   * @param paramString required! 参数名|参数名链条: 如'data'、'data.variables', 相应获取的是 vm.data & vm.data.variables 的值
   * WONDER: 注入数据的目的是什么? 需要联动? 或者仅展示? 如果仅展示, 需要对引用类型进行深拷贝;
   */
  protected parseParams(paramString:string):any {
    return paramString.split('.').reduce(
      (map,paramItemKey)=>map[paramItemKey] as any,
      this.vm
    );
  }
}
