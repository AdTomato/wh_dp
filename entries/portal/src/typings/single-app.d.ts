declare namespace BPM {
  export namespace SingleApp {
    /**
     * 单应用分组
     */
    export interface AppGroup {
      title?: string,
      childrens: Array<AppGroupItem>,
    }
    /**
     * 单应用分组表单
     */
    export interface AppGroupItem {
      name: string,
      icon: string,
      code: string,
      type: string,
      openMode: string,
      pcUrl: string,
    }
  }
}
