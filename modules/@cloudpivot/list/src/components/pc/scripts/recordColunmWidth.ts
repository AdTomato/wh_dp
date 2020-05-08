import * as  AllTypes from './all.typings';
export default {
  /**
   * 处理拖拽之后的方法
   * @param colKey 
   * @param width 
   */ 
  handleColumResizeEnd(colum: AllTypes.ColumnOption, recordKey:string, columnsOptsKey:string){
    const { width, column } = colum;
    const colKey: string = column.id;
    const records: string = window.localStorage.getItem(recordKey) as string;
    if (records) {
      const recordJson: AllTypes.WidthRecords = JSON.parse(records) as AllTypes.WidthRecords;
      const item: AllTypes.Record = recordJson.value.find((t: AllTypes.Record) => Object.keys(t)[0] === colKey) as AllTypes.Record;
      if (item) { // update
        this.handleUpdateRecord(colKey, width, recordKey);
      } else { // add
        this.handleAddRecord(colKey, width, recordKey);
      }
    } else { // add
      this.handleAddRecord(colKey, width, recordKey)
    }

    // 更新列信息记录中的宽度
    const columnOpts: string = window.localStorage.getItem(columnsOptsKey) as string;
    if (columnOpts) {
      const cols:Array<AllTypes.DisplayedColumn> = JSON.parse(columnOpts) as Array<AllTypes.DisplayedColumn>;
      const colItem: AllTypes.DisplayedColumn = cols.find((col: AllTypes.DisplayedColumn) => col.id === colKey) as AllTypes.DisplayedColumn;
      if (colItem) {
        colItem.width = width;
      }

      window.localStorage.setItem(columnsOptsKey, JSON.stringify(cols));
    }
  },
  
  /**
   * 新增列宽记录
   * @params colKey为每一列的id
   * @params width每一列的宽度
   * @params recordKey记录对应的值
  */
  handleAddRecord(colKey: string, width: number, recordKey:string) {
    const records: string = window.localStorage.getItem(recordKey) as string;
    let _records: any = {};
    if (records) { // 添加至原有记录
      const recordJson: AllTypes.WidthRecords = JSON.parse(records) as AllTypes.WidthRecords;
      recordJson.value.push({
        [colKey]: width
      });
      _records = recordJson;
    } else { // 创建一个记录
      const obj: AllTypes.WidthRecords = {
        key: recordKey,
        value: []
      };

      obj.value.push({
        [colKey]: width
      })

      _records = obj;
    }

    window.localStorage.setItem(recordKey, JSON.stringify(_records));
  },

/**
 * 更新记录
 * @params colKey为每一列的id
 * @params width每一列的宽度
 * @params recordKey记录对应的值
 */
  handleUpdateRecord(colKey: string, width: number, recordKey:string) {
    const records: string = window.localStorage.getItem(recordKey) as string;
    const recordJson: AllTypes.WidthRecords = JSON.parse(records) as AllTypes.WidthRecords;

    const item: AllTypes.Record = recordJson.value.find((t: AllTypes.Record) => Object.keys(t)[0] === colKey) as AllTypes.Record;
    if (!item) return;
    item[colKey] = width;

    window.localStorage.setItem(recordKey, JSON.stringify(recordJson));
  }
}