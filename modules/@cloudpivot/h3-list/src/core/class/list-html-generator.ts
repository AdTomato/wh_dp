import {
  ListOptions,
  ActionElement,
  QueryColumn,
  ClientTypes,
  QueryAction,
  ActionJsonItem,
  ColumnJsonItem,
  QueryPresentation,
  QueryPresentationTypes,
  ElementAttr
} from "../schema";


import $t from '@cloudpivot/h3-list/src/core/locales';
// import { version } from 'moment';

import mobileListTemplate from '@cloudpivot/list/src/components/listCustom/template/mobile/handler'
import pcListTemplate from '@cloudpivot/list/src/components/listCustom/template/pc/handler'

export class ListHtmlGenerator {
  readonly options: ListOptions;

  private _presentation: QueryPresentation = {
    htmlJson: '',
    actionsJson: '',
    columnsJson: '',
  };
  private _presentationType: QueryPresentationTypes = QueryPresentationTypes.LIST;
  private _actions: Array<ActionElement> = [];
  private _columns: Array<QueryColumn> = [];

  private _style: string = '';
  private _actionSection: string = '';
  private _tempalte: string = '';
  private _customTemplate: string = '';
  private _scriptVersionLogs:string = '';
  private _script: string = '';

  private _htmlContent: string = '';

  constructor(options: ListOptions) {
    this.options = options;
  }

  get htmlContent() {
    return this._htmlContent;
  }

  get presentationType() {
    return this._presentationType;
  }

  get columns() {
    return this._columns.sort((a:any,b:any) => a.sortKey - b.sortKey);
  }

  get columnsJson() {
    return this._presentation.columnsJson;
  }

  reset() {
    this._actions = [];
    this._columns = [];

    this._style = '';
    this._actionSection = '';
    this._tempalte = '';
    this._customTemplate = '';
    this._script = '';

    this._htmlContent = '';
  }

  async generate() {
    this.reset();
    this.validateOptions()
    await this.callGenerateHtml()
  };

  /**
   * 校验传入的视图配置信息
   */
  private validateOptions() {
    this.validatePresentation();
    this.validateActions();
    this.validateColumns();
  }

  /**
   * 校验html编辑配置信息
   */
  private validatePresentation() {
    this._presentationType = this.options.queryPresentationType || QueryPresentationTypes.LIST;
    this._presentation = {
      htmlJson: '',
      actionsJson: '',
      columnsJson: '',
    }
    if (this.options.queryPresentation) {
      const { htmlJson, actionsJson, columnsJson } = this.options.queryPresentation;
      this._presentation.htmlJson = ListElementGeneratorService.parseString(htmlJson);
      this._presentation.actionsJson = ListElementGeneratorService.parseString(actionsJson);
      this._presentation.columnsJson = ListElementGeneratorService.parseString(columnsJson);
    }
  }

  /**
   * 校验操作按钮
   */
  private validateActions() {
    if (this.options.clientType === ClientTypes.APP) {
      return true;
    }
    if (!this.options.queryActions.length) {
      throw new Error('Actions cannot be empty!');
    }

    let actionAttrs: Array<ActionJsonItem> = [];

    if (Array.isArray(this._presentation.actionsJson)) {
      actionAttrs = this._presentation.actionsJson;
    }

    this._actions = this.options.queryActions.map((act: QueryAction) => {
      let action = {
        code: act.actionCode,
        text: act.name,
        sort: act.sortKey,
      }
      const attrs = actionAttrs.find((item: ActionJsonItem) => item.actionCode === act.actionCode);

      if (attrs && attrs.attributes) {
        action = Object.assign(action, attrs.attributes, {});
      }
      return action;
    })

    /**
     * 补充处理自定义操作按钮
     */
    const customActions = actionAttrs.filter((item: ActionJsonItem) => !this.options.queryActions.some((act:QueryAction) => act.actionCode === item.actionCode));
    customActions.forEach((act: ActionJsonItem) => {
      this._actions.push({
        code: act.actionCode,
        text: act.attributes.text || '',
        sort: +act.attributes.sort || (this._actions.length + 1),
        ...act.attributes
      })
    })
  }

  /**
   * 校验展示字段
   */
  private validateColumns() {
    if (!this.options.queryColumns.length) {
      // throw new Error('Column cannot be empty!');
      return;
    }

    let columnCustoms: Array<ColumnJsonItem> = [];

    if (Array.isArray(this._presentation.columnsJson)) {
      columnCustoms = this._presentation.columnsJson;
    }

    this._columns = this.options.queryColumns.map((col: QueryColumn) => {
      let column = {
        ...col
      }
      const columnItem = columnCustoms.find((item: ColumnJsonItem) => item.propertyCode === col.propertyCode);

      if (columnItem && columnItem.custom && columnItem.custom[this._presentationType.toLowerCase()]) {
        column.customHtml = columnItem.custom[this._presentationType.toLowerCase()];
      }

      return column;
    });
  }

