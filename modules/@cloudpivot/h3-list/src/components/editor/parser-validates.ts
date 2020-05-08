import { ListHtmlParser, ASTElement, ListElementParserService, ListElementGeneratorService } from "../../core/class";
import { QueryPresentationTypes, ListOptions, ClientTypes, ColumnJsonItem } from "../../core/schema";

/**
 * 根据不同的视图类型，返回不同的解析类
 * @param html
 * @param options
 */
export function ListParseMap(html: string, options: ListOptions) {
  let result: any = null;
  if (options.clientType === ClientTypes.PC) {
    switch (options.queryPresentationType) {
      case QueryPresentationTypes.LIST:
        result = new ListTableParser(html, options);
        break;

      case QueryPresentationTypes.BOARD:
        result = new ListBoardParser(html, options);
        break;

      case QueryPresentationTypes.CALENDAR:
        result = new ListCalendarParser(html, options);
        break;
    }
  } else if (options.clientType === ClientTypes.APP) {
    switch (options.queryPresentationType) {
      case QueryPresentationTypes.LIST:
        result = new ListMobileTableParser(html, options);
        break;

      case QueryPresentationTypes.BOARD:
        result = new ListMobileBoardParser(html, options);
        break;

      case QueryPresentationTypes.CALENDAR:
        result = new ListMobileCalendarParser(html, options);
        break;
    }
  }
  return result;
}


////////////////////////////////////////////////////
/////                    PC                    /////
////////////////////////////////////////////////////
/**
 * 解析普通列表视图
 */
class ListTableParser extends ListHtmlParser {
  clearInnerHtml(
    el: ASTElement,
    opts: {
      parent: ASTElement | null,
      tagName: string,
      start: number,
      end: number
    }
  ) {
    super.clearInnerHtml(el, opts);
    const html = this.html;
    // 处理单元格自定义html内容
    if (opts.parent && opts.parent.tagName === 'l-td') {
      // el.innerHTML = html.substring(el.tagIndex + el.tagLength, opts.end).replace(`</l-td>`,'');
      el.innerHTML = html.substring(el.tagIndex + el.tagLength, opts.start);
      console.log(el.innerHTML);
    }
  }

  validateStart(el: ASTElement, parent: ASTElement | null) {
    if (this.options.clientType==='APP') return;
    super.validateStart(el, parent);
    const name = el.tagName;
    switch (name) {
      case 'l-table':
        this.validateParent({ name: 'template', id: 'customTemplate' }, el, parent);
        break;

      case 'l-thead':
      case 'l-tbody':
        this.validateParent({ name: 'l-table' }, el, parent);
        break;

      case 'l-th':
        this.validateAttrs({ requiredKeys: ['key', 'text','sort'] }, el);
        break;

      case 'l-td':
        this.validateAttrs({ requiredKeys: ['key'] }, el);
        break;

      default:
        break;
    }
  }

  validateEnd(el: ASTElement) {
    if (this.options.clientType==='APP') return;
    super.validateEnd(el);
    const name = el.tagName;
    switch (name) {
      case 'template':
        if (el.id === 'customTemplate') {
          this.validateChildren({ optionalNames: ['l-table'] }, el);
        };
        break;

      case 'l-table':
        this.validateChildren({ optionalNames: ['l-thead', 'l-tbody'] }, el);
        break;

      case 'l-thead':
      case 'l-tbody':
        this.validateChildren({ optionalNames: ['l-tr'] }, el);
        break;

      case 'l-tr':
        this.validateChildren({ optionalNames: ['l-td', 'l-th'] }, el);
        break;

      default:
        break;
    }
  }


  // TODO: 默认视图仅支持排序和改字段名字, 不允许其他修改
  async combineColumns() {
    if ( this.options.clientType==='APP' ) return;

    const ths = await this.findElementsByTagName('l-th');
    const tds = await this.findElementsByTagName('l-td');



    if (ths.length !== tds.length) {
      throw new Error('Unequal columns between the table head and table body!')
    }

    // 如果 th 或 td 做了增加/删除操作, 则返回错误提示
    if (
      this.options.queryColumns.length !== ths.length ||
      this.options.queryColumns.some(col=>{
        return !ths.some(thsItem=>thsItem.attrs.find(a=>a.name==='key'&&a.value===col.code)) ||
        !tds.some(tdsItem=>tdsItem.attrs.find(a=>a.name==='key'&&a.value===col.code))
      })
    ) {
      throw (`adding/deleting column is not allowed in table template`);
    }


    const columns: ColumnJsonItem[] = [];
    const presentationType = this.options.queryPresentationType.toLowerCase();
    const columnsSorts: string[] = [];

    await ths.forEach((th: ASTElement) => {
      const key = ListElementParserService.getElementAttr('key', th);
      const name = ListElementParserService.getElementAttr('text', th);

      if (!key) {
        throw new Error('lost attribute "key" for column:' + th.tagName);
      }

      columnsSorts.push(key);

      const column: ColumnJsonItem = {
        propertyCode: key,
        custom: {
          list: '',
          board: '',
          calendar: '',
        }
      }

      const matchedTd = tds.find((td: ASTElement) => ListElementParserService.getElementAttr('key', td) === key);

      if (!matchedTd) {
        throw new Error('Unequal columns between the table head and table body!');
      }

      // console.log(matchedTd);

      if (matchedTd && matchedTd.children.length) {
        matchedTd.innerHTML = matchedTd.children.map((el:any) => {
          return ListElementGeneratorService.createElementString({
            tagName: el.tagName,
            inner: el.innerHTML
          });
        }).join('\n');

        column.custom[presentationType] = matchedTd.innerHTML;
        columns.push(column);
      }

      if (name) {
        // 更新列的表头展示名
        this.setQueryColumn({
          propertyCode: key,
          attrs: {
            name
          }
        })
      }
    });

    this.setColumnsJson(columns);
    // 重新排序表格列
    this.sortColumns(columnsSorts);
  }
}

/**
 * 解析看板视图
 */
class ListBoardParser extends ListHtmlParser {
  // TODO
}

/**
 * 解析日历视图
 */
class ListCalendarParser extends ListHtmlParser {
  // TODO
}


////////////////////////////////////////////////////
/////                Mobile                    /////
////////////////////////////////////////////////////
/**
 * 解析移动端列表视图
 */
class ListMobileTableParser extends ListHtmlParser {
  // TODO
}
/**
 * 解析移动端看板视图
 */
class ListMobileBoardParser extends ListHtmlParser {
  // TODO
}
/**
 * 解析移动端日历视图
 */
class ListMobileCalendarParser extends ListHtmlParser {
  // TODO
}