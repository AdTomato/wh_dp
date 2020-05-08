import { QueryAction } from './basic/query-action';
import { QueryColumn } from './basic/query-column';
import { QueryCondition } from './basic/query-condition';
import { QuerySort } from "./basic/query-sort";
import { QueryPresentation } from "./basic/query-html-json";
import { QueryPresentationTypes, ClientTypes, PublishStatus } from "./basic/enums";

/**
 * 视图设计时传给编辑器的数据结构
 */
export interface ParseOptions {
  //操作按钮
  queryActions: Array<QueryAction>,
  //列数据
  queryColumns: Array<QueryColumn>,
  //HTML编辑配置信息
  queryPresentation: QueryPresentation,
}
/**
 * 视图设计的配置信息
 */
export interface ListOptions extends ParseOptions {
  //视图类型
  queryPresentationType: QueryPresentationTypes,
  //客户端 -- PC视图/移动端视图
  clientType: ClientTypes
}
/**
 * 列表数据模型
 */
export interface ListDesignSchema extends ListOptions {
  //列表名称
  code: string,
  //列表名称 ———— 不同视图间应该唯一
  name: string,
  name_i18n: string,
  //绑定业务模型
  schemaCode: string,
  //视图排序 -- 如果有多个同类视图
  sortKey: number,
  //是否在PC端启用
  showOnPC: boolean,
  //是否在移动端启用
  showOnMobile: boolean,
  // 发布状态
  publish: PublishStatus,
  //查询条件
  queryConditions: Array<QueryCondition>,
  //排序字段
  querySorts: Array<QuerySort>,
  //其他
  [key: string]: any,
}








