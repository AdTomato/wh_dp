
export interface SiderOptions {

  /**
   * 初始宽度
   */
  width: number

  /**
   * 最小宽度
   */
  minWidth: number

  /**
   * 最大宽度
   */
  maxWidth: number

  /**
   * 可收缩的
   */
  collapsible: boolean

  /**
   * 是否收起
   */
  collapsed: boolean

  /**
   * 可调整大小
   */
  slider: boolean

  direction: 'left' | 'right'

}