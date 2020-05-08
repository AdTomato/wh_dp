import { parseHTML } from '../utils/html-parser';
import { ASTElement } from './ast-element';
import { ActionElement, ElementAttr, ListOptions, ActionJsonItem, QueryAction, QueryPresentation, HtmlJson, QueryColumn, ColumnJsonItem, QueryActionTypes, DefaultActionTypes, AssociationTypes } from '../schema';

import ListEventHooksHandler from '@cloudpivot/list/src/components/listCustom/eventHooks/handler'

const vueCompiler = require('@cloudpivot/list/src/components/mobile/application-list/vueCompiler.build');



/**
 * 视图html解析类
 */
export class ListHtmlParser {

  readonly html: string;
  readonly options: ListOptions;
  readonly sysActions: string[] = Object.values(DefaultActionTypes);

  private _outputOptions: ListOptions | null = null;

  private _elements: Array<ASTElement> = [];
  private _actions: Array<ActionElement> = [];

  private _queryPresentation: QueryPresentation = {
    htmlJson: {
      styleJson: '',
      scriptJson: '',
      templateJson: '',
    },
    actionsJson: [],
    columnsJson: [],
  };

  get elements() { return this._elements };
  get actions() { return this._actions };
  get outputOptions() { return this._outputOptions };

  constructor(html: string, options: ListOptions) {
    this.html = html;
    this.options = options;
    // 用 DefaultActionType 的 value 做值, 不能依赖传入
    // this.sysActions = options.queryActions.map((act) => act.actionCode);
    this._outputOptions = options;
  }

  /**
   * 重置，初始化
   */
  reset() {
    this._elements = [];
    this._actions = [];
  }

  /**
   * 校验父元素
   * @param must
   * @param el
   * @param parent
   */
  validateParent(
    must: {
      name?: string,
      id?: string,
      empty?: boolean
    },
    el: ASTElement,
    parent: ASTElement | null
  ) {
    if (must.name) {
      let msg = `<${el.tagName}> must in <${must.name}`;
      if (must.id) {
        msg += ` id="${must.id}"`;
      }
      msg += '>';
      if (
        !parent
        || parent.tagName !== must.name
        || (must.id && parent.id !== must.id)
      ) {
        throw new Error(msg);
      }
    } else if (must.empty) {
      if (parent) {
        throw new Error(`$<${el.tagName}> cannot has parent!`);
      }
    }
  }

  /**
   * 校验必填属性
   * @param must
   */
  validateAttrs(
    must: {
      requiredKeys: string[]
    },
    el: ASTElement
  ) {
    if (must.requiredKeys.length) {
      const LostKeys: string[] = must.requiredKeys.filter(key => !el.attrs.some(att => att.name === key));
      if (LostKeys.length) {
        throw new Error(`<${el.tagName}> must has attributes: ${LostKeys.join('、')}!`);
      }
    }
  }

  /**
   * 校验子元素
   * @param must
   * @param el
   */
  validateChildren(
    must: {
      optionalNames: string[]
    },
    el: ASTElement
  ) {
    if (el.children.length) {
      const childNodes = el.children.filter(e => !must.optionalNames.includes(e.tagName));
      if (childNodes.length) {
        const tags = childNodes.map(node => node.tagName).join('、');
        throw new Error(`<${el.tagName}> has unknown children: ${tags}`);
      }
    }
  }

  /**
   * 校验标签外层嵌套元素
   */
  validateStart(el: ASTElement, parent: ASTElement | null) {
    const name = el.tagName;

    switch (name) {
      case 'action':
        this.validateParent({ name: 'section', id: 'list-actions' }, el, parent);
        this.validateAttrs({ requiredKeys: ['code', 'text','sort'] }, el);
        break;

      case 'style':
      case 'script':
        this.validateParent({ empty: true }, el, parent);
        break;

      default:
        break;
    }
  }

  /**
   * 校验标签内层嵌套元素
   * @param el
   */
  validateEnd(el: ASTElement) {
    const name = el.tagName;

    switch (name) {
      /**
       * 特殊元素（带id）限制
       */
      case 'section':
        if (el.id === 'list-actions') {
          this.validateChildren({ optionalNames: ['action'] }, el);
        }
        break;

      default:
        break;
    }
  }

