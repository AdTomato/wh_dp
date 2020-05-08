export namespace DingTalk {
    export interface DingtalkConfig {
        agentId?: string,
        corpId: string,
        timeStamp: string,
        nonceStr: string,
        signature: string,
        cb: any,
        resume: any,
        back?: any
    }
    export interface SignatureParams {
        url: string
    }
}
