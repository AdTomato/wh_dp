

export interface SetLeftParams {

    text?: string

    fn: () => void

}

export interface GetLocationParams {

    /**
     * 精度
     */
    accuracy: number

    /**
     * 是否需要逆地理地址编码（详细地址）
     */
    reGeocode: boolean
}

export interface GetLocationResult {

    /** 经度 */
    longitude: number;
    /** 纬度 */
    latitude: number;
    /** 实际的定位精度半径（单位米） */
    accuracy: number;
    /** 格式化地址，如：北京市朝阳区南磨房镇北京国家广告产业园区 */
    address: string;
    /** 省份，如：北京市 */
    province: string;
    /** 城市，直辖市会返回空 */
    city: string;
    /** 行政区，如：朝阳区 */
    district: string;
    /** 街道，如：西大望路甲12-2号楼 */
    road: string;
    /** 当前设备网络类型，如：wifi、3g等 */
    netType: string;
    /** 当前设备使用移动运营商，如：CMCC等 */
    operatorType: string;
    /** 对错误码的描述 */
    errorMessage?: string;
    /** 错误码 */
    errorCode?: number;
    /** 仅Android支持，wifi设置是否开启，不保证已连接上 */
    isWifiEnabled?: boolean;
    /** 仅Android支持，gps设置是否开启，不保证已经连接上 */
    isGpsEnabled?: boolean;
    /** 仅Android支持，定位返回的经纬度是否是模拟的结果 */
    isFromMock?: boolean;
    /** 仅Android支持，我们使用的是混合定位，具体定位提供者有wifi/lbs/gps" 这三种 */
    provider?: 'wifi' | 'lbs' | 'gps';
    /** 仅Android支持，移动网络是设置是否开启，不保证已经连接上 */
    isMobileEnabled: boolean;
}

export interface MapSearchParams {

    scope: number

    latitude?: number

    longitude?: number

}


/**
 * 地图搜索 返回结果定义
 * @apiName biz.map.search
 */
export interface MapSearchResult {
    /** POI所在省会，可能为空 */
    province: string;
    /** POI所在省会编码，可能为空 */
    provinceCode: string;
    /** POI所在城市，可能为空 */
    city: string;
    /** POI所在城市的编码，可能为空 */
    cityCode: string;
    /** POI所在区，可能为空 */
    adName: string;
    /** POI所在区的编码，可能为空 */
    adCode: string;
    /** POI与设备位置的距离 */
    distance: string;
    /** POI的邮编，可能为空 */
    postCode: string;
    /** POI的街道地址，可能为空 */
    snippet: string;
    /** POI的名称 */
    title: string;
    /** POI的纬度，高德坐标 */
    latitude: number;
    /** POI的经度，高德坐标 */
    longitude: number;
}


export interface MapViewParams {

    title: string

    latitude: number

    longitude: number

}


export interface PlatformServiceLike {

    /**
     * 设置页面标题
     * @param title 
     */
    setTitle(title: string): void

    /**
     * 新页面打开链接
     * @param url 
     */
    openLink(url: string): void

    /**
     * 关闭页面
     */
    close(): void

    /**
     * 设置返回事件
     * @param params 
     */
    setLeft(params: SetLeftParams): void

    /**
     * 获取当前位置
     * @param params 
     */
    getLocation(params: GetLocationParams): Promise<GetLocationResult>

    /**
     * 打开地图搜索
     * @param params 
     */
    mapSearch(params: MapSearchParams): Promise<MapSearchResult>

    /**
     * 打开地图显示位置
     * @param params 
     */
    mapView(params: MapViewParams): void
}


export class BrowserService implements PlatformServiceLike {

    setTitle(title: string) {
        document.title = title;
    }

    openLink(url: string) {
        window.open(url);
    }

    close() {
        window.close();
    }

    setLeft(params: SetLeftParams) {

    }

    getLocation(params: GetLocationParams): Promise<GetLocationResult> {
        return Promise.reject();
    }

    mapSearch(params: MapSearchParams): Promise<MapSearchResult> {
        return Promise.reject();
    }

    mapView(params: MapViewParams): void {

    }
}