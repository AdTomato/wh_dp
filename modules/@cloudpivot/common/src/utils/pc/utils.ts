export const getRealLength = (str: any) => {
  if (!str) { return 0; }
  let realLength: number = 0;
  const len: number = str.length;
  let charCode: number = -1;
  for (let i: number = 0; i < len; i += 1) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
  }
  return realLength;
};

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
    if (items[0].trim().toLowerCase() === param.toLowerCase() && items[1]) {
      return items[1].trim();
    }
  }
  return null;
};
/* 正则规则 */
export const pattern = (type: string) => {
  switch (type) {
    case 'code':
      /* 以字母开头不超过28个字符，仅支持字母、数字、下划线 */
      return /^[a-zA-Z][a-zA-Z0-9_]{0,27}$/;
    case 'modelcode':
      /* 以字母开头不超过26个字符，仅支持字母、数字、下划线 */
      return /^[a-zA-Z][a-zA-Z0-9_]{0,25}$/;
    case 'name':
      /* 仅限50个字符以内，并不能以空格开头 */
      return /^\S(.{0,49})?$/;
    default:
      break;
  }
};

export const nameValidator = (rules: any, value: any, callback: any, length: number) => {
  const reg = /^ /;
  const len = getRealLength(value);
  if (reg.test(value) || len > (length | 50)) {
    callback('');
  }
  callback();
};
export const sliceString = (value: any, length: number) => {
  // const reg = /^ /;
  if (!value) { return ''; }
  let charCode = -1;
  let realLength: number = 0;
  const len: number = value.length;
  for (let i: number = 0; i < len; i += 1) {
    charCode = value.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
    if (realLength > length) {
      return value.substring(0, i);
    }
  }
  return value;
};

// 搜索高亮文本显示
export const searchHighLight = (searchWord: string, text: string) => {
  // 处理xss漏洞
  let handledText: string = '';
  if (!text) return handledText;
  
  handledText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  if (searchWord && handledText) {
    let html: string = '';
    const arr: any = handledText.split(new RegExp(`(${searchWord})|(?=${searchWord})`, 'i'));
    arr.forEach((fragment: string) => {
      if (fragment.toLowerCase() === searchWord.toLowerCase()) {
        html += `<span style='color:#2970FF !important;'>${fragment}</span>`;
      } else {
        html += `${fragment}`;
      }
    });
    return html;
  }
  return handledText;
};


/**
 * 时间戳转年月日时分秒
 * formateType: 'YY-MM-DD'
 * formateType: 'YY-MM-DD HH:mm:ss'
 * */
export const timeStampToDate = (formateType: string, timeStamp: string) => {
  if (!formateType) return;
  const D = new Date(timeStamp);
  const year = D.getFullYear();
  const month = zeroFormater(D.getMonth() + 1);
  const date = zeroFormater(D.getDate());
  const hour = zeroFormater(D.getHours());
  const minute = zeroFormater(D.getMinutes());
  const second = zeroFormater(D.getSeconds());

  if (formateType === 'YY-MM-DD') {
    return `${year}-${month}-${date}`;
  } else if (formateType === 'YY-MM-DD HH:mm:ss') {
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  }
};

// 补0
export const zeroFormater = (p: number | string) => {
  let str: string = '';
  if (typeof (p) === 'number') {
    str = p.toString();
  } else if (typeof (p) === 'string') {
    str = p;
  } else {
    console.log('error');
  }
  return str.length > 1 ? str : `0${str}`;
};

export const downloadFileByPost = (url: string, data: any, enctype?: string) => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', 'down-file-iframe');
  const form = document.createElement('form');
  form.setAttribute('target', 'down-file-iframe');
  form.setAttribute('method', 'post');
  form.setAttribute('action', url);

  Object.keys(data).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    if (Array.isArray(data[key])) {
      input.value = data[key].join(',');
    } else {
      input.value = data[key];
    }
    form.appendChild(input);
  });
  iframe.appendChild(form);
  document.body.appendChild(iframe);
  form.submit();
  // ((iframe.parentNode) as any).removeChild(iframe);
};

/**
 * 国际化兼容
 * @param data 需要处理的数据，例如表格的行数据
 * @param zhKey 中文的字段名
 * @param i18nKey 国际化字段名 非必填
 */
const langList: Array<string> = ['en'];
const parseI18n: any = function (I18nString: any) {
  if (I18nString && typeof I18nString === 'object') {
    return I18nString
  } else if (/^\{.+?\}$/.test(I18nString)){
    return parseI18n(JSON.parse(I18nString));
  } else {
    return {};
  }
};
export const compatible = (data: any, zhKey: string, i18nKey?: string): any => {
  const _i18nKey = !i18nKey ? 'name_i18n' : i18nKey;
  const _i18nNames = data[_i18nKey];
  if (!_i18nNames) {
    data[_i18nKey] = {};
    langList.forEach((locale: string) => {
      data[_i18nKey][locale] = data[zhKey];
    })
  } else {
    if (typeof _i18nNames === 'string') {
      data[_i18nKey] = parseI18n(_i18nNames);
    }
    langList.forEach((locale: string) => {
      if (!data[_i18nKey][locale])
        data[_i18nKey][locale] = data[zhKey];
    });
  }
  return data;
};

