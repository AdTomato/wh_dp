declare namespace Common {
  /* 接口响应数据内容 */
  interface Data {
    data: any,
    errcode?: number,
    errmsg?: string,
  }
  /* HTTP响应 */
  interface Response {
    data: Data
  }
}