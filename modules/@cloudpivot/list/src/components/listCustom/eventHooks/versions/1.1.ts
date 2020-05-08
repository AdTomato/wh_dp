


import ListEventHooksHandler from './1.0';

import {
  constructorOptions,
  subClassLoaderOptions,
  HookOption,
  Actions,
  cancelParameter,


  PageConfig,
  PageConfigApis,
  PageConfigApiItem,
} from '../typings'




export default class SubHandler_v_1_1 extends  ListEventHooksHandler {
  version:'1.1';
  // 版本日志
  public static versionLogs = {
    zh: {
      hooks: `<!--
    版本 1.1 更新日志 (2019/12/24)
    新增 pageConfig.apis 的支持
    详情请查阅文档: https://demo.internal.cloudpivot.cn/docs/#/frontend/list/custom?id=%E6%9B%BF%E6%8D%A2%E9%A1%B5%E9%9D%A2%E6%8E%A5%E5%8F%A3\n-->\n` +
    ListEventHooksHandler.versionLogs.zh.hooks,

      fields : `<!--
      重要字段声明:
      @隐藏字段 vm     所有事件钩子和自定义接口函数内引用, 指向页面 Vue 实例
      @隐藏字段 axios  所有事件钩子和自定义接口函数内引用, 第三方 ajax 库
      @隐藏字段 config 所有事件钩子和自定义接口函数内引用, 项目环境参数配置对象，源自项目 public/config.js
      @参数字段 data   指向当前视图页数据, onPreAction 事件外所有的钩子都包含
      @参数字段 action 按钮对象, 按钮数据格式为: { actionCode:'add', name:'新增', ... }
      @参数字段 result onActionDone 事件独有, 指向事件处理的结果, 由按钮执行返回 (预置按钮逻辑 | 自定义按钮逻辑)\n-->`,
      template: `\n({
    // 脚本配置: 在对配置修改之前, 请务必认真查阅相关文档
    options: {
        version:'1.1'
    },
    // 修改页面配置
    pageConfig: {
      // 修改视图数据接口
      apis: {
        listData: function(params) {  }
      }
    },
    // 脚本扩展, 可自行添加变量或函数, 以供事件钩子或自定义模板(customTemplate)调用
    extensions: {
        greeting:'hey!',
        doSomething: function() {
            console.log( this.extensions.greeting );
        }
    },
    // 事件钩子定义
    hooks: {
        // 视图数据加载前
        onPreLoad: function() {
          this.extensions.doSomething(vm);
        },
        // 视图数据加载后
        onLoad: function(data) {},
        // 视图数据渲染后
        onRendered: function(data) {},
        // 在所有按钮动作触发前, 可通过返回 false 阻拦后续按钮事件流程, 返回空或其他不阻拦
        onPreAction: function(action,data) {},
        // 自定义按钮执行逻辑
        onCustomAction: function(action,data) {},
        // 按钮事件触发完毕
        onActionDone: function(action,result) {}
    }
})\n`
    },
    en: {

    }
  }


  // 构造
  constructor(options:constructorOptions) {
    super(options);
    // console.log( this );
    return this;
  }

  /**
   * 销毁, 预留
   */
  destroy() {
  }

  public static modes:string[] = ['combine','replace'];

  defaultRequestOption:any = {
    silent:true
  }
  getApi(name:string) {
    let api;
    try {
      api = this.scription.pageConfig.apis[name];
    } catch(err) {
      api = null;
    }
    return api;
  }
  fetchApi(api:any, params) {
    // 如果传入的是字符串, 则取相应的接口数据
    if ( typeof(api)==='string' ) api = this.getApi(api);
    if ( !api || (typeof(api)!=='object'&&typeof(api)!=='function') ) throw 'pageConfig.api should be a function or an object';

    let { mode,request } = api;

    if ( typeof(api)==='function' ) {
      mode = 'combine';
      request = api;
    }
    // let { mode,request } = api;

    if ( !mode ) mode = 'combine';
    else if ( !SubHandler_v_1_1.modes.includes(mode) )
      throw `mode:"${mode}" is not allowed!`;
    if ( !request || typeof(request)!=='function' )
      throw `api.request should be a function`;

    return new Promise((resove,reject)=>{
      let { vm,scription } = this;
      let args = [ params ];
      try {
        // 执行
        resove(
          eval(
            `(function(vm, opts, handler, axios, config) {
              return (${request}).apply(opts, args)
            })`
          )(vm, scription, this, (vm as any).axios, (window as any).config)
        );
      }
      // 异常处理, 加文字标识, 以便定位问题
      catch(err) {
        reject(`ListEventHooksHandler Execution <${event}> Error => ( ${err.toString()} )`);
      }
    });
  }




  // 校验
  // isScripStringValid(str:any) {
  //   return true;
  // }
  public static isScriptObjectAvailabile(scription:any):boolean {
    // 调用父级校验
    ListEventHooksHandler.isScriptObjectAvailabile(scription);

    let pageConfig = scription.pageConfig || {};

    // 校验 api
    if ( !pageConfig ) return;
    if ( typeof(pageConfig)==='object' ) {
      let apiConfig = pageConfig.apis;
      if ( apiConfig ) {
        // 接口必须是对象
        if ( typeof(apiConfig)!=='object' ) throw `ListEventHooksHandler Error: pageConfig should be an object`;
        let apiKeys = Object.keys(apiConfig);
        apiKeys.some((key:string)=>{
          let api:any = apiConfig[key];
          let modes = ['combine','replace'];
          if ( !api || (typeof(api)!=='object'&&typeof(api)!=='function') ) throw `ListEventHooksHandler Error: pageConfig api should be a function or an object`;
          // 在作为对象的情况下:
          if ( typeof(api)==='object' ) {
            // 可以没有mode, 默认取 combine; 如果有必须是允许的值之一
            if ( api.mode && !modes.includes(api.mode) ) throw `ListEventHooksHandler Error: pageConfig api.mode supports only [${modes}]`;
            // 必须有 request 函数
            if ( !api.request ) throw `ListEventHooksHandler Error: pageConfig api.request missing`;
            if ( typeof(api.request)!=='function' ) throw `ListEventHooksHandler Error: pageConfig api.request should be a function`;
          }
        })
      }
    }
  }

  // 校验 sources
}
