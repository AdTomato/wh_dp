/**
 * HTML编辑配置信息
 */
export interface QueryPresentation {
	htmlJson: HtmlJson | string,
	actionsJson: Array<ActionJsonItem> | string,
	columnsJson: Array<ColumnJsonItem> | string,
}

/**
 * 编辑器中的自定义样式和自定义脚本
 */
export interface HtmlJson {
	styleJson: string,
	scriptJson: string,
	// TODO: templateJson - 自定义模板字段，如果有值，则不采用预设的列表/看板/日历模板渲染，而直接渲染此模板的html(预留功能)
	templateJson: string, 
}

/**
 * 操作按钮的自定义内容
 */
export interface ActionJsonItem {
	actionCode: string,
	//自定义属性
	attributes: {
		[attr: string]: string
	}
}

/**
 * 单元格的自定义内容
 */
export interface ColumnJsonItem {
	propertyCode: string,
	//自定义Html内容
	custom: {
		// 列表视图下的单元格自定义
		list: string,
		// 看板下的单元格自定义
		board: string,
		// 日历下的单元格自定义
		calendar: string,
	},
}
