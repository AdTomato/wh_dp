import {
	PropertyTypes
} from './enums';

/**
 * 查询字段
 */
export interface QueryCondition {
	choiceType: number,
	defaultValue: string,
	displayType: number,
	endValue: string,
	name: string,
	name_i18n: string,
	options: string,
	propertyCode: string,
	propertyType: PropertyTypes,
	schemaCode: string,
	sortKey: number,
	startValue: string,
	[key:string]: any,
}
