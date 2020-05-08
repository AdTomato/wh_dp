
import { FormControlType } from './form-control-type';

import { FormControlOptions } from './control-options';

import { ElementAttr } from './form-element';


/**
 * 表单设计控件
 */
export interface FormControl {

  /**
   * 数据项code 
   * 布局控件的key为type
   */
  key: string

  /**
   * 控件选项
   */
  options: FormControlOptions

  /**
   * 控件类型
   */
  type: FormControlType

  /**
   * 父级key
   */
  parentKey?: string

}

/**
 * 子表统计控件
 */
export interface FormSheetStatistic extends FormControl {

  columnKey: string

}


export interface FormSheetColumn extends FormControl {

  /**
   * 列宽：100
   */
  width: number | null

}


/**
 * 子表
 */
export interface FormSheet extends FormControl {

  /**
   * 列
   */
  columns: FormSheetColumn[]

  /**
   * 统计
   */
  statistics: FormSheetStatistic[]

}


export interface FormHtmlControl extends FormControl {

  tagName: string

  innerHTML: string

  attrs: Array<ElementAttr>

}