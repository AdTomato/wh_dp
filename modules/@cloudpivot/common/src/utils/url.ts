export const parseUrlParam = (urls: string, param: string) => {
  let url = urls;
  const searchIndex = url.indexOf('?');
  const jhIndex = url.indexOf('#');
  if (jhIndex > -1) {
    url = url.substr(0, jhIndex);
  }
  const searchParams = url.slice(searchIndex + 1).split('&');
  for (let i = 0; i < searchParams.length; i += 1) {
    const items = searchParams[i].split('=');
    if (items[0].trim().toLowerCase() === param.toLowerCase()) {
      const tmp = searchParams[i];
      return tmp.substr(tmp.indexOf('=') + 1);
    }
  }
  return null;
};


export function parseQuery(url: string = window.location.href) {
  let vars: any = {}, hash;
  url = decodeURI(url).replace(window.location.origin, '');
  
  const jhIndex = url.indexOf('#');
  if (jhIndex > -1) {
    url = url.substr(0, jhIndex);
  }
  
  let index: string[] = url.split('?');

  let hashes: string[];
  if (index.length > 1) {
    hashes = index[1].split('&');
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars[hash[0]] = decodeURIComponent(hash[1]);
    }
  }
  return vars;
}

/**
 * 获取url参数值
 * @param key
 * @param url
 * @returns string
 */
export function getUrlVar(key: string, url:string = window.location.href) {
  return getUrlVars(url)[key];
}

/**
* 获取url所有的参数值
* @param url
* @returns Object
*/
export function getUrlVars(url:string = window.location.href) {
  let vars:any = {}, hash;
  url = decodeURI(url).replace(window.location.origin,'');
  let index:string[] = url.split('?');
  let hashes: string[];
  if(index.length > 1){
      hashes = index[1].split('&');
      for (let i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars[hash[0]] = decodeURIComponent(hash[1]);
      }
  }
  return vars;
}