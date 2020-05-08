

import { NumberFormatType } from '../typings';


export interface NumberFormatter {

    formatter: (val: number | string, options?: any) => string

    parser: (str: string) => number
}

export interface NumberTrance extends NumberFormatter {
    trans: (num: number, len:number) => number
}


const isEmpty = (val: any) => (typeof val !== 'number' && typeof val !== 'string') || val === '';


export const int: NumberFormatter = {

    formatter: (val: number | string): string => {
        if (isEmpty(val)) {
            return '';
        }

        const s = val + '';
        const idx = s.lastIndexOf('.');
        if (idx === -1) {
            return s;
        }
        return s.substring(0, idx);
    },

    parser: (str: string): number => {
        return Number(str);
    }

}


export interface RatioFormatterOptions {
    /**
     * 精度
     */
    precision: number;

    // /**
    //  * 单位，百分、千分
    //  */
    // unit: number;
}

export const ratio: NumberFormatter = {

    formatter: (val: number | string, options?: RatioFormatterOptions): string => {
        if (isEmpty(val)) {
            return '';
        }

        let precision = 0;

        if (options && options.precision) {
            precision = options.precision;
        }

        if (precision === 0) {
            return int.formatter(val) + '%';
        }

        const s = val + '';
        const idx = s.indexOf('.');
        if (idx === -1) {
            const pre = Array(precision).fill(0).map(() => '0').join('');
            return `${val}.${pre}%`;
        }

        const len = s.length - 1 - idx;
        if (len === precision) {
            return s + '%';
        }

        if (len > precision) {
            return s.substr(0, idx + precision + 1) + '%';
        }

        const pre = Array(precision - len).fill(0).map(() => '0').join('');
        return `${val}${idx < 0 ? '.' : ''}${pre}%`;
    },

    parser: (str: string): number => {
        return Number(str.replace('%', ''));
    }

};



export interface CurrencyFormatterOptions {
    /**
     * 符号
     */
    symbol: string;

    /**
     * 精度
     */
    precision: number;
}

export const currency: NumberTrance = {

    formatter: (val: number | string, options: CurrencyFormatterOptions): string => {
        
        if (isEmpty(val)) {
            return '';
        }

        let symbol = '';
        if (options && options.symbol) {
            symbol = options.symbol;
        }

        let precision = 2;
        if (options && typeof options.precision === 'number') {
            precision = options.precision;
        }

        let s = '';
        if (symbol) {
            s = `${symbol}${val}`;
        } else {
            s = `${val}`;
        }
        const idx = s.indexOf('.');
        let len = s.length - 1 - idx;
        
        if (idx > -1 && len > precision) {
            s = s.substr(0, idx + precision + 1);
        } else {
            len = idx === -1 ? precision : precision - len;
            const pre = Array(len).fill(0).map(() => '0').join('');
            s = `${s}${idx < 0 ? '.' : ''}${pre}`;
        }
        const sList = s.split('.');
        if (sList.length === 1) {
            s = sList[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
            s = `${sList[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${sList[1]}`
        }
        // s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return s;
    },

    parser: (str: string): number => {
        return Number(str.replace(/[^\d\.]/g, ''));
    },
    trans: (num:number, l:number) => {
        let precision = 2;
        if (l) {
            precision = l;
        }
        let s = '';
        s = `${num}`;
        const idx = s.indexOf('.');
        let len = s.length - 1 - idx;
        if (idx > -1 && len > precision) {
            s = s.substr(0, idx + precision + 1);
        } else {
            len = idx === -1 ? precision : precision - len;
            const pre = Array(len).fill(0).map(() => '0').join('');
            s = `${s}${idx < 0 ? '.' : ''}${pre}`;
        }
        return Number(s);
    }
};



export function format(formatType: NumberFormatType,val : number) {
    if (val === null || val === undefined) {
        return '';
    }
    
    switch (formatType) {
        
        default:
        case NumberFormatType.None:
            return val;

        case NumberFormatType.Int:
            return int.formatter(val);

        case NumberFormatType.Ratio:
            return ratio.formatter(val);
        case NumberFormatType.Ratio2:
            return ratio.formatter(val, {
                precision: 1
            });
        case NumberFormatType.Ratio3:
            return ratio.formatter(val, {
                precision: 2
            });
        case NumberFormatType.Ratio4:
            return ratio.formatter(val, {
                precision: 3
            });
        case NumberFormatType.Ratio5:
            return ratio.formatter(val, {
                precision: 4
            });

        case NumberFormatType.Tenths:
            return currency.formatter(val, {
                precision: 1
            });
        case NumberFormatType.Decimal:
            return currency.formatter(val);
        case NumberFormatType.Decimal2:
            return currency.formatter(val, {
                precision: 3
            });
        case NumberFormatType.Decimal3:
            return currency.formatter(val, {
                precision: 4
            });
        case NumberFormatType.CurrencyRMB:
            return currency.formatter(val, {
                symbol: "￥"
            });
        case NumberFormatType.CurrencyRMB2:
            return currency.formatter(val, {
                symbol: "￥",
                precision: 3
            });
        case NumberFormatType.CurrencyRMB3:
            return currency.formatter(val, {
                symbol: "￥",
                precision: 4
            });

        case NumberFormatType.CurrencyDollar:
            return currency.formatter(val, {
                symbol: "$"
            });

        case NumberFormatType.CurrencyDollar2:
            return currency.formatter(val, {
                symbol: "$",
                precision: 3
            });
        case NumberFormatType.CurrencyDollar3:
            return currency.formatter(val, {
                symbol: "$",
                precision: 4
            });
        case NumberFormatType.CurrencyEuro:
            return currency.formatter(val, {
                symbol: "€"
            });
        case NumberFormatType.CurrencyEuro2:
            return currency.formatter(val, {
                symbol: "€",
                precision: 3
            });
        case NumberFormatType.CurrencyEuro3:
            return currency.formatter(val, {
                symbol: "€",
                precision: 4
            });
        case NumberFormatType.CurrencyHK:
            return currency.formatter(val, {
                symbol: "HK$"
            });
        case NumberFormatType.CurrencyHK2:
            return currency.formatter(val, {
                symbol: "HK$",
                precision: 3
            })
        case NumberFormatType.CurrencyHK3:
            return currency.formatter(val, {
                symbol: "HK$",
                precision: 4
            });
    }

}