  /**
   * 生成html文本
   */
  private callGenerateHtml() {
    this._htmlContent  = '';
    const self = this;
    return new Promise(async (resolve) => {
      self.generateStyle();
      self.generateActions();
      await self.generateTemplateAsync();
      // self.generateCustomTemplate();
      self.generateScript();
      self.combineContent();
      resolve();
    })
  }

  private generateStyle() {
    const tagName = 'style';
    let attrs = [{ name:'id', value:'customStyle' }];
    let inner = '\n';
    if (typeof this._presentation.htmlJson !== 'string') {
      inner = this._presentation.htmlJson.styleJson;
    }
    this._style = `<!-- 自定义样式: -->\n<!--
    样式控制不限于视图, 可作用于整个页面;
    但所设样式仅对当前视图页有效; \n-->\n` +
    ListElementGeneratorService.createElementString({
      tagName,
      attrs,
      inner,
    });
  }

  private generateActions() {
    const tagName = 'section';
    const attrs = [{
      name: 'id',
      value: 'list-actions'
    }];
    let inner = '\n';


    if (this._actions.length) {
      // inner = `\n\t<!-- ${$t('customActionInnerTopComment')} -->\n`;
      const before = '\t';
      const after = '\n';
      this._actions.forEach((action: ActionElement) => {
        action.class = action.class || `list-action-${action.code}`;
        let str = `${before}${this.generateAction(action)}${after}`;
        inner += str;
      })
    }
    this._actionSection = `\n<!-- 自定义按钮:  -->\n<!--
    按钮可自定义 code、名称、id、class 属性, 其中:
      * code  作为唯一逻辑标识, 必填且必须在视图内唯一
      * text  作为按钮名称
      * id    按钮 id, 非必填
      * class 按钮类名, 非必填；如不定义，会默认使用 \`list-action-\${actionCode}\`;
    默认按钮不能删除
    在编辑期内, 可通过 <alt+方向键> 调整按钮顺序;\n-->\n` +
    ListElementGeneratorService.createElementString({
      tagName,
      attrs,
      inner
    })
  }

  private generateAction(action: ActionElement) {
    const tagName = 'action';
    const attrs = Object.keys(action).map((k: string) => ({
      name: k,
      value: action[k]
    }));
    return ListElementGeneratorService.createElementString({
      tagName,
      attrs,
    })
  }

  generateTemplate() {
    return Promise.resolve("");
  }

  private async generateTemplateAsync() {
    const self = this;
    const tagName = 'template';
    const attrs = [
      {
        name: 'id',
        value: 'customTemplate'
      },
      // {
      //   name: 'type',
      //   value: 'template'
      // }
    ];
    const after = '\n';
    const inner = await self.generateTemplate();
    const htmlText = ListElementGeneratorService.createElementString({
      tagName,
      attrs,
      inner,
      after,
    })

    // 在编辑器内增加字段提醒
    const shownFieldsComment = `<!--\n\t! 当前展示字段:\n\t[\n\t\t${
      this.options.queryColumns.map(c=>`{ name:"${c.name}", propertyCode:"${c.propertyCode}" }`).join(',\n\t\t')
    }\n\t]\n-->\n`;

    self._tempalte = (
        self.options.clientType==='PC'?
        pcListTemplate.outerTopComment:
        mobileListTemplate.outerTopComment
      )
      + '\n'
      + shownFieldsComment
      + htmlText.replace(/\/>/g,'>');
  }

  private generateCustomTemplate() {
    const tagName = 'template';
    const attrs = [
      {
        name: 'id',
        value: 'customTemplate'
      },
      {
        name: 'type',
        value: 'template'
      }
    ];
    let comment = `<!-- ${$t('customTemplateTopComment')} -->\n`;
    let inner   = '';
    if (typeof this._presentation.htmlJson !== 'string') {
      inner = this._presentation.htmlJson.templateJson;
    }
    this._customTemplate = comment + ListElementGeneratorService.createElementString({
      tagName,
      attrs,
      inner
    })
  }

