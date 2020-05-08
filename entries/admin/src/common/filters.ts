const formatDate = (stamp: any, format = 'y-M-d') => {
  /* 日期格式化，不转时区 */
  if (!stamp) return;
  try {
    if (typeof stamp === 'string') {
      stamp = stamp.replace(/-/g, '/').slice(0, 19);
    }
    const d = new Date(stamp);
    const fillzero = (t: any) => (t > 9 ? t : `0${t}`);
    const year = d.getFullYear();
    const month = fillzero(d.getMonth() + 1);
    const date = fillzero(d.getDate());
    const hour = fillzero(d.getHours());
    const min = fillzero(d.getMinutes());
    const sec = fillzero(d.getSeconds());
    // 输出时间的两个部分，pre:日期部分,aft:时间部分
    let pre = '';
    let aft = '';
    const ymd = format.match(/^y(.+?)M(.+?)d/);
    // 年月日 ymd
    const hm = format.match(/h:m$/);
    // 时分  hm
    const hms = format.match(/h:m:s$/);
    // 时分秒  hms
    if (ymd) {
      const line = ymd[2] || '';
      pre = [year, month, date].join(line);
    }
    if (hm) {
      aft = [hour, min].join(':');
    }
    if (hms) {
      aft = [hour, min, sec].join(':');
    }
    const output = [pre, aft].join(' ');
    return output.trim();
  } catch (error) {
    return stamp;
  }
};

export default {
  formatDate
};
