export interface TableColumns {
  width: number, // 列宽
  fixed ?:boolean, // 是否固定列宽
  align ?:string, // 对齐方式
  dataIndex ?:string, // 对应列的key值
  headSlot ?:string, // 表头自定义slot
  bodySlot ?:string, // 表体自定义slot
}

export interface ColStyles {
  width: string,
  align?: string
}