  /**
   * 清空不允许有html内容的标签
   * @param tagName
   * @param start
   * @param end
   */
  clearInnerHtml(
    el: ASTElement,
    opts: {
      parent: ASTElement | null,
      tagName: string,
      start: number,
      end: number
    }) {
    const html = this.html;
    // PC 端暂不支持模板完全自定义
    // const subHtmlTags = this.options.clientType==='PC'? ['style', 'script']: ['style', 'script', 'template'];
    const subHtmlTags = ['style', 'script', 'template'];
    if (subHtmlTags.includes(opts.tagName)) {
      el.innerHTML = html.substring(el.tagIndex + el.tagLength, opts.start);
    }
  }

  /**
   * 根据id查找元素
   * @param id
   */
  findElementById(id: string) {
    const el = this._elements.find(e => e.id === id);
    return el;
  }

  /**
   * 根据class查找元素
   * @param className
   */
  findElementsByClass(className: string) {
    const els = this._elements.filter(e => e.attrs.some(attr => attr.name === className));
    return els;
  }

  /**
   * 根据标签名查找元素
   * @param tagName
   */
  async findElementsByTagName(tagName: string, target?: ASTElement[]) {
    const targetArr = target || this.elements;
    const els: any = [];
    async function finder(elements: ASTElement[]) {
      elements.forEach((e: ASTElement) => {
        if (e.tagName === tagName) {
          els.push(e);
        } else if (e.children.length) {
          finder(e.children);
        }
      })
    }
    await finder(targetArr);
    return els;
  }

  /**
   * 解析html -- ast
   */

  async parse() {
    const html = this.html;
    if (!html || !html.trim()) {
      return;
    }
    // 解析html内容为AST数组
    this.callParseHtml(html);
    // 解析actions
    this.handlerActions();
    // 解析script
    this.handlerScript();

    // 生成输出的配置信息对象
    await this.combineOptions();

  }

  /**
   * 抽象html
   * @param html
   */
  private callParseHtml(html: string) {
    this.reset();
    const stack: ASTElement[] = [];
    const self = this;
    parseHTML(html, {
      start(tagName: string, attrs: any[], unary: any, start: number, end: number) {
        let parent: ASTElement | null = stack.length ? stack[stack.length - 1] : null;
        attrs.push({name:'sort',value:'0'})
        let el = new ASTElement(tagName, start, end - start, attrs, parent);
        self.validateStart(el, parent);
        stack.push(el);
      },
      end(tagName: string, start: number, end: number) {
        let el = stack.pop();
        if (el) {
          let parent: ASTElement | null = stack.length ? stack[stack.length - 1] : null;
          self.validateEnd(el);
          self.clearInnerHtml(
            el,
            {
              parent,
              tagName,
              start,
              end
            });
            if ( stack.length === 0 ) {
              self.elements.push(el);
            }
            if ( (self.options.clientType==='PC'&&el.id==='customTemplate') ) {
              self.elements.push(el);
            }
        }
      }
    });
  }

  /**
   * 处理操作按钮
   */
  private handlerActions() {
    const el = this.findElementById('list-actions');

    if (!el || el.children.length === 0) {
      return;
    }


    const _actions = el.children.map((e,i) => {
      const action: any = {};

      e.attrs.forEach((attr: ElementAttr) => {
        const name = ListElementParserService.convertAttrName(attr.name);
        const value = ListElementParserService.convertAttrValue(attr.value);
        action[name] = value;
      });

      // 无视sort属性, 按照物理排序重新设置顺序
      action.sort = i+1

      return action;
    })

    // 检测预设按钮是否健全
    if ( !this.sysActions.every(sa=>_actions.some(a=>a.code===sa)) ) {
      throw `请勿删除默认按钮或修改默认按钮code属性`;
    };

    this._actions = _actions;
  }

  /**
   * 处理javascript脚本
   */
  private handlerScript() {
    const el = this.findElementById('customScript');

    if (el && el.innerHTML) {
      el.innerHTML = el.innerHTML.replace(/\bwindow.parent.document\b/, 'document');
    }
  }

  //////////  处理输出数据，数据回传时  ///////////

