/**
 * AST 语法树转换声明
 */

export interface ElementAttr {
  name: string,
  value: string,
}

export interface ActionElement {
  text: string,
  code: string,
  class?: string,
  sort: number,
}