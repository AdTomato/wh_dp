import { ListOptions, QueryPresentationTypes, ClientTypes, QueryColumn, ColumnJsonItem } from "../../core/schema";
import { ListHtmlGenerator, ListElementGeneratorService } from "../../core/class";

import $t from '@cloudpivot/h3-list/src/core/locales';
//  const $t = new (required('@cloudpivot/common/locales/dynamic'))('@cloudpivot/h3-list/src/core/locales/')

export function ListGeneratorMap(options: ListOptions) {
  let html: any;
  if (options.clientType === ClientTypes.PC) {
    switch (options.queryPresentationType) {
      case QueryPresentationTypes.LIST:
        html = new ListTableGenerator(options);
        break;

      case QueryPresentationTypes.BOARD:
        html = new ListBoardGenerator(options);
        break;

      case QueryPresentationTypes.CALENDAR:
        html = new ListCalendarGenerator(options);
        break;
    }
  } else if (options.clientType === ClientTypes.APP) {
    switch (options.queryPresentationType) {
      case QueryPresentationTypes.LIST:
        html = new ListMobileTableGenerator(options);
        break;

      case QueryPresentationTypes.BOARD:
        html = new ListMobileBoardGenerator(options);
        break;

      case QueryPresentationTypes.CALENDAR:
        html = new ListMobileCalendargenerator(options);
        break;
    }
  }
  return html;
}

////////////////////////////////////////////////////
/////                    PC                    /////
////////////////////////////////////////////////////
/**
 * 解析普通列表视图
 * NOTE: generateTemplate() 必须返回包含String结果的Promise对象
 */

// ============================= list
class ListTableGenerator extends ListHtmlGenerator {
  async generateTemplate() {
    const ths: any[] = [];
    const tds: any[] = [];
    this.columns.forEach((column: QueryColumn) => {
      // 生成表格头
      const th = ListElementGeneratorService.createElementString({
        tagName: 'l-th',
        attrs: [
          {
            name: 'key',
            value: column.propertyCode
          },
          {
            name: 'text',
            value: column.name
          },
          {
            name: 'sort',
            value: column.sortKey
          }
        ],
      });
      ths.push(th);
      // 生成表格体
      let inner:any = '';
      if (Array.isArray(this.columnsJson)) {
        const columnJson = this.columnsJson.find((col:ColumnJsonItem) => col.propertyCode === column.propertyCode);
        if (columnJson) {
          try {
            inner = columnJson.custom[this.presentationType.toLowerCase()];
          } catch (error) {
            throw new Error(error);
          }
        }
      }
      const td = ListElementGeneratorService.createElementString({
        tagName: 'l-td',
        attrs: [
          {
            name: 'key',
            value: column.propertyCode
          },
          {
            name: 'text',
            value: column.name
          }
        ],
        inner
      });
      tds.push(td);
    });
    const lThead = ListElementGeneratorService.createElementString({
      tagName: 'l-thead',
      after: '\n\t\t',
      inner: ListElementGeneratorService.createElementString({
        tagName: 'l-tr',
        after: '\n\t\t\t',
        inner: ths.join('\n\t\t\t\t')
      })
    });
    const lTbody = ListElementGeneratorService.createElementString({
      tagName: 'l-tbody',
      after: '\n\t\t',
      inner: ListElementGeneratorService.createElementString({
        tagName: 'l-tr',
        after: '\n\t\t\t',
        inner: tds.join('\n\t\t\t\t')
      })
    });
    // 注释
    const topComment      = ''
    const innerTopComment = '';
    // const tHeadComment    = `<!-- ${$t('presetTemplateInnerTHeadComment')} -->\n\t\t`;
    const tHeadComment    = ``;
    const tBodyComment    = `<!-- $t('presetTemplateInnerTBodyComment') -->\n\t\t`;
    const lTable  = ListElementGeneratorService.createElementString({
      tagName: 'l-table',
      after: '\n\t',
      inner: `${tHeadComment}${ lThead }\n\t\t${ lTbody }`
    })
    return Promise.resolve(lTable);
  }
}
class ListMobileTableGenerator extends ListHtmlGenerator {
  private converter = null;
  async generateTemplate() {
    let options = this.options;
    let template = ''


    // 如果接口返回有效值 array|string
    if ( options.queryPresentation && options.queryPresentation.htmlJson ) {
      let htmlJson = typeof(options.queryPresentation.htmlJson)==='string'? JSON.parse(options.queryPresentation.htmlJson): options.queryPresentation.htmlJson;
      let templateJson;
      if (  templateJson=htmlJson.templateJson.trim() ) {
        template = templateJson.replace(/\>/g,'>');
      }
    }

    if ( !template || !template.trim() ) {
      let converter = this.converter || (this.converter = ((await import('@cloudpivot/list/src/components/listCustom/template/mobile/handler')) as any).default);
      template = (converter as any).template
    }

    return Promise.resolve(template);
  }
}
// ============================= borad
class ListBoardGenerator extends ListHtmlGenerator { }
class ListMobileBoardGenerator extends ListHtmlGenerator { }
// ============================= calendar
class ListCalendarGenerator extends ListHtmlGenerator { }
class ListMobileCalendargenerator extends ListHtmlGenerator { }