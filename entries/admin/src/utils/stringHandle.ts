/**
 * 字符串替换
 * @param str 要替换的字符串
 * @param are 参数顺序替换
 * @constructor
 */
const AreFormat = (str:string, ...are:string[]) => {
    if (are.length == 0) return str;
    let s:string = str;
    for (let i = 0; i < are.length; i++) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), are[i]);
    }
    return s;
};
/**
 * 字符串替换，对象名称替换
 * @param str 要替换的字符串
 * @param obj 替换的字符的对象
 * @returns {String}
 */
const ObjFormat = (str:string, obj:any) => {
    let s = str;
    for(let i in obj){
        if(obj[i] instanceof Object){
            s = ObjFormat(s,obj[i]);
            continue;
        }
        s = s.replace(new RegExp("\\{" + i + "\\}", "gi"), obj[i]);
    }
    return s;
};
/**
 * 获取字符串长度
 * @param str
 * @param cn   中文是否两字节
 * @returns {number}
 */
export const getStrLen = (str: string, cn: boolean = false) : number => {
    let chart: any;
    let strLength = 0;
    for (let i = 0; i < str.length; i++) {
        chart = str.charAt(i);
        strLength++;
        if (cn) {
            if (escape(chart).length > 4) {
                strLength++;
            }
        }
    }
    return strLength;
};
export default {
    AreFormat,
    ObjFormat,
    getStrLen
}
