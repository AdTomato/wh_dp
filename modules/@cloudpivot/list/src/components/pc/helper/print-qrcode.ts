interface Size {
  width:number,
  height:number,
}
/** 
 * 批量打印二维码
*/
class PrintQRCode {
  /**
   * 生成html以转成pdf
   * @selector id属性
   */
  generateHtml(selector:string, size:Size){
    size.width = Math.ceil(size.width);
    size.height = Math.ceil(size.height);
    const htmlText: any = document.getElementById(selector);
    const tempHTML: any = htmlText.innerHTML;
    return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width"/>
          <title>云枢打印-批量打印二维码</title>
          <style type="text/css">
            @page{
              size: ${size.width + 0.5}px ${size.height + 0.5}px;
              padding: 0;
              margin: ${Math.floor(size.height * 0.05)}px ${Math.floor(size.width * 0.05)}px;
            }
          </style>
        </head>
        <body style="font-family: Microsoft YaHei;margin: 0!important; padding: 0!important;">${tempHTML}</body>
      </html>
    `;
  }
}

export default new PrintQRCode();
