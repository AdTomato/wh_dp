import {
	AssociationTypes,
	QueryActionTypes
} from './enums';

/**
 * 按钮操作
 */
export interface QueryAction {
	//操作编码 —— 用于绑定事件
	actionCode: string,
	//关联编码 —— 新建按钮绑定的表单或流程的编码
	associationCode: string,
	//关联类型 —— 新建按钮关联的类型为表单或流程
	associationType: AssociationTypes,
	//展示名
	name: string,
	//国际化名称
	name_i18n: string,
	//操作类型
	queryActionType: QueryActionTypes,
	//排序字段
	sortKey: number,
	// 其他属性 id|类名 等
	attributes:object,
	//其他
	[key:string]: any,
}
