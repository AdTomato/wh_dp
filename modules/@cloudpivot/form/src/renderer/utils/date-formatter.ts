
// import * as moment from "moment";

// moment().utcOffset(8);

export const dateFormatter = function (val: Date | string, format?: string) {

    if (format) {
        const idx = format.indexOf(' ');
        if (idx === -1) {
            format = format.toUpperCase();
        } else {
            format = format.substr(0, idx).toUpperCase() + format.substr(idx);
        }
    } else {
        format = 'YYYY-MM-DD';
    }

    // const m = (moment as any)(val);
    // m.utcOffset(8);

    // let str = m.format(format);

    let str = '';

    const date = new Date(val);
    str = format.replace('YYYY', date.getFullYear().toString());

    const month = date.getMonth() + 1;
    str = str.replace('MM', month < 10 ? `0${month}` : month.toString());

    const d = date.getDate();
    str = str.replace('DD', d < 10 ? `0${d}` : d.toString());

    const hours = date.getHours();
    str = str.replace(/HH/i, hours < 10 ? `0${hours}` : hours.toString());

    const minutes = date.getMinutes();
    str = str.replace('mm', minutes < 10 ? `0${minutes}` : minutes.toString());

    const seconds = date.getSeconds();
    str = str.replace('ss', seconds < 10 ? `0${seconds}` : seconds.toString());

    return str;
}