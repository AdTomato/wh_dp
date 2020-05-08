

export interface SignParams {

    url: string

}

export interface SignResult {

    timeStamp: string

    nonceStr: string

    signature: string

}

export interface LoginParams {

    client_id: string

    code: string

    scope?: string

    state?: string

}

export interface LoginResult {

    access_token: string

    userinfo: any

    refresh_token: string

    expiration: number
}
