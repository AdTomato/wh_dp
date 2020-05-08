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

/**
 * 将毫秒数直接转换为字符串
 * @param msec
 */
export const msesToTimeStr = (msec: number) => {
  const dateObj: any = msecToTimeSpan(msec);
  let dateStr = '';
  if (dateObj) {
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

/**
 * 格式化毫秒数为day-hour-minute
 * @param time
 */
export const timeTranslate = (time: number) => {
  const _t: any = msecToTimeSpan(time);

  let str: string = '';

  if (time === 0) return '1分钟';

  const _day: string = `${_t.day === 0 ? '' : `${_t.day}天`}`;

  let _hour: string = `${_t.hour}时`;
  if (_t.day === 0 && _t.hour === 0) {
    _hour = '';
  }

  const _minute = `${_t.minute === 0 ? 1 : _t.minute}分钟`;

  str = `${_day}${_hour}${_minute}`;

  return str;
};

/**
 * @desc 时间位数不够补0
 */
export const zeroFormat = (str: any) => {
  if (typeof str !== 'number') return null;
  str = str.toString();
  return str.length === 1 ? `0${str}` : str;
};

/*
  * 小数点后不足位补0函数
  */
export const addZero = (str:string, num:number) => {
  if (str.indexOf('.') === -1) {
    let zero: string = '';
    for (var i = 0; i < num; i++) {
      zero += '0';
    }
    return `${str}.${zero}`;
  } else {
    const numLength = str.split('.')[1].length;
    if (numLength < num) {
      let zero: string = '';
      for (var i = 0; i < num - numLength; i++) {
        zero += '0';
      }
      return `${str}${zero}`;
    }
    return str;
  }
}
