/**
 * 常用的正则公式
 */
const regexps:any = {
    URL :'(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
    MOBILE: /Android|webOS|iPhone|iPod|BlackBerry/i
};
/**
 * 正则匹配
 * @param type regexps的类型
 * @param val  匹配值
 * @param empty 是否允许为空字符串
 */
export default function regexp(type:string,val: any,empty:boolean = false) {
    return val == '' && empty ? true: new RegExp(regexps[type]).test(val);
}
