/**
 * 时间转换
 * @param date  时间对象
 * @param fmt  YYYY-MM-DD HH:mm:ss
 */
export const dateFormat = (date: Date, fmt: string) => {
  const o: any = {
    'M+': date.getMonth() + 1, // 月份
    'D+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  for (const k in o) if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
  return fmt;
};
/**
 * 将毫秒数转成天时分
 * @param msec
 */
export const msecToTimeSpan: Function = (msec: number) => {
  if (msec) {
    const days = Math.floor(msec / (1000 * 60 * 60 * 24));
    const hours = Math.floor((msec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.ceil((msec % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.ceil((msec % (1000 * 60)) / 1000);
    return {
      day: days, hour: hours, minute: minutes, second: seconds
    };
  }
  return '';
};

export const msesToTimeStr = (msec: number) => {
  const dateObj: any = msecToTimeSpan(msec);
  let dateStr = '';
  if (!!dateObj) {
    if (dateObj.day !== 0) {
      dateStr += `${dateObj.day}天`;
    }
    if (dateObj.hour !== 0) {
      dateStr += `${dateObj.hour}时`;
    }
    if (dateObj.minute !== 0) {
      dateStr += `${dateObj.minute}分`;
    }
  }
  return dateStr;
};


export const timeTranslate = (time: number) => {
  const lang: string = localStorage.getItem('locale') || 'zh';
  const isZH = lang === 'zh';
  const _t: any = msecToTimeSpan(time);

  let str: string = '';

  if (time === 0) return isZH ? '1分钟' : '1min';

  let _day: string = `${isZH ? `${_t.day}天` : `${_t.day}day `}`;
  if (_t.day === 0) {
    _day = '';
  }

  let _hour: string = `${isZH ? `${_t.hour}小时` : `${_t.hour}hr `}`;
  if (_t.day === 0 && _t.hour === 0) {
    _hour = '';
  }

  let _minute = `${isZH ? `${_t.minute}分钟` : `${_t.minute}min`}`;
  if (_t.minute === 0) {
    _minute = isZH ? '1分钟' : '1min';
  }

  str = `${_day}${_hour}${_minute}`;

  return str;
};

/**
 * 判断是否是当前日的后n天，n为负值时表示前-n天
 * @param date
 * @param n
 */
export const isDayAfter = (date: Date, n: number) => {
  const day = new Date(new Date().getTime() + n * 24 * 60 * 60 * 1000);
  return day.getFullYear() === date.getFullYear()
    && day.getMonth() === date.getMonth() && day.getDate() === date.getDate();
};

/**
 * 将日期转换为n天前
 * @param date
 */
export const timeAgo = (dateStrig: string) => {
  const matchs:any = dateStrig.toString().match(/\d{4}-\d{2}-\d{2}/);
  const str = matchs.length ? matchs[0] : '';
  if (str) {
    const difftime = new Date().getTime() - new Date(str).getTime();
    if (difftime < 0) {
      return '0天前';
    }
    const day = Math.floor(difftime / (24 * 60 * 60 * 1000));
    return `${day}天前`;
  }
  return '无';
};

export default {
  dateFormat,
  msecToTimeSpan,
  msesToTimeStr,
  timeTranslate,
  timeAgo,
  isDayAfter
};
