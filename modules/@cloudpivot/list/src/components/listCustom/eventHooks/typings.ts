import { QueryActions } from '@cloudpivot/api/src/application';


export interface Actions extends QueryActions{

}
// 类型定义
// 构造参数类型
export interface instanceBaseOptions {
  vm:any                      // vue 实例
  hooksOption?:HookOption[]   // 自定义钩子
  actions?:Actions[]     // TODO:注册操作
}
export interface subClassLoaderOptions extends instanceBaseOptions {
  scriptString:string,        // 脚本字符串
}
export interface constructorOptions extends instanceBaseOptions {
  scription:Scription         // 脚本对象
}

// 配置定义
// 构造参数中的自定义钩子
export interface HookOption {
  // 钩子函数的名字, 可自定义, 通过 handler.exec(name) 来触发,
  name:string
  // 钩子函数的参数[], 支持多个参数注入; 另: '$vm'指vm; 其他的'dataA'|'dataB.cc'指vm.dataA vm.dataB.cc;
  params:string[]
  // 如果是action, exec 函数会额外接受一个actionName, 并作为第一个参数注入;
  isActionEvent?:boolean
}
// 取消执行参数
export interface cancelParameter {
  event?:string,
  action?:Actions,
  cancelAll?:boolean,
  positive?:boolean
}


interface Scription {
  options:object,
  hooks:object,
  extensions?:object,
}
