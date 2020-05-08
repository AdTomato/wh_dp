
import { FormAction } from './form-action';

import {
  RendererFormControl
} from '../schema';

export interface FormActionModalOptions {

  title: string

  code: FormAction

  data?: any
  
  approval ?: RendererFormControl

}

export interface FormActionData {

  [key: string]: any

}


export interface FormActionModal {

  show(options: FormActionModalOptions) : void;

  close() : void;

}


export interface FormActionComponent {

  submit(): FormActionData | undefined

}



/**
 * 表单操作按钮
 */
export interface FormActionButton {

  code: FormAction

  text: string

  /**
   * 禁用的
   */
  disabled: boolean

  /**
   * 可见的
   */
  visible: boolean

  loading ?: boolean
}

