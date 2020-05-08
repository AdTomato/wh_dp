// 这个会有缓存
let locale = '';
let lang   = null;
function getLang() {
  if ( !!locale && locale===(window as any).localStorage.getItem('locale') ) return lang;
  locale = (window as any).localStorage.getItem('locale') || 'zh';
  return (lang = require(`./${locale==='zh'?'zh-CN':'en-US'}.ts`).default);
}

function $t(keys) {
  let lang2 = getLang();
  return keys.split('.').reduce((sum,key)=>{
    return sum[key];
  }, lang2)
}


export default $t;