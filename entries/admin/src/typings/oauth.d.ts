declare namespace OAuth {
  export interface RequestParams {
    // 定义请求参数结构
    client_id: string,
    client_secret: string,
    grant_type: string,
    redirect_uri: string,
    code: string | null,
  }
  export interface Data {
    token_type: string,
    expires_in: number,
    scope: string,
    client: string,
    username: string,
    jti: string,
    access_token: string,
    refresh_token: string,
  }

  export interface Response {
    data: Data,
  }

}
