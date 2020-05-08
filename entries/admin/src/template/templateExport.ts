import axios from "axios";
import { FormControlType, FormHtmlControl } from '@cloudpivot/form/schema';
import { buildControlOptions } from '../../src/components/apps/form-design/typings/control-factory';
import { StringHandle } from '../../src/utils';
import { TemplateBPMType } from './template';

const htmlNodeName = Object.keys(TemplateBPMType);
const htmlNodeKey = Object.values(TemplateBPMType);

const template: string = '<!DOCTYPE html>\n' +
  '<html lang="en">\n' +
  '<head>\n' +
  '    <meta charset="utf-8">\n' +
  '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
  '    <meta name="viewport" content="width=device-width,initial-scale=1.0">\n' +
  '    <title>全局自定义模板</title>\n' +
  '</head>\n' +
  '<body>\n' +
  '<!--css配置-->\n' +
  '<style>\n' +
  '</style>\n\n' +
  // '<!--是否加载全局模板 请填写正确的load-template 格式：http://www.xxx.com/-->\n' +
  // '<section id="rootTemplate" load-template=""></section>\n' +
  // '<!--配置API地址 可以覆盖root配置 api-url格式：http://www.xxx.com/-->\n' +
  // '<section id="controller" api-url="{controller}"></section>\n' +
  '<!--RootToolbar配置-->\n' +
  '<section id="toolbar">\n' +
  '</section>\n\n' +
  '<!--Template配置 key是唯一标识，请不要修改已保证页面正常运行-->\n' +
  '<section type="template" id="template">\n' +
  '{template}' +
  '</section>\n\n' +
  '<!--自定义事件配置-->\n' +
  '<script id="customScript">\n' +
  '    (function(form){\n' +
  '        /**\n' +
  '         * 用户自定义JS区域\n' +
  '         */\n' +
  '        /**\n' +
  '         * 事件绑定，form.on\n' +
  '         * @param eventType 事件类型\n' +
  '         * @params function 事件\n' +
  '         * @param  cover    true, false 是否覆盖root的生命周期 默认不覆盖 \n' +
  '         */\n' +
  '        //数据加载后，渲染之前，this为window\n' +
  '        form.on(\'onLoad\',function(data, dataPermission){},\'cover\');\n' +
  '        //渲染完成后\n' +
  '        form.on(\'onRendered\',function(data){});\n' +
  '        //内置校验完成后，返回false阻止提交\n' +
  '        form.on(\'onValidate\',function(action,data){});\n' +
  '        //操作前（包含自定义按钮）执行，返回false阻止按钮操作\n' +
  '        form.on(\'onPreAction\',function(action,data){});\n' +
  '        //自定义按钮执行\n' +
  '        form.on(\'onCustomAction\',function(action,data){});\n' +
  '        //操作完成后执行\n' +
  '        form.on(\'onActionDone\',function(action,data,httpRes){});\n' +
  '    })\n' +
  '</script>\n' +
  '{scripts}' +
  '</body>\n' +
  '</html>';


export class TemplateExport {
  options: any;
  template: string = '';

  constructor(options: any) {
    this.options = options;
    
    this.init();
  }

  init() {
    let fun = (options: any, original: any) => {
      let controlOptions: any = {};
      for (let key in original) {
        
        // 处理radio 和 checkbox 默认选项丢失的问题
        if (key === 'options') {
          controlOptions[key] = options.options || "选项1;选项2;选项3";
        } else if (original[key] !== options[key] || key === 'deptVisible') {
          // if (!!options[key] && original[key] !== options[key]) {
          // 选人（部门）控件依据defaultValueType区分
          controlOptions[key] = options[key];
        }
        
      }
      return controlOptions;
    };
    const configure: any = this.options.configure;
    Object.values(configure).forEach((val: any) => {
      let original = buildControlOptions(val.type);
      val.options = fun(val.options, original);
      if (val.type == FormControlType.Sheet) {
        val.columns.forEach((colVal: any) => {
          let originalOther = buildControlOptions(colVal.type);
          colVal.options = fun(colVal.options, originalOther);
        })
      }
    });
  }

  getHTMLFile() {
    axios({
      method: 'get',
      url: `${process.env.BASE_URL}/template.html`
    }).then((responseHtml: any) => {
      axios({
        method: 'post',
        url: '/api/app/bizsheet/export_html',
        data: {
          htmlStr: this.buildTemplateHTML(responseHtml)
        },
        responseType: 'blob'
      }).then((response: any) => {
        let templateOther: string = `template-${new Date().getTime()}.html`;
        this.downloadFile(templateOther, response)
      })
    });
  }

