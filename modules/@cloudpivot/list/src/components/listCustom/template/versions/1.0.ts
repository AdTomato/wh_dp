


import Handler from '../handler';



export default class ListCustomTemplate extends Handler {



  // ============================= 静态&类属性/函数

  /**
   * html 和 data 校验
   */
  public static validateHtml(html) {
    let validation = { result:false, message:'' };
    // 如果为空, 如果类型不对
    if ( typeof(html)!=='string' || !(html=html.trim()) )  {
      validation.message = `: html text could not be "${html}"`;
    }
    else if ( false ) {
      validation.message = `${Handler.errorLogPrefix}: html text could not be ${html}`;
    }
    else {
      validation.result = true;
    }


    validation.message = validation.message? `${Handler.errorLogPrefix}${validation.message}`: '';
    return validation;
  }
  public static validateData(data) {
    let validation = { result:false, message:'' };
    // 如果类型不对, 或者为空
    if ( String(data)!=='[object object]' || !data ) {
      validation.message = `: Parameter <data> should be an object!`
    }
    // 如果找不到版本信息
    else if ( !data.version ) {
      validation.message = `: Template version info not found!`;
    }
    // 都找不到问题就置为true
    else {
      validation.result = true;
    }

    validation.message = validation.message? `${Handler.errorLogPrefix}${validation.message}`: '';
    return validation;
  }
  /**
   * html 和 data 转换
   */
  public static htmlToData(html:any) {
    // 获取校验结果
    let validation = this.validateHtml(html);
    if ( !validation.result ) throw validation.message;
  }
  public static dataToHtml(data:any) {
    // 获取校验结果
    let validation = this.validateData(data);
    if ( !validation.result ) throw validation.message;
  }
}