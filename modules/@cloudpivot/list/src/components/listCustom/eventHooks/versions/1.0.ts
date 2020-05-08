


import ListEventHooksHandler from '../handler';


// handler 主题其实就是 1.0, 作为 main
// 这里仅做 日志扩展

export default class SubHandler_v_1_0 extends  ListEventHooksHandler {
  // 版本日志
  public static versionLogs = {
    zh: {
      hooks: `<!--
    事件解释:
    @生命周期 onPreAction    视图数据加载前
    @生命周期 onLoad         视图数据加载后
    @生命周期 onRendered     视图数据渲染完毕
    @按钮事件 onPreAction    按钮事件触发前, 可通过返回 false 阻拦后续按钮事件流程
    @按钮事件 onCustomAction 自定义按钮执行逻辑
    @按钮事件 onActionDone   按钮事件触发完毕
    事件流程:
    onPreAction 在页面数据加载之前执行, 仅执行一次
    onLoad 和 onRendered 是对当前视图视图页进行监控, 翻页或其他增删都会重新触发
    所有事件都按照严格的顺序进行触发, 其中:
      * 生命周期事件: onPreLoad -> onLoad -> onRendered
      * 按钮事件中, 预置事件: onPreAction -> 预置按钮逻辑 -> onActionDone
      * 按钮事件中, 自定义事件: onPreAction -> onCustomAction -> onActionDone;
    如果需要做异步串联, 请在钩子内返回 Promise | Promise.all | Promise.race\n-->`,

        fields : `<!--
    重要字段声明:
    @隐藏字段 vm     所有事件钩子内引用, 指向页面 Vue 实例
    @隐藏字段 axios  所有事件钩子内引用, 第三方 ajax 库
    @隐藏字段 config 所有事件钩子内引用, 项目环境参数配置对象，源自项目 public/config.js
    @参数字段 data   指向当前视图页数据, onPreAction 事件外所有的钩子都包含
    @参数字段 action 按钮对象, 按钮数据格式为: { actionCode:'add', name:'新增', ... }
    @参数字段 result onActionDone 事件独有, 指向事件处理的结果, 由按钮执行返回 (预置按钮逻辑 | 自定义按钮逻辑)\n-->`,

      template: `\n({
    // 脚本配置: 在对配置修改之前, 请务必认真查阅相关文档
    options: {
        version:'1.0'
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
}