  downloadFile(title: string, data: any) {
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = title;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  /**
   * 构建页面
   */
  buildTemplateHTML(html: string) {
    const rootTemplateNode = document.createElement('div');
    rootTemplateNode.innerHTML = html;
    const $scripts = rootTemplateNode.querySelectorAll('script');
    let scriptHTML = '';
    $scripts.forEach((script: any) => {
      script.className = 'templateScript';
      script.src = `${script.src}`;
      scriptHTML += script.outerHTML + '\r\n';
    });
    const options: any = {
      controller: '',
      template: this.buildTemplateControlHTML(),
      scripts: scriptHTML
    }
    return StringHandle.ObjFormat(template, options);
  }

  /**
   * 生成emplateControlHTML
   */
  buildTemplateControlHTML() {
    let templateOther: string = '';
    this.options.layout.forEach((row: string[]) => {
      templateOther += '<a-row>\n';
      row.forEach((col) => {
        const controlOptions = this.getControlOptions(this.options.configure, col);
        let nodeLabel = htmlNodeKey.findIndex((val) => {
          if (val == 50 && (controlOptions.type == 51 || controlOptions.type == 60 || controlOptions.type == 61)) {
            return true;
          }
          return controlOptions.type === val;
        });
        let nodeName = htmlNodeName[nodeLabel];
        templateOther += '    <a-col>\n';
        // 判断是否是字表
        if (controlOptions.type == FormControlType.Sheet) {
          templateOther += this.setControlHTML(nodeName, 8, 'none', controlOptions);
          // 判断是否有行数据
          if (controlOptions.columns && controlOptions.columns.length) {
            templateOther += this.setControlHTML('a-columns', 12, 'none');
            controlOptions.columns.forEach((colOptions: any) => {
              let nodeNameItem = htmlNodeName[htmlNodeKey.findIndex((val) => {
                return colOptions.type === val;
              })];
              templateOther += this.setControlHTML(nodeNameItem, 16, 'complete', colOptions);
            });
            templateOther += this.setControlHTML('a-columns', 12, 'front');
          }
          // 判断是否有统计
          if (controlOptions.statistics && controlOptions.statistics.length) {
            templateOther += this.setControlHTML('a-totals', 12, 'none');
            controlOptions.statistics.forEach((colOptions: any) => {
              let nodeNameItem = htmlNodeName[htmlNodeKey.findIndex((val) => {
                return colOptions.type === val;
              })];
              templateOther += this.setControlHTML(nodeNameItem, 16, 'complete', colOptions);
            });
            templateOther += this.setControlHTML('a-totals', 12, 'front');
          }

          templateOther += this.setControlHTML(nodeName, 8, 'front');
        } else if (controlOptions.type === FormControlType.Html) {
          const hc = controlOptions as FormHtmlControl;
          let attrHtml = hc.attrs.map(a => `${a.name}="${a.value}"`).join(' ');
          if (hc.attrs.length > 0) {
            attrHtml = ' ' + attrHtml + ' ';
          }
          const html = `\t\t<${hc.tagName}${attrHtml}>${hc.innerHTML}</${hc.tagName}>\n`;
          templateOther += html;
        } else {
          templateOther += this.setControlHTML(nodeName, 8, 'complete', controlOptions);
        }
        templateOther += '    </a-col>\n';
      })
      templateOther += '</a-row>\n';
    })
    return templateOther;
  }

  /**
   *设置控件HTML
   * @param nodeName 节点名称
   * @param retractNumber 缩进
   * @param slash  是否有横线
   * @param options  控件配置
   */
  setControlHTML(nodeName: string, retractNumber: number, slash: string = 'none', options: any = null): string {
    let retract = Array(retractNumber).fill(' ');
    let optionsStr: string = '';
    let contorTemplate = '';
    
    if (options) {
      options.data = options.options;
      delete options.options;
      optionsStr = this.optionsConvertElementAttribute(options);
    }
    switch (slash) {
      case 'none':
        contorTemplate = `<{0}{1}>\n`;
        break;
      case 'front':
        contorTemplate = `<\/{0}{1}>\n`;
        break;
      case 'complete':
        contorTemplate = `<{0}{1}></{0}>\n`;
        break;
    }
    return retract.join('') + StringHandle.AreFormat(contorTemplate, nodeName, optionsStr);
  }

  /**
   * 配置转HTML Attribute属性
   * @param options
   * @param pKey
   */
  optionsConvertElementAttribute(options: any, pKey: string = '', toJson = false) {
    let optionsStr: string = '';
    for (let key in options) {
      let ops = options[key];
      if (key == 'type' || key == 'parentKey') continue;

      if (ops instanceof Object && !(ops instanceof Array)) {
        const name = `${!!pKey ? (pKey + '-' + this.convertCase(key)) : this.convertCase(key)}`;
        if (toJson) {
          const json = JSON.stringify(ops);//.replace('"', '\"');
          optionsStr += ` ${name}='${json}'`;
        } else {
          optionsStr += this.optionsConvertElementAttribute(ops, name, true);
        }
      } else if (key !== 'columns' && key !== 'statistics') {
        if (typeof ops !== 'string') {
          ops = JSON.stringify(ops);
        }
        let opsStr: string = (ops.indexOf('"') > -1 ? `'${ops}'` : `"${ops}"`).toString();
        optionsStr += ` ${!!pKey ? (pKey + '-' + this.convertCase(key)) : this.convertCase(key)}=${opsStr}`;
      }
    }
    return optionsStr;
  }

  /**
   * 配置项驼峰命名法转换-W
   * @param key
   */
  convertCase(key: string) {
    return key.replace(/[A-Z]/g, ($1: string) => `-${$1.toLocaleLowerCase()}`);
  };
  /**
   * 通过ControlKey查找控件配置
   * @param configure
   * @param controlKey
   */
  getControlOptions(configure: any, controlKey: string): any {
    let ControlOptions: any;
    for (let key in configure) {
      if (key === controlKey) {
        ControlOptions = configure[key];
        break;
      } else if (configure[key].columns) {
        ControlOptions = this.getControlOptions(configure[key].columns, controlKey);
      }
    }
    return ControlOptions;
  }

}



