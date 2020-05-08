

interface constructorOptions {
  from:string;
  fields?:any;
  html?:string;
}


export default class PCListTemplate {

  // 统一的报错头
  public static errorLogPrefix = 'ListCustomTemplate Error';
  // 模块选择符
  public static readonly templateSelector = '#customTemplate';

  public static outerTopComment = `\n<!-- 自定义模板: -->\n<!--
    可使用<alt+方向键>调整字段顺序;
    其他修改无效;\n-->`;

  public static template = `<div id="customTemplate">
  <a-table
    :dataSource="listData"
    :columns="columns"
    style="width:100%;"
  >
  </a-table>
  <a-button @click="testing">sdfsd</a-button>
</div>`;

  //
  // private fields:any;
  // private html:string;

  constructor(options:constructorOptions) {
    // let { fields,html } = options
    // this.fields = fields;
    // this.html   = html;
  }

  // ======================================= 转换

  public convertTo(html,type) {
    if ( type==='html' ) return this.generateHtml();
    else return this.parseHtml(html);
  }
  public parseHtml(html:string) {
    // WARN:这里会依赖浏览器原生的 DOMParser, 理论上主流浏览器都会支持, 但具体还不好说, 需要更多测试
    let virtualDom = new (window as any).DOMParser().parseFromString(html,'text/html');
    let templateWrapper = virtualDom.body.querySelector(PCListTemplate.templateSelector);

    // 如果解析出来的dom不包含特定的模块, 说明
    if ( !templateWrapper ) throw `${PCListTemplate.errorLogPrefix}: CustomTemplate parsing failed!`;
  }
  public generateHtml() {

  }
}
