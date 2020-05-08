/**
 * 确认窗控件配置项
*/
export interface ConfirmOptions {
  /**
   * 标题
   */
  title?:string;
  /**
   * 内容是字符串或者render函数
   */
  content?: string | Function;
  /**
   * 窗体宽度
   */
  width?: number;
  /**
   * 确认事件
   * @params e 事件源
   * @params content 内容对象
   */
  ok?: Function;
  /**
   * 取消事件
   * @params e 事件源
   * @params content 内容对象
   */
  cancel?: Function;
  /**
   * 默认按键 ['cancel', 'ok']
   */
  buttons?: string[],
  /**
   * 默认按键文字 ['cancel', 'ok']
   */
  buttonsText?: string[],
  /**
   * 文字对齐方式 'center'  'left'
   */
  align?: string,
  /**
  * 点击确认按钮是否销毁confirm，默认为true，与oKCallBack配合使用
  */
 oKDestoryed?: boolean,
  /**
  * 确认回调事件
  */
 oKCallBack?: Function;
}
