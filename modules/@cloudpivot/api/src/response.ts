
export interface HttpResponse<T> {
    errcode?: number
    errmsg?: string
    data?: T
}