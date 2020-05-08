/**
 * 纸张规格名称
 */
export enum PaperSpecName {
    A3 = "A3",
    A4 = "A4",
    B4 = "B4",
    B5 = "B5",
    Custom = "自定义"
}
/**
 * 页眉页脚插入内容
 */
export enum InserContent {
    PageNum = "页码",
    Total = "页数",
    Date = "日期",
    Time = "时间"
}

/**
 * 纸张规格大小
 */
export interface PaperSpecSize {
    id: number;
    scale: string;
    widthTomm: number;
    heightTomm: number;
    widthTopx: string;
    heightTopx: string;
}
/**
 * 页边距
 */
export interface PageMargin {
    UpTomm: number;
    DownTomm: number;
    LeftTomm: number;
    RightTomm: number;
    UpTopx: number;
    DownTopx: number;
    LeftTopx: number;
    RightTopx: number;
}
/**
 * 纸张规格
 */
export const PaperSpecItem: PaperSpecSize[] = [
    { id: 0, scale: PaperSpecName.A3, widthTomm: 297, heightTomm: 420, widthTopx: "842", heightTopx: "1191" },
    { id: 1, scale: PaperSpecName.A4, widthTomm: 210, heightTomm: 297, widthTopx: "595", heightTopx: "842" },
    { id: 2, scale: PaperSpecName.B4, widthTomm: 250, heightTomm: 353, widthTopx: "709", heightTopx: "1001" },
    { id: 3, scale: PaperSpecName.B5, widthTomm: 176, heightTomm: 250, widthTopx: "499", heightTopx: "709" },
    { id: 4, scale: PaperSpecName.Custom, widthTomm: 210, heightTomm: 297, widthTopx: "595", heightTopx: "842" }
]

/**
 * 页眉页脚
 * 
 */
export interface areaInsert {
    marginTopTomm: number;
    marginTopTopx: number;
    align: string;
    items: { key: string[], value: string[] }
}
export interface HeaderFooter {
    header: areaInsert;
    footer: areaInsert;
}

/**
 * 页面设置保存数据集合；
 * direction纸张方向，1横向，2纵向；
 * _papersize纸张规格；
 * _pagemargin页面边距；
 */
export interface SettingData {
    eleType: string;
    direction: number;
    _papersize: PaperSpecSize;
    _pagemargin: PageMargin;
    _headerfooter: HeaderFooter;
    bgImg: bgImageUrl;
    isPrintBgImg: boolean;
}

/**
 * 默认页边距
 */
export const DefaultMargin: PageMargin = {
    UpTomm: 20,
    DownTomm: 20,
    LeftTomm: 17,
    RightTomm: 17,
    UpTopx: 57,
    DownTopx: 57,
    LeftTopx: 48,
    RightTopx: 48
}

/**
 * 默认页眉页脚
 */
export function getDefaultHeaderFooter(): areaInsert {
    return {
        marginTopTomm: 10,
        marginTopTopx: 28,
        align: '',
        items: { key: [], value: [] }
    }
}

export interface bgImageUrl { uid: string, name: string, status: string, url: string }
export function getDefaultSettings(): SettingData {
    return {
        eleType: "pageSettings",
        direction: 1,
        _papersize: Object.assign(
            {},
            PaperSpecItem.filter(
                (item: PaperSpecSize) =>
                    item.scale === PaperSpecName.A4
            )[0]
        ),
        _pagemargin: Object.assign({}, DefaultMargin),
        _headerfooter: { header: getDefaultHeaderFooter(), footer: getDefaultHeaderFooter() },
        bgImg: {
            uid: '',
            name: '',
            status: '',
            url: ''
        },
        isPrintBgImg: false
    }
}

/**
 * 毫米转像素
 * @param 毫米
 */
export function mmToPX(value: number): number {
    let inch = value / 25.4;
    return Math.ceil(inch * 72);
}

/**
 * 将纸张大小毫米转换成像素，并返回转后的实体对象
 * @param paper 纸张大小对象
 */
export function paperSizeToPX(paper: PaperSpecSize): PaperSpecSize {
    paper.widthTopx = mmToPX(paper.widthTomm).toString();
    paper.heightTopx = mmToPX(paper.heightTomm).toString();
    return paper;
}
/**
 * 将纸页面边距转换成像素，并返回转后的实体对象
 * @param margin 页面边距
 */
export function paperMarginToPX(margin: PageMargin): PageMargin {
    margin.UpTopx = mmToPX(margin.UpTomm);
    margin.DownTopx = mmToPX(margin.DownTomm);
    margin.LeftTopx = mmToPX(margin.LeftTomm);
    margin.RightTopx = mmToPX(margin.RightTomm);
    return margin;
}

export const acceptBgImg: string = ".jpg,.jpeg,.png,.gif";