  /**
   * 将解析得到的结果与设计区数据合并
   */
  async combineOptions() {
    this.combineStyle();
    this.combineScript();
    this.combineCustomTemplate();
    this.combineActions();
    await this.combineColumns();
    this.combinePresentation();
  }
  /**
   * 解析自定义样式
   */
  private combineStyle() {
    let elIdx = -1;
    const styleElement = this._elements.find((e: ASTElement, idx: number) => {
      if (e.tagName === 'style') {
        elIdx = idx;
        return true;
      }
      return false;
    });
    if (styleElement && styleElement.innerHTML) {
      (this._queryPresentation.htmlJson as HtmlJson).styleJson = styleElement.innerHTML;
    }
    if (elIdx > -1) {
      // 每次校验完将元素剔除，减少后续的元素搜寻时间
      this._elements.splice(elIdx, 1);
    }
  }
  /**
   * 解析自定义脚本 —— customScript的内容
   */
  private combineScript() {
    let elIdx = -1;
    const scriptElement = this._elements.find((e: ASTElement, idx: number) => {
      if (e.tagName === 'script' && e.id === 'customScript') {
        elIdx = idx;
        return true;
      }
      return false;
    });
    if (scriptElement && scriptElement.innerHTML) {
      // 在这里尝试做个解析, 如果出错, 会抛出异常, 阻断后续流程
      let scription = ListEventHooksHandler.parseScriptString(scriptElement.innerHTML);
      // let versionHandler = ListEventHooksHandler.loadSupportingVersionHandler(scription.)
      ;(this._queryPresentation.htmlJson as HtmlJson).scriptJson = scriptElement.innerHTML;
    }
    if (elIdx > -1) {
      // 每次校验完将元素剔除，减少后续的元素搜寻时间
      this._elements.splice(elIdx, 1);
    }
  }
  /**
   * 解析自定义模板 -- customTemplate内容
   */
  private combineCustomTemplate() {
    let elIdx = -1;
    const customTemplate = this._elements.find((e: ASTElement, idx: number) => {
      if (e.tagName === 'template' && e.id === 'customTemplate') {
        elIdx = idx;
        return true;
      }
      return false;
    });
    if (customTemplate && customTemplate.innerHTML && this.options.clientType==='APP') {

      let compiled = vueCompiler.compile( customTemplate.innerHTML  );
      if ( compiled.errors.length ) {
        console.error(`Error compiling template:\n\n${customTemplate.innerHTML}'\n\n${compiled.errors.join('\n')}`);
        throw '自定义模板解析错误！详情请查看控制台！'
      }

      (this._queryPresentation.htmlJson as HtmlJson).templateJson = customTemplate.innerHTML;
    }
    if (elIdx > -1) {
      // 每次校验完将元素剔除，减少后续的元素搜寻时间
      this._elements.splice(elIdx, 1);
    }
  }

  /**
   * 处理操作
   */
  private combineActions() {
    const actionsJson: any = [];
    const self: any = this;


    // 在 actions 里遍历, 只能处理<新增>的操作;
    // 对于<删除>操作, 需要遍历 options, 剔除不存在于 actions 里的按钮
    let outputOptions = this._outputOptions as any;
    outputOptions.queryActions = (outputOptions.queryActions as []).filter(
      // 过滤条件: 只过滤自定义按钮
      (ac1:ActionJsonItem)=> {
        return this.sysActions.includes(ac1.actionCode) ||
          this.actions.find( (ac2:ActionElement)=>ac2.code===ac1.actionCode );
      }
    );


    //
    this.actions.forEach((act: ActionElement) => {
      const actionJsonItem: ActionJsonItem = {
        actionCode: act.code,
        attributes: {}
      }
      Object.keys(act).forEach((key: string) => {
        const extAttributes: string[] = this.sysActions.includes(act.code) ? ['code', 'text','sort'] : ['code','sort'];
        if (extAttributes.indexOf(key) === -1) {
          actionJsonItem.attributes[key] = act[key];
        }
      })
      if (Object.keys(actionJsonItem.attributes).length > 0) {
        actionsJson.push(actionJsonItem);
      }
      const isSysAction:boolean = self._outputOptions.queryActions.some((action: QueryAction) => {
        if (action.actionCode === act.code) {
          action.name = act.text;
          action.sortKey = act.sort;
          // action.attributes = actionJsonItem.attributes;
          return true;
        }
        return false;
      })
      // 新增自定义按钮
      if (!isSysAction) {
        const sortKey = self._outputOptions.queryActions.length + 1;
        const customAction: QueryAction = {
          actionCode: act.code,
          associationCode: '',
          associationType: AssociationTypes.FORM,
          name: act.text,
          name_i18n: '',
          queryActionType: QueryActionTypes.CUSTOM,
          attributes:actionJsonItem.attributes,
          sortKey,
        }
        self._outputOptions.queryActions.push(customAction);
      }
    });

    if (actionsJson.length) {
      self._queryPresentation.actionsJson = actionsJson.map((a1:any)=>{
        let a2:any = self._outputOptions.queryActions.find((a:any)=>a.actionCode===a1.actionCode);
        if ( a2 && a2.queryActionType===QueryActionTypes.CUSTOM ) return { ...a1,...a2 };
        else return a1;
      });
    }

    // self._outputOptions.actions =
    // self._queryPresentation.actionsJson =
    // self._outputOptions.queryActions

    // 排序
    outputOptions.queryActions.sort((c,n)=>(+c.sortKey)-(+n.sortKey));
  }