  private listEventHooksHandler    = null;
  private generateScriptVersionLogs(version) {
    let handler       = this.listEventHooksHandler || (this.listEventHooksHandler=require('@cloudpivot/list/src/components/listCustom/eventHooks/handler').default);
    let versionClass  = handler.loadSupportingVersionClass(version);


    return this._scriptVersionLogs = `<!-- 自定义脚本: 配置/扩展/事件钩子 (version:${version}) -->`
      +'\n'
      +versionClass.versionLogs.zh.hooks
      +'\n'
      +versionClass.versionLogs.zh.fields;


    return this._scriptVersionLogs = ListElementGeneratorService.createElementString({
      tagName:'logs',
      attrs: [{name:'id', value:'customScriptVersionLogs'}],
      inner:  `\n\n/* 当前版本: ${version} */\n` +
              versionClass.versionLogs.zh.hooks +
              versionClass.versionLogs.zh.fields
    });
  }
  private generateScript() {
    const tagName = 'script';
    const attrs = [{
      name: 'id',
      value: 'customScript'
    }];

    // testing: oldData
    // let inner = '';
    // if (typeof this._presentation.htmlJson !== 'string') {
    //   inner = this._presentation.htmlJson.scriptJson;
    // }
    // return this._script = ListElementGeneratorService.createElementString({
    //   tagName,
    //   attrs,
    //   inner
    // })

    let inner   = ''
    let handler = this.listEventHooksHandler || (this.listEventHooksHandler=require('@cloudpivot/list/src/components/listCustom/eventHooks/handler').default);
    let scription:any;
    // 如果没有值, 则填充 1.0 版本模板
    if (
      typeof( this._presentation )!=='object' ||
      typeof( this._presentation.htmlJson )!=='object' ||
      typeof( this._presentation.htmlJson.scriptJson ) !== 'string' ||
      !this._presentation.htmlJson.scriptJson.trim() ||
      // 如果是有初版的脚本值, 或者直接以 function(开头的, 返回1.0模板, 否则差异太大无从改起
      /^\(?function\s*\(/.test( this._presentation.htmlJson.scriptJson.trim() )
    ) {
      let version = '1.0';
      let versionClass  = handler.loadSupportingVersionClass(version);
      inner = versionClass.versionLogs.zh.template
      this.generateScriptVersionLogs(version);
    }
    // 如果有值, 优先输出原值
    else {
      try {
        // 如果解析不正确(用户代码编写有语法错误, 根本无法正常解析脚本对象, 理论上是不能提交的但确实提交了), 不作处理, 返回原值让他修改
        scription  = handler.parseScriptString(this._presentation.htmlJson.scriptJson);
        // 如果获取到的数据不正确, 也不做处理了, 直接返回原值
        if ( !scription.options || !scription.options.version ) throw null;
        // 正常处理
        handler.loadSupportingVersionClass(scription.options.version);
        this.generateScriptVersionLogs(scription.options.version);
        inner = this._presentation.htmlJson.scriptJson;
      } catch(err) {
        inner = this._presentation.htmlJson.scriptJson;
        console.error(err);
      }
    }


    return this._script = ListElementGeneratorService.createElementString({
      tagName,
      attrs,
      inner
    })
  }

  private combineContent() {
    let isPC = this.options.clientType === 'PC';
    this._htmlContent =
    '<!--' +
    '\n\t******************************** 自定义视图: ********************************' +
    '\n\t' + (isPC? 'PC端共四个可编辑模块: style、actions、template、script': 'Mobile端共三个可编辑模块: style、template、script') +
    '\n\t文档请查阅: https://demo.internal.cloudpivot.cn/docs/#/frontend/list/custom' +
    '\n\t***************************************************************************' +
    '\n-->\n\n' +

    this._style + '\n'
    + (isPC? (this._actionSection + '\n') :'')
    + this._tempalte + '\n'
    + this._customTemplate + '\n'
    // + '<!-- 视图版本信息, 自动生成, 编辑无效 -->\n'
    + this._scriptVersionLogs + '\n'
    // + '<!-- 视图设置: 配置/扩展 -->\n'
    + this._script + '\n';
  }


}

interface CreateElementAtt {
  tagName: string,
  attrs?: any[],
  inner?: string,
  after?: string
}

/**
 * 静态生成元素抽象类
 */
export abstract class ListElementGeneratorService {
  static parseString(str: any) {
    let result: any;
    try {
      result = JSON.parse(str);
    } catch (error) {
      result = '';
    }
    return result;
  }

  static createElementString(attribute: CreateElementAtt) {
    const { tagName, attrs = [], inner = "", after = "" } = attribute;
    const before = (inner&&after) ? (after+'\t') : (after || "");
    let attrString = '';
    if (attrs.length) {
      attrString = " " + attrs.map((att: ElementAttr) =>att.name==='sort'?'':`${att.name}="${att.value}"`).join(" ");
    }
    return `<${tagName}${attrString}>${before}${inner}${after}</${tagName}>`
  }
}
