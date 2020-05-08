declare namespace OAuth {
  interface RequestParams {
    // 定义请求参数结构
    client_id: string,
    code: string,
    scope?: string,
    state?: string,
  }

  interface Userinfo {
    id: string,
    name: string,
    username: string,
  }

  interface Response {
    errcode: number,
    access_token: string,
    refresh_token: string,
    user_id: string,
    scope: string[],
    mobile: boolean,
    expiration: number,
    token_type: string,
    expires_in: number,
    userinfo: Userinfo
  }

  interface FormUrlParams {
    messageId: string
  }

  interface GetFormUrlParams {
    formCode?: string,
    schemaCode: string,
    bizObjectId: string,
  }
}