  /**
   * 处理预设模板内容
   */
  async combineColumns() {
    // NOTE: 此方法因模板各异，由继承类实现，数据处理后存入： _outputOptions.queryColumns 和 _queryPresentation.columnsJson
    // NOTE: 依赖方法：
    //         setQueryColumn：每次更新一个列的表头属性
    //         setColumnsJson：一次性写入自定义单元格信息
  }

  /**
   * 更新列的表头属性
   * @param col
   */
  setQueryColumn(col: {
    propertyCode: string,
    attrs: {
      [key: string]: any
    }
  }) {
    const acceptAttrs: string[] = ['name'];
    (this._outputOptions as ListOptions).queryColumns.some((column: QueryColumn) => {
      if (column.propertyCode === col.propertyCode) {
        Object.keys(col.attrs).forEach((key: string) => {
          if (acceptAttrs.includes(key)) {
            column[key] = col.attrs[key];
          }
        })
        return true;
      }
      return false;
    })
  }

  /**
   * 根据编辑器的新的列，重新排序
   * @param sorts
   */
  sortColumns(sorts: string[]) {
    const sortedColumns: Array<QueryColumn> = [];
    const { queryColumns } = this._outputOptions as ListOptions;
    sorts.forEach((code: string, index: number) => {
      const column:any = queryColumns.find((col => col.propertyCode === code));
      if (column) {
        column.sortKey = index + 1;
        sortedColumns.push(column);
      }
    });
    if (sortedColumns.length === queryColumns.length) {
      (this._outputOptions as ListOptions).queryColumns = sortedColumns;
    } else {
      throw new Error('Generated columns length is not equal to source columns\' length');
    }
  }

  /**
   * 更新列的自定义单元格信息
   * @param columnsJson
   */
  setColumnsJson(columnsJson: Array<ColumnJsonItem>) {
    this._queryPresentation.columnsJson = columnsJson;
  }

  /**
   * 处理自定义内容汇总 --- queryPresentation
   * @param options
   */
  private combinePresentation() {
    const {
      htmlJson,
      actionsJson,
      columnsJson
    } = this._queryPresentation;

    const queryPresentation = {
      htmlJson: '',
      actionsJson: '',
      columnsJson: '',
    };

    queryPresentation.htmlJson = JSON.stringify(htmlJson);

    if (Array.isArray(actionsJson) && actionsJson.length) {
      queryPresentation.actionsJson = JSON.stringify(actionsJson);
    }

    if (Array.isArray(columnsJson) && columnsJson.length) {
      queryPresentation.columnsJson = JSON.stringify(columnsJson);
    }

    (this._outputOptions as ListOptions).queryPresentation = queryPresentation;
  }

}

/**
 * 抽象类，用于元素解析
 */
export abstract class ListElementParserService {
  /**
   * 中横线转小驼峰
   * @param attrName
   */
  static convertAttrName(attrName: string) {
    const name = attrName.replace(/-([a-z]{1})/, ($0: string, $1: string) => $1.toUpperCase());
    return name;
  }
  /**
   * 过滤处理属性值中的"和\
   * @param attrValue
   */
  static convertAttrValue(attrValue: string) {
    let val: any;
    try {
      val = JSON.parse(JSON.stringify(attrValue).replace(/^["] | \\ | "$/g, ''));
    } catch (error) {
      val = attrValue;
    }
    return val;
  }
  /**
   * 获取元素任意属性的值
   * @param name
   * @param el
   */
  static getElementAttr(name: string, el: ASTElement) {
    const attr = el.attrs.find((att: ElementAttr) => att.name === name);
    if (attr) {
      return attr.value;
    }
    return '';
  }
}
