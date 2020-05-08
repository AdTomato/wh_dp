export * from './response';

export enum AppTreeItemTypes {
  BizModel = 'BizModel',
  Folder = 'Folder',
  Page = 'Page'
}
export interface AppData {
  appCode: string,
  appName: string,
  size: number,
  dataList: Array<InstanceItem>
}
export interface InstanceItem {
  code: string,
  favorites: boolean,
  id: string,
  name: string,
  type: AppTreeItemTypes,
  openMode: string,
  mobileUrl: string,
  pcUrl: string,
  children?: Array<InstanceItem>
}
export interface InstanceRootItem {
  children: Array<InstanceItem>
}
