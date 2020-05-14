const urlPath = "http://121.41.27.194:8080/api";

import axios from 'axios';
import QS from 'qs';
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function Get(url, params){  
    let _url = urlPath + url;  
    return new Promise((resolve, reject) =>{        
            axios.get(_url, {            
                params: params        
            }).then(res => {
                resolve(res.data);
            }).catch(err =>{
                reject(err.data)        
        })    
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function Post(url, params) {
    let _url = urlPath + url; 
    return new Promise((resolve, reject) => {
         axios.post(_url, QS.stringify(params))
